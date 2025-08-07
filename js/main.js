// 草船借箭 - 主入口文件
import { StateManager } from './core/stateManager.js';
import { AIManager } from './core/aiManager.js';
import { GameEngine } from './core/gameEngine.js';
import { UIManager } from './ui/uiManager.js';
import { PromptBuilder } from './promptBuilder.js';

// 全局变量
let gameInstance = null;
let selectedItem = 'none'; // 当前选中的道具
let aiDisabled = false; // AI禁用开关

// 测试功能已移至 testUtils.js 文件

// 游戏主类
class Game {
    constructor() {
        this.stateManager = new StateManager();
        this.aiManager = new AIManager();
        this.gameEngine = new GameEngine(this.stateManager, this.aiManager);
        this.uiManager = new UIManager(this.stateManager, this.gameEngine);
        
        this.isProcessing = false;
        
        // 设置全局游戏实例，供控制台测试使用
        gameInstance = this;
    }
    
    async initialize() {
        console.log('初始化草船借箭游戏...');
        
        // 确保gameData完全加载后重新注册事件处理器
        this.gameEngine.registerAllEventHandlers();
        console.log('事件处理器注册完成，数量:', this.gameEngine.eventHandlers.size);
        
        // 初始化UI
        this.uiManager.initialize();
        
        // 设置全局引用
        window.uiManager = this.uiManager;
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 显示开场对话
        this.showOpeningDialogue();
        
        // 设置默认道具选择
        setTimeout(() => {
            window.selectItem('none');
        }, 100);
        
        console.log('游戏初始化完成');
    }
    
