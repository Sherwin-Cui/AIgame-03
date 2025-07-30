// 对话系统
class DialogueSystem {
    constructor(gameState, uiManager) {
        this.gameState = gameState;
        this.uiManager = uiManager;
        this.responseParser = new ResponseParser(this);
    }
    
    // 处理用户输入
    async handleUserInput(message) {
        if (!message.trim()) {
            DebugLogger.warn('DialogueSystem', '用户输入为空，忽略处理');
            return;
        }
        
        DebugLogger.logGameEvent('user_input', '用户发送消息', {
            message: message,
            selectedItem: this.gameState.selectedItem,
            currentState: this.gameState.playerState.name
        });
        
        // 显示用户消息
        const userDialogueData = {
            speaker: this.gameState.playerState.name,
            content: message,
            isPlayer: true,
            usedItem: this.gameState.selectedItem
        };
        DebugLogger.log('DialogueSystem', '用户对话数据:', userDialogueData);
        this.uiManager.dialogueUI.addDialogue(userDialogueData);
        
        // 添加到历史
        let historyText = `${this.gameState.playerState.name}: ${message}`;
        if (this.gameState.selectedItem) {
            historyText += ` [使用道具: ${this.gameState.selectedItem.itemName}]`;
            DebugLogger.log('DialogueSystem', '使用道具', this.gameState.selectedItem);
        }
        this.gameState.addDialogueHistory(historyText);
        
        // 清空选中的道具
        if (this.gameState.selectedItem) {
            this.consumeItem(this.gameState.selectedItem);
            this.gameState.selectedItem = null;
            this.uiManager.updateSelectedItem(null);
            DebugLogger.log('DialogueSystem', '道具已消耗并清空选择');
        }
        
        // 调用AI获取响应
        try {
            DebugLogger.log('DialogueSystem', '开始请求AI响应...');
            const response = await window.aiService.generateResponse(
                this.gameState, 
                message
            );
            DebugLogger.logGameEvent('ai_response', 'AI响应处理开始', response);
            this.processAIResponse(response);
        } catch (error) {
            DebugLogger.error('DialogueSystem', 'AI响应错误', error);
            this.uiManager.dialogueUI.addDialogue({
                character: '系统',
                content: '抱歉，AI响应出现错误，请重试。',
                isNpc: true
            });
        }
    }
    
    // 处理AI响应
    processAIResponse(response) {
        DebugLogger.log('DialogueSystem', '开始处理AI响应:', response);
        
        try {
            // 使用新的ResponseParser解析响应
            const parsedData = this.responseParser.parseResponse(response);
            DebugLogger.log('DialogueSystem', '解析后的数据:', parsedData);
            
            // 处理对话
            if (parsedData.dialogue && parsedData.dialogue.length > 0) {
                DebugLogger.log('DialogueSystem', '找到对话数据，数量:', parsedData.dialogue.length);
                parsedData.dialogue.forEach((dialogueItem, index) => {
                    DebugLogger.log('DialogueSystem', `处理对话 ${index + 1}:`, dialogueItem);
                    this.uiManager.dialogueUI.addDialogue(dialogueItem);
                    
                    // 添加到历史记录
                    const historyText = dialogueItem.type === 'narration' ? 
                        `旁白: ${dialogueItem.content}` : 
                        `${dialogueItem.speaker}: ${dialogueItem.content}`;
                    this.gameState.addDialogueHistory(historyText);
                });
            } else {
                DebugLogger.warn('DialogueSystem', '响应中没有找到对话数据');
            }
            
            // 处理玩家状态变化
            if (parsedData.playerChanges) {
                DebugLogger.log('DialogueSystem', '更新玩家状态:', parsedData.playerChanges);
                this.gameState.updatePlayerState(parsedData.playerChanges.attributes);
                
                // 显示属性变化
                if (parsedData.playerChanges.displayChanges && parsedData.playerChanges.displayChanges.length > 0) {
                    this.uiManager.dialogueUI.showAttributeChanges('玩家', parsedData.playerChanges.displayChanges);
                }
                
                // 更新UI显示
                this.uiManager.statusUI.updatePlayerAttributes(
                    this.gameState.playerState.attributes,
                    parsedData.playerChanges.changes || {}
                );
            }
            
            // 处理NPC状态变化
            if (parsedData.npcChanges) {
                DebugLogger.log('DialogueSystem', '更新NPC状态:', parsedData.npcChanges);
                Object.entries(parsedData.npcChanges).forEach(([npcName, npcData]) => {
                    this.gameState.updateNPCState(npcName, npcData.attributes);
                    
                    // 显示属性变化
                    if (npcData.displayChanges && npcData.displayChanges.length > 0) {
                        this.uiManager.dialogueUI.showAttributeChanges(npcName, npcData.displayChanges);
                    }
                });
            }
            
            // 处理道具获得
            if (parsedData.itemObtained) {
                DebugLogger.log('DialogueSystem', '获得道具:', parsedData.itemObtained);
                this.uiManager.dialogueUI.showItemObtained(parsedData.itemObtained);
                
                // 添加到玩家背包
                if (this.gameState.addItem(parsedData.itemObtained)) {
                    this.uiManager.updateInventory(this.gameState.playerState.inventory);
                }
            }
            
            // 检查游戏结束
            if (parsedData.gameEnd && parsedData.gameEnd.isEnd) {
                DebugLogger.log('DialogueSystem', '游戏结束:', parsedData.gameEnd);
                this.handleGameEnd(parsedData.gameEnd);
            }
            
        } catch (error) {
            DebugLogger.error('DialogueSystem', '处理AI响应时发生错误:', error);
            this.uiManager.dialogueUI.showWarning('处理AI响应时发生错误，请重试');
        }
    }
    
    // 消耗道具
    consumeItem(item) {
        const index = this.gameState.playerState.inventory.findIndex(
            i => i.itemName === item.itemName
        );
        if (index >= 0) {
            const inventoryItem = this.gameState.playerState.inventory[index];
            inventoryItem.quantity--;
            if (inventoryItem.quantity <= 0) {
                this.gameState.playerState.inventory.splice(index, 1);
            }
            this.uiManager.updateInventory(this.gameState.playerState.inventory);
        }
    }
    
    // 处理游戏结束
    handleGameEnd(gameEndData) {
        DebugLogger.log('DialogueSystem', '处理游戏结束:', gameEndData);
        
        // 显示结局界面
        const endSceneData = {
            isEnd: gameEndData.isEnd,
            endType: gameEndData.endType,
            reason: gameEndData.reason,
            playerState: this.gameState.playerState
        };
        
        this.uiManager.dialogueUI.showEndScene(endSceneData);
        
        // 禁用输入
        const inputArea = document.getElementById('input-area');
        if (inputArea) {
            inputArea.style.display = 'none';
        }
    }
}