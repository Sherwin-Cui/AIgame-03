// 游戏状态管理
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        // 深拷贝初始状态
        this.playerState = JSON.parse(JSON.stringify(GameConfig.initialState.playerState));
        this.npcStates = JSON.parse(JSON.stringify(GameConfig.initialState.npcStates));
        this.selectedItem = null;
        this.dialogueHistory = [];
        this.gameStatus = 'InProgress';
    }
    
    // 更新玩家状态
    updatePlayerState(newState) {
        // 确保 attributes 存在
        if (!newState || !newState.attributes) {
            console.warn('[GameState] 新状态缺少 attributes 字段');
            return;
        }
        
        // 确保当前状态的 attributes 存在
        if (!this.playerState.attributes) {
            this.playerState.attributes = {};
        }
        
        const oldAttributes = {...this.playerState.attributes};
        this.playerState = newState;
        
        // 计算属性变化
        const changes = {};
        for (const [key, value] of Object.entries(newState.attributes)) {
            if (key !== '数值分析' && oldAttributes[key] !== undefined && oldAttributes[key] !== value) {
                changes[key] = value - oldAttributes[key];
            }
        }
        
        return changes;
    }
    
    // 更新NPC状态
    updateNPCState(npcName, newAttributes) {
        // 确保参数有效
        if (!npcName || !newAttributes) {
            console.warn('[GameState] updateNPCState 参数无效:', { npcName, newAttributes });
            return;
        }
        
        const npc = this.npcStates.find(n => n.name === npcName);
        if (!npc) {
            console.warn('[GameState] 未找到NPC:', npcName);
            return;
        }
        
        // 确保NPC的attributes存在
        if (!npc.attributes) {
            npc.attributes = {};
        }
        
        const oldAttributes = {...npc.attributes};
        npc.attributes = newAttributes;
        
        // 计算变化
        const changes = {};
        for (const [key, value] of Object.entries(newAttributes)) {
            if (key !== '数值分析' && oldAttributes[key] !== undefined && oldAttributes[key] !== value) {
                changes[key] = value - oldAttributes[key];
            }
        }
        
        return changes;
    }
    
    // 添加对话历史
    addDialogueHistory(text) {
        this.dialogueHistory.push(text);
        if (this.dialogueHistory.length > GameConfig.rules.maxDialogueHistory) {
            this.dialogueHistory.shift();
        }
    }
    
    // 获取NPC
    getNPC(name) {
        return this.npcStates.find(n => n.name === name);
    }
    
    // 检查是否有道具
    hasItem(itemName) {
        return this.playerState.inventory.some(item => item.itemName === itemName);
    }
    
    // 添加道具
    addItem(item) {
        if (!this.hasItem(item.itemName)) {
            this.playerState.inventory.push(item);
            return true;
        }
        return false;
    }
}