    setupEventListeners() {
        // 回车键发送消息
        const playerInput = document.getElementById('player-input');
        playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isProcessing) {
                this.sendMessage();
            }
        });
        
        // 发送按钮
        const sendBtn = document.getElementById('send-btn');
        sendBtn.addEventListener('click', () => {
            if (!this.isProcessing) {
                this.sendMessage();
            }
        });
    }
    
    showOpeningDialogue() {
        const currentChapter = this.stateManager.state.chapter;
        const chapterData = this.stateManager.gameData?.chapters[`chapter${currentChapter}`];
        const openingText = chapterData ? chapterData.openingText : "游戏开始";
        
        // 更新页面标题和header
        this.uiManager.updateChapterHeader(currentChapter);
        
        // 将开场文字添加到对话历史中，确保在第一次调用AI时显示
        this.stateManager.addDialogue('system', openingText, 'opening');
        this.uiManager.addDialogue('system', null, openingText);
        
        // 自动调用AI进行第一次响应
        this.autoCallAI();
    }
    
    async autoCallAI() {
        try {
            this.isProcessing = true;
            
            // 显示AI思考气泡
            if (typeof this.uiManager.showAIThinking === 'function') {
                this.uiManager.showAIThinking(true);
            } else {
                this.uiManager.showLoading(true);
            }
            
            // 调用AI，不传入玩家发言（自动触发）
            const result = await this.gameEngine.processPlayerInput('');
            
            // 隐藏AI思考气泡
            if (typeof this.uiManager.showAIThinking === 'function') {
                this.uiManager.showAIThinking(false);
            } else {
                this.uiManager.showLoading(false);
            }
            
            // 显示AI响应
            if (result.success) {
                this.handleGameResponse(result.data);
            } else {
                this.handleError(result.error);
            }
            
        } catch (error) {
            console.error('\n=== 自动调用AI失败 ===');
            console.error('错误信息:', error.message);
            if (typeof this.uiManager.showAIThinking === 'function') {
                this.uiManager.showAIThinking(false);
            } else {
                this.uiManager.showLoading(false);
            }
            this.handleError('系统出现错误，请稍后重试');
        } finally {
            this.isProcessing = false;
        }
    }
    
    async sendMessage() {
        const input = document.getElementById('player-input');
        const message = input.value.trim();
        
        if (!message) {
            return;
        }
        
        // 防止重复提交
        if (this.isProcessing) {
            return;
        }
        
        try {
            this.isProcessing = true;
            
            // 构建包含道具信息的完整消息
            let fullMessage = message;
            if (selectedItem !== 'none') {
                const itemNames = {
                    'xuande-brush': '玄德亲笔',
                    'dongwu-tiger': '东吴虎符'
                };
                fullMessage += ` [使用道具：${itemNames[selectedItem]}]`;
            }
            
            // 显示玩家输入（包含道具信息）
            this.uiManager.addDialogue('player', '诸葛亮', fullMessage);
            input.value = '';
            
            // 显示AI思考气泡
            this.uiManager.showAIThinking(true);
            

            
            let result;
            if (aiDisabled) {
                // AI禁用时，返回空响应
                console.log('AI已禁用，跳过AI调用');
                result = {
                    success: true,
                    data: {
                        narrative: "AI回复已禁用，请使用控制台测试功能。",
                        npc_dialogue: null
                    }
                };
            } else {
                // 处理游戏逻辑
                result = await this.gameEngine.processPlayerInput(fullMessage);
            }
            
            // 隐藏AI思考气泡
            this.uiManager.showAIThinking(false);
            
            // 显示AI响应（数值变化动画在handleGameResponse中统一处理）
            if (result.success) {
                this.handleGameResponse(result.data);
            } else {
                this.handleError(result.error);
            }
            
        } catch (error) {
            console.error('处理消息时出错:', error);
            this.uiManager.showAIThinking(false);
            this.handleError('系统出现错误，请稍后重试');
        } finally {
            this.isProcessing = false;
        }
    }
    
    // useItem方法已移除，现在通过selectItem选择道具，在sendMessage时一起发送
    
    handleGameResponse(response) {
        // 显示叙述文本
        if (response.narrative) {
            this.uiManager.addDialogue('system', '', response.narrative);
        }
        
        // 显示NPC对话
        if (response.npc_dialogue) {
            setTimeout(() => {
                this.uiManager.addDialogue('npc', response.npc_dialogue.speaker, response.npc_dialogue.content);
            }, 1000);
        }
        
        // 数值变化已在gameEngine中处理，这里只需要更新UI
        if (response.value_changes) {
            // 更新状态栏显示
            this.uiManager.updateStatusBar();
            
            // 显示数值变化动画
            if (response.oldStateForAnimation) {
                const newState = this.stateManager.getState();
                this.showValueChangeAnimations(response.oldStateForAnimation, newState);
            }
        }
        
        // 处理道具获得通知
        if (response.itemNotifications && response.itemNotifications.length > 0) {
            response.itemNotifications.forEach((notification, index) => {
                if (notification.type === 'item_gained') {
                    // 延迟显示道具获得弹窗
                    setTimeout(() => {
                        this.uiManager.showItemGainedDialog(notification);
                    }, 1500 + index * 500); // 多个道具依次显示
                }
            });
        }

        // 处理自动触发的事件
        if (response.autoEvents && response.autoEvents.length > 0) {
            response.autoEvents.forEach((event, index) => {
                if (event.type === 'choice_event') {
                    // 延迟显示抉择事件弹窗
                    const delay = 2000 + index * 500;
                    setTimeout(() => {
                        this.uiManager.showEventDialog(event);
                    }, delay);
                } else if (event.type === 'dialogue_event') {
                    // 延迟显示对话事件弹窗
                    setTimeout(() => {
                        this.uiManager.showEventDialog(event);
                    }, 2000 + index * 500);
                } else if (event.type === 'check_event') {
                    // 延迟显示检定事件弹窗
                    setTimeout(() => {
                        this.uiManager.showEventDialog(event);
                    }, 2000 + index * 500);
                }
            });
        } else {
            console.log('🎯 没有autoEvents需要处理');
            console.log('🎯 response.autoEvents:', response.autoEvents);
        }
        
        // 旧的event_suggestion处理逻辑已删除，统一使用autoEvents机制
        
        // 处理章节结束
        if (response.chapterEnd) {
            console.log('检测到章节结束:', response.chapterEnd);
            setTimeout(() => {
                this.uiManager.showChapterTransition(response.chapterEnd);
            }, 3000); // 延迟显示转场，让其他内容先显示完
        }
        
        // 更新UI状态
        this.uiManager.updateGameInfo();
    }
    
    // 显示数值变化动画
    showValueChangeAnimations(oldState, newState) {
        const currentChapter = newState.currentChapter || 1;
        
        // 第一章数值变化
        if (currentChapter === 1) {
            // 检查周瑜猜忌值变化
            const oldSuspicion = oldState.zhouYu ? oldState.zhouYu.suspicion : 0;
            const newSuspicion = newState.zhouYu ? newState.zhouYu.suspicion : 0;
            if (oldSuspicion !== newSuspicion) {
                this.uiManager.animateValueChange('suspicion', oldSuspicion, newSuspicion);
            }
            
            // 检查鲁肃信任值变化
            const oldTrust = oldState.luSu ? oldState.luSu.trust : 0;
            const newTrust = newState.luSu ? newState.luSu.trust : 0;
            if (oldTrust !== newTrust) {
                this.uiManager.animateValueChange('trust', oldTrust, newTrust);
            }
        }
        
        // 第二章数值变化
        if (currentChapter === 2) {
            // 检查准备进度变化
            const oldProgress = oldState.preparationProgress || 0;
            const newProgress = newState.preparationProgress || 0;
            if (oldProgress !== newProgress) {
                this.uiManager.animateValueChange('preparation-progress', oldProgress, newProgress);
            }
        }
        
        // 第三章数值变化
        if (currentChapter === 3) {
            // 检查危险等级变化
            const oldDanger = oldState.dangerLevel || 0;
            const newDanger = newState.dangerLevel || 0;
            if (oldDanger !== newDanger) {
                this.uiManager.animateValueChange('danger-level', oldDanger, newDanger);
            }
            
            // 检查士兵士气变化
            const oldMorale = oldState.soldierMorale || 50;
            const newMorale = newState.soldierMorale || 50;
            if (oldMorale !== newMorale) {
                this.uiManager.animateValueChange('soldier-morale', oldMorale, newMorale);
            }
            
            // 检查船只损失变化
            const oldShipLoss = oldState.shipLoss || 0;
            const newShipLoss = newState.shipLoss || 0;
            if (oldShipLoss !== newShipLoss) {
                this.uiManager.animateValueChange('ship-loss', oldShipLoss, newShipLoss);
            }
            
            // 检查箭支数量变化
            const oldArrows = oldState.arrows || 0;
            const newArrows = newState.arrows || 0;
            if (oldArrows !== newArrows) {
                this.uiManager.animateValueChange('arrow-count', oldArrows, newArrows);
            }
        }
        
        // 检查时间进度变化（所有章节通用）
        if (oldState.timeProgress !== newState.timeProgress) {
            this.uiManager.animateValueChange('time-progress', oldState.timeProgress, newState.timeProgress);
        }
        
        // 更新游戏信息显示
        this.uiManager.updateGameInfo();
    }
    
    // 旧的handleEvents方法已删除，统一使用autoEvents机制处理事件
    
    handleError(error) {
        console.error('游戏错误:', error);
        this.uiManager.addDialogue('system', '', `系统提示：${error}`);
    }
    
    handleGameEnd(result) {
        const endMessage = result.success 
            ? `🎉 恭喜！你成功完成了第一章！\n\n${result.reason}\n\n你的智慧和策略得到了验证。`
            : `💔 很遗憾，任务失败了...\n\n${result.reason}\n\n不过没关系，可以重新开始挑战！`;
        
        this.uiManager.addDialogue('system', '', endMessage);
        
        // 禁用输入
        document.getElementById('player-input').disabled = true;
        document.getElementById('send-btn').disabled = true;
        document.getElementById('item-btn').disabled = true;
    }
    
    // 处理事件选择
    async handleEventChoice(eventId, choiceIndex) {
        try {
            // 从gameData中获取事件数据
            const eventData = this.stateManager.gameData?.events?.[eventId];
            if (!eventData || !eventData.options) {
                console.error('事件数据不存在或没有选项:', eventId);
                return;
            }
            
            // 获取选择的选项
            const optionKeys = Object.keys(eventData.options);
            const selectedKey = optionKeys[choiceIndex];
            const selectedOption = eventData.options[selectedKey];
            
            if (!selectedOption) {
                console.error('选择的选项不存在:', choiceIndex);
                return;
            }
            
            // 将选择的文本作为玩家输入
            const choiceText = selectedOption.text;
            console.log('玩家选择:', choiceText);
            
            // 显示玩家的选择
            this.uiManager.addDialogue('player', '诸葛亮', choiceText);
            
            // 设置处理状态
            this.isProcessing = true;
            
            // 显示AI思考
            if (typeof this.uiManager.showAIThinking === 'function') {
                this.uiManager.showAIThinking(true);
            } else {
                this.uiManager.showLoading(true);
            }
            

            
            // 将选择作为玩家输入处理
            const result = await this.gameEngine.processPlayerInput(choiceText);
            
            // 隐藏AI思考
            if (typeof this.uiManager.showAIThinking === 'function') {
                this.uiManager.showAIThinking(false);
            } else {
                this.uiManager.showLoading(false);
            }
            
            // 处理AI响应（数值变化动画在handleGameResponse中统一处理）
            if (result.success) {
                this.handleGameResponse(result.data);
            } else {
                this.handleError(result.error);
            }
            
        } catch (error) {
            console.error('处理事件选择时出错:', error);
            this.handleError(error.message);
        } finally {
            this.isProcessing = false;
        }
    }
}

// 全局函数（供HTML调用）
window.sendMessage = function() {
    if (gameInstance) {
        gameInstance.sendMessage();
    }
};

// 移除了useItem函数，现在使用selectItem来选择道具

// 全局函数：显示角色信息
window.showCharacterInfo = function(characterName) {
    if (gameInstance && gameInstance.uiManager) {
        gameInstance.uiManager.showCharacterInfo(characterName);
    }
};

// 全局道具选择函数
window.selectItem = function(itemName) {
    // 移除所有选中状态
    document.querySelectorAll('.item-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 添加选中状态到当前选项
    const selectedOption = document.querySelector(`[data-item="${itemName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // 更新全局选中状态
    selectedItem = itemName;
    
    // 如果取消选择，重置道具选择区域
    if (itemName === 'none' && window.uiManager) {
        const itemOptions = document.getElementById('item-options');
        if (itemOptions) {
            itemOptions.innerHTML = '<span class="item-option selected" data-item="none">不使用道具</span>';
        }
        // 移除道具的选中状态
        window.uiManager.updateItemSelectionUI('none');
    }
};

// 设置全局uiManager引用
window.uiManager = null;

// 处理事件选择
window.selectEventChoice = function(eventId, choiceIndex) {
    console.log('选择事件选项:', eventId, choiceIndex);
    
    // 关闭事件弹窗
    const overlay = document.querySelector('.event-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // 处理选择结果
    if (gameInstance) {
        gameInstance.handleEventChoice(eventId, choiceIndex);
    }
};

// 关闭事件对话框并添加到历史记录
window.closeEventDialog = function(eventId, eventType) {
    // 移除弹窗
    const overlay = document.querySelector('.event-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // 如果是对话事件，将内容添加到历史记录
    if (eventType === 'dialogue_event' && gameInstance) {
        const eventData = gameInstance.stateManager.gameData?.events?.[eventId];
        if (eventData && eventData.content) {
            // 添加到对话历史
            gameInstance.stateManager.addDialogue('system', eventData.content, 'dialogue_event');
            // 同时在UI中显示
            gameInstance.uiManager.addDialogue('system', null, eventData.content);
            
            // 触发AI自动响应
            setTimeout(() => {
                gameInstance.autoCallAI();
            }, 1000);
        }
    }
};

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
    try {
        gameInstance = new Game();
        await gameInstance.initialize();
        console.log('\n=== 游戏初始化完成 ===');
        
        // 将游戏实例暴露到全局，用于调试
        window.game = gameInstance;
        window.gameInstance = gameInstance; // 为了兼容UI中的引用
        console.log('游戏实例已暴露到 window.game 和 window.gameInstance');
        
        console.log('\n=== 草船借箭游戏启动成功！ ===');
        console.log('\n🎮 === 草船借箭 控制台测试功能 ===');
        console.log('\n📋 可用的全局函数:');
        console.log('• sendMessage() - 发送消息');
        console.log('• showCharacterInfo(name) - 显示角色信息');
        console.log('• selectItem(name) - 选择道具');
        console.log('• selectEventChoice(eventId, choiceIndex) - 选择事件选项');
        console.log('• closeEventDialog(eventId, eventType) - 关闭事件对话框');
        
        console.log('\n🧪 控制台测试功能:');
        console.log('• testAIResponse(jsonString) - 直接测试AI响应JSON');
        console.log('• getTestTemplates() - 获取所有测试模板');
        console.log('• quickTest(templateName) - 快速测试指定模板');
        console.log('• disableAI() - 禁用AI回复');
        console.log('• enableAI() - 启用AI回复');
        console.log('• getAIStatus() - 查看AI状态');
        
        console.log('\n🚀 快速测试命令:');
        console.log('• quickTest("dialogue_event2") - 测试立下军令状事件');
        console.log('• quickTest("dialogue_event4") - 测试天机预测事件');
        console.log('• quickTest("check_event1_success") - 测试说服鲁肃成功');
        console.log('• quickTest("check_event2_success") - 测试智谋对决成功');
        console.log('• quickTest("check_event3_success") - 测试夜间准备成功');
        console.log('• quickTest("check_event4_great_success") - 测试擂鼓借箭大成功');
        console.log('• quickTest("choice_event1") - 测试应对挑衅抉择事件');
        console.log('• quickTest("multiple_items") - 测试多道具获得');
        
        console.log('\n💡 使用提示:');
        console.log('1. 建议先执行 disableAI() 禁用AI回复，专注测试');
        console.log('2. 使用 getTestTemplates() 查看所有可用模板');
        console.log('3. 使用 quickTest(模板名) 快速测试');
        console.log('4. 使用 testAIResponse(自定义JSON) 测试自定义响应');
        console.log('5. 所有测试都会触发完整的游戏流程，包括弹窗和状态更新');
        console.log('6. 测试完成后可用 enableAI() 重新启用AI回复');
        
    } catch (error) {
        console.error('\n=== 游戏初始化失败 ===');
        console.error('错误信息:', error.message);
        alert('游戏初始化失败，请刷新页面重试');
    }
});