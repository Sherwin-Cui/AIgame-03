// UI管理器 - 负责界面更新和用户交互
import { characters } from '../data/gameData.js';

export class UIManager {
    constructor(stateManager, gameEngine) {
        this.stateManager = stateManager;
        this.gameEngine = gameEngine;
        this.elements = {};
    }
    
    // 初始化UI
    initialize() {
        this.cacheElements();
        this.updateStatusBar();
        this.updateGameInfo();
        this.setupScrollBehavior();
        
        // UI管理器初始化完成
    }
    
    // 显示AI思考气泡
    showAIThinking(show) {
        if (show) {
            // 创建AI思考气泡（不显示人物名称）
            const thinkingBubble = document.createElement('div');
            thinkingBubble.id = 'ai-thinking-bubble';
            thinkingBubble.className = 'dialogue-item ai-thinking';
            thinkingBubble.innerHTML = `
                <div class="content">
                    <span class="thinking-dots">
                        <span class="dot">.</span>
                        <span class="dot">.</span>
                        <span class="dot">.</span>
                    </span>
                </div>
            `;
            
            // 添加到对话区域
            if (this.elements.dialogueArea) {
                this.elements.dialogueArea.appendChild(thinkingBubble);
                this.scrollToBottom();
            }
        } else {
            // 移除AI思考气泡
            const thinkingBubble = document.getElementById('ai-thinking-bubble');
            if (thinkingBubble) {
                thinkingBubble.remove();
            }
        }
        
        // 禁用/启用输入
        this.setInputEnabled(!show);
    }
    
    // 缓存DOM元素
    cacheElements() {
        this.elements = {
            // 状态栏元素
            suspicion: document.getElementById('suspicion'),
            trust: document.getElementById('trust'),
            timeProgress: document.getElementById('time-progress'),
            
            // 第二章专属元素
            preparationProgress: document.getElementById('preparation-progress'),
            
            // 第三章专属元素
            dangerLevel: document.getElementById('danger-level'),
            soldierMorale: document.getElementById('soldier-morale'),
            shipLoss: document.getElementById('ship-loss'),
            arrows: document.getElementById('arrows'),
            
            // 对话区域
            dialogueArea: document.getElementById('dialogue-area'),
            
            // 输入区域
            playerInput: document.getElementById('player-input'),
            sendBtn: document.getElementById('send-btn'),
            itemBtn: document.getElementById('item-btn'),
            
            // 游戏信息
            currentSituation: document.getElementById('current-situation'),
            
            // 道具显示区域
            itemsDisplay: document.getElementById('items-display'),
            itemsList: document.getElementById('items-list'),
            
            // 加载界面
            loading: document.getElementById('loading')
        };
        
        // 检查必要元素是否存在
        const missingElements = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
        
        if (missingElements.length > 0) {
            console.warn('缺少UI元素:', missingElements);
        }
    }
    
    // 更新状态栏
    updateStatusBar() {
        const state = this.stateManager.getState();
        
        // 根据章节显示不同的状态栏
        const chapter = state.chapter || 1;
        
        if (chapter === 1) {
            // 第一章：显示猜忌值和信任值
            if (this.elements.suspicion) {
                const suspicionValue = state.zhouYu ? state.zhouYu.suspicion : state.suspicion || 0;
                this.elements.suspicion.textContent = suspicionValue;
                this.updateValueColor(this.elements.suspicion, suspicionValue, 'suspicion');
            }
            
            if (this.elements.trust) {
                const trustValue = state.luSu ? state.luSu.trust : state.trust || 0;
                this.elements.trust.textContent = trustValue;
                this.updateValueColor(this.elements.trust, trustValue, 'trust');
            }
        } else if (chapter === 2) {
            // 第二章：显示准备进度
            if (this.elements.preparationProgress) {
                const prepValue = state.preparationProgress || 0;
                this.elements.preparationProgress.textContent = prepValue;
                this.updateValueColor(this.elements.preparationProgress, prepValue, 'progress');
            }
            
            // 隐藏第一章的元素
            if (this.elements.suspicion && this.elements.suspicion.parentElement) {
                this.elements.suspicion.parentElement.style.display = 'none';
            }
            if (this.elements.trust && this.elements.trust.parentElement) {
                this.elements.trust.parentElement.style.display = 'none';
            }
        } else if (chapter === 3) {
            // 第三章：显示危险等级、士兵士气、船只损失、箭支数量
            if (this.elements.dangerLevel) {
                const dangerValue = state.dangerLevel || 0;
                this.elements.dangerLevel.textContent = dangerValue;
                this.updateValueColor(this.elements.dangerLevel, dangerValue, 'danger');
            }
            
            if (this.elements.soldierMorale) {
                const moraleValue = state.soldierMorale || 80;
                this.elements.soldierMorale.textContent = moraleValue;
                this.updateValueColor(this.elements.soldierMorale, moraleValue, 'morale');
            }
            
            if (this.elements.shipLoss) {
                const shipValue = state.shipLoss || 0;
                this.elements.shipLoss.textContent = shipValue;
            }
            
            if (this.elements.arrows) {
                const arrowValue = state.arrows || 0;
                this.elements.arrows.textContent = arrowValue;
            }
        }
        
        // 时间进度（所有章节都显示）
        if (this.elements.timeProgress) {
            const timeValue = state.timeProgress || 1;
            const timeText = `第${timeValue}日`;
            this.elements.timeProgress.textContent = timeText;
        }
    }
    
    // 更新数值颜色
    updateValueColor(element, value, type) {
        // 移除所有颜色类
        element.classList.remove('value-low', 'value-medium', 'value-high');
        
        if (type === 'suspicion') {
            if (value <= 30) {
                element.classList.add('value-low');
            } else if (value <= 70) {
                element.classList.add('value-medium');
            } else {
                element.classList.add('value-high');
            }
        } else if (type === 'trust') {
            if (value <= 30) {
                element.classList.add('value-high');
            } else if (value <= 70) {
                element.classList.add('value-medium');
            } else {
                element.classList.add('value-low');
            }
        } else if (type === 'progress') {
            if (value <= 30) {
                element.classList.add('value-high'); // 进度低是危险的
            } else if (value <= 70) {
                element.classList.add('value-medium');
            } else {
                element.classList.add('value-low'); // 进度高是好的
            }
        } else if (type === 'danger') {
            if (value <= 30) {
                element.classList.add('value-low'); // 危险低是好的
            } else if (value <= 70) {
                element.classList.add('value-medium');
            } else {
                element.classList.add('value-high'); // 危险高是坏的
            }
        } else if (type === 'morale') {
            if (value <= 30) {
                element.classList.add('value-high'); // 士气低是危险的
            } else if (value <= 70) {
                element.classList.add('value-medium');
            } else {
                element.classList.add('value-low'); // 士气高是好的
            }
        }
    }
    
    // 添加对话
    addDialogue(type, speaker, content) {
        if (!this.elements.dialogueArea) {
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `dialogue-message ${type}`;
        
        let html = '';
        
        // 处理换行符
        const formattedContent = content.replace(/\n/g, '<br>');
        
        if (type === 'system') {
            // 系统消息不需要头像，保持原样式
            html = `<div class="content">${formattedContent}</div>`;
        } else if (type === 'npc' || type === 'player') {
            // NPC和玩家消息需要头像
            const avatarText = this.getAvatarText(speaker);
            html = `
                <div class="dialogue-avatar">${avatarText}</div>
                <div class="dialogue-content">
                    <div class="content">${formattedContent}</div>
                </div>
            `;
        } else {
            // 其他类型保持原样式
            if (speaker) {
                html += `<div class="speaker">${speaker}</div>`;
            }
            html += `<div class="content">${formattedContent}</div>`;
        }
        
        messageDiv.innerHTML = html;
        
        this.elements.dialogueArea.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 添加打字机效果（可选）
        // this.addTypewriterEffect(messageDiv.querySelector('.content'));
    }
    
    // 获取头像文字
    getAvatarText(speaker) {
        if (!speaker) return '?';
        
        // 根据说话者返回对应的头像文字
        const avatarMap = {
            '诸葛亮': '诸',
            '周瑜': '周', 
            '鲁肃': '鲁',
            '甘宁': '甘',
            '孙权': '孙',
            '黄盖': '黄',
            '程普': '程'
        };
        
        return avatarMap[speaker] || speaker.charAt(0);
    }
    
    // 打字机效果
    addTypewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, 30);
    }
    
    // 滚动到底部
    scrollToBottom() {
        if (this.elements.dialogueArea) {
            this.elements.dialogueArea.scrollTop = this.elements.dialogueArea.scrollHeight;
        }
    }
    
    // 设置滚动行为
    setupScrollBehavior() {
        // 自动滚动到底部的逻辑已在addDialogue中实现
    }
    
    // 显示加载状态
    showLoading(show) {
        if (this.elements.loading) {
            if (show) {
                this.elements.loading.classList.remove('hidden');
            } else {
                this.elements.loading.classList.add('hidden');
            }
        }
        
        // 禁用/启用输入
        this.setInputEnabled(!show);
    }
    
    // 启用/禁用输入
    setInputEnabled(enabled) {
        if (this.elements.playerInput) {
            this.elements.playerInput.disabled = !enabled;
        }
        if (this.elements.sendBtn) {
            this.elements.sendBtn.disabled = !enabled;
        }
    }
    
    // 更新游戏信息
    updateGameInfo() {
        // 游戏信息更新逻辑已简化，主要功能移至其他方法
    }
    
    // 生成情况描述文本
    generateSituationText(state) {
        let situation = '';
        
        const suspicion = state.zhouYu ? state.zhouYu.suspicion : state.suspicion || 0;
        const trust = state.luSu ? state.luSu.trust : state.trust || 0;
        
        if (suspicion > 80) {
            situation += '周瑜对你的猜忌已经非常严重。';
        } else if (suspicion > 60) {
            situation += '周瑜对你颇有猜忌。';
        } else if (suspicion > 40) {
            situation += '周瑜对你有些怀疑。';
        } else {
            situation += '周瑜对你的态度还算平和。';
        }
        
        if (trust > 70) {
            situation += ' 鲁肃对你非常信任。';
        } else if (trust > 50) {
            situation += ' 鲁肃对你比较信任。';
        } else if (trust > 30) {
            situation += ' 鲁肃对你有些信任。';
        } else {
            situation += ' 鲁肃对你缺乏信任。';
        }
        
        return situation;
    }
    
    // 显示道具详情
    showItemDetails(itemId, itemData) {
        const overlay = document.createElement('div');
        overlay.className = 'item-details-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const dialog = document.createElement('div');
        dialog.className = 'item-details-dialog';
        dialog.style.cssText = `
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            max-width: 300px;
            width: 85%;
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        
        const effectDescription = this.getItemEffectDescription(itemData);
        
        dialog.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #333; margin: 0 0 15px 0;">${itemData?.name || itemId}</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #dee2e6;">
                    <h4 style="color: #333; margin: 0 0 10px 0;">道具效果</h4>
                    <p style="margin: 0; line-height: 1.6; color: #666;">${effectDescription}</p>
                </div>
                ${itemData?.usage ? `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #dee2e6;">
                    <h4 style="color: #333; margin: 0 0 10px 0;">使用说明</h4>
                    <p style="margin: 0; line-height: 1.6; color: #666;">${itemData.usage.description || '无特殊说明'}</p>
                </div>
                ` : ''}
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #f8f9fa; color: #333; border: 1px solid #dee2e6; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 0 10px;">
                    关闭
                </button>
                <button onclick="window.selectItem('${itemId}'); this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #333; color: white; border: 1px solid #333; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 0 10px;">
                    选择使用
                </button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
    
    // 获取道具效果描述
    getItemEffectDescription(itemData) {
        if (!itemData?.effect) {
            return '暂无效果描述';
        }
        
        const effect = itemData.effect;
        
        switch (effect.type) {
            case 'checkBonus':
                return `提升${this.getAttributeName(effect.target)}检定成功率 +${effect.value}`;
            case 'attributeChange':
                return `影响${this.getAttributeName(effect.target)} ${effect.value > 0 ? '+' : ''}${effect.value}`;
            case 'special':
                return effect.description || '特殊效果道具';
            default:
                return itemData.effect.description || '未知效果';
        }
    }
    
    // 获取属性中文名称
    getAttributeName(attribute) {
        const names = {
            'eloquence': '口才',
            'intelligence': '智力',
            'luSu.trust': '鲁肃信任度',
            'zhouYu.suspicion': '周瑜猜忌度',
            'plotItem': '剧情道具'
        };
        return names[attribute] || attribute;
    }
    
    // 显示系统消息
    showSystemMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `system-message ${type}`;
        messageDiv.textContent = message;
        
        // 添加到页面顶部或指定位置
        document.body.appendChild(messageDiv);
        
        // 自动移除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
    
    // 显示确认对话框
    showConfirmDialog(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <p>${message}</p>
                <div class="dialog-buttons">
                    <button class="confirm-btn">确认</button>
                    <button class="cancel-btn">取消</button>
                </div>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 绑定事件
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm();
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        });
        
        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                if (onCancel) onCancel();
            }
        });
    }
    
    // 清空对话
    clearDialogue() {
        if (this.elements.dialogueArea) {
            this.elements.dialogueArea.innerHTML = '';
        }
    }
    
    // 重置UI
    reset() {
        this.clearDialogue();
        this.updateStatusBar();
        this.updateGameInfo();
        
        // 重置输入
        if (this.elements.playerInput) {
            this.elements.playerInput.value = '';
            this.elements.playerInput.disabled = false;
        }
    }
    
    // 获取玩家输入
    getPlayerInput() {
        return this.elements.playerInput ? this.elements.playerInput.value.trim() : '';
    }
    
    // 清空玩家输入
    clearPlayerInput() {
        if (this.elements.playerInput) {
            this.elements.playerInput.value = '';
        }
    }
    
    // 聚焦输入框
    focusInput() {
        if (this.elements.playerInput) {
            this.elements.playerInput.focus();
        }
    }
    
    // 显示角色信息弹窗
    showCharacterInfo(characterName) {
        const character = characters[characterName];
        if (!character) {
            console.warn('角色不存在:', characterName);
            return;
        }
        
        // 获取当前状态以显示实时数值
        const currentState = this.stateManager.getState();
        
        // 创建弹窗遮罩
        const overlay = document.createElement('div');
        overlay.className = 'character-info-overlay';
        
        // 创建弹窗内容
        const dialog = document.createElement('div');
        dialog.className = 'character-info-dialog';
        
        // 构建角色属性显示
        let attributesHtml = '';
        if (character.attributes) {
            Object.entries(character.attributes).forEach(([key, value]) => {
                let displayName = '';
                let currentValue = value;
                
                // 根据角色和属性类型获取当前数值
                switch (characterName) {
                    case 'zhugeLiang':
                        switch (key) {
                            case 'intelligence': displayName = '智谋值'; break;
                            case 'eloquence': displayName = '口才值'; break;
                            case 'stamina': displayName = '体力值'; break;
                        }
                        break;
                    case 'zhouYu':
                        switch (key) {
                            case 'intelligence': displayName = '智谋值'; break;
                            case 'suspicion': 
                                displayName = '猜忌值';
                                currentValue = currentState.zhouYu?.suspicion || value;
                                break;
                        }
                        break;
                    case 'luSu':
                        switch (key) {
                            case 'trust': 
                                displayName = '信任值';
                                currentValue = currentState.luSu?.trust || value;
                                break;
                        }
                        break;
                    case 'ganNing':
                        switch (key) {
                            case 'intelligence': displayName = '智谋值'; break;
                            case 'alertness': displayName = '机警值'; break;
                        }
                        break;
                }
                
                if (displayName) {
                    attributesHtml += `
                        <div class="attribute-item">
                            <div class="attribute-name">${displayName}</div>
                            <div class="attribute-value">${currentValue}</div>
                        </div>
                    `;
                }
            });
        }
        
        // 构建弹窗HTML
        dialog.innerHTML = `
            <button class="character-info-close" onclick="this.closest('.character-info-overlay').remove()">&times;</button>
            
            <div class="character-info-header">
                <div class="character-info-avatar">${character.name.charAt(0)}</div>
                <div class="character-info-name">${character.name}</div>
                <div class="character-info-title">${character.isPlayer ? '玩家角色' : 'NPC角色'}</div>
            </div>
            
            <div class="character-info-content">
                <div class="character-info-section">
                    <h4>角色描述</h4>
                    <div class="character-description">${character.description}</div>
                </div>
                
                ${attributesHtml ? `
                    <div class="character-info-section">
                        <h4>当前属性</h4>
                        <div class="character-attributes">
                            ${attributesHtml}
                        </div>
                    </div>
                ` : ''}
                

            </div>
        `;
        
        overlay.appendChild(dialog);
        
        // 点击遮罩关闭弹窗
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // 添加到页面
        document.body.appendChild(overlay);
        
        // 添加键盘事件监听（ESC关闭）
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // 动画效果：数值变化
    animateValueChange(elementId, oldValue, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const diff = newValue - oldValue;
        if (diff === 0) return;
        
        // 创建变化指示器
        const changeIndicator = document.createElement('span');
        changeIndicator.className = 'value-change';
        changeIndicator.textContent = diff > 0 ? `+${diff}` : `${diff}`;
        
        // 设置样式
        changeIndicator.style.cssText = `
            position: absolute;
            top: -5px;
            right: -30px;
            color: ${diff > 0 ? '#333' : '#666'};
            font-weight: bold;
            font-size: 14px;
            opacity: 1;
            transform: translateY(0);
            transition: all 1.5s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        // 确保父元素有相对定位
        const parent = element.parentNode;
        if (parent.style.position !== 'relative' && parent.style.position !== 'absolute') {
            parent.style.position = 'relative';
        }
        
        // 添加到父元素
        parent.appendChild(changeIndicator);
        
        // 触发动画
        setTimeout(() => {
            changeIndicator.style.opacity = '0';
            changeIndicator.style.transform = 'translateY(-30px)';
        }, 100);
        
        // 移除元素
        setTimeout(() => {
            if (changeIndicator.parentNode) {
                changeIndicator.parentNode.removeChild(changeIndicator);
            }
        }, 2000);
    }
    
    // 显示道具获得弹窗
    showItemGainedDialog(item) {
        const overlay = document.createElement('div');
        overlay.className = 'item-gained-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const dialog = document.createElement('div');
        dialog.className = 'item-gained-dialog';
        dialog.style.cssText = `
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            max-width: 300px;
            width: 85%;
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="color: #333; margin: 0 0 8px 0; font-size: 1.1em; font-weight: 600;">获得道具</h3>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin: 12px 0; border: 1px solid #dee2e6;">
                    <h4 style="color: #333; margin: 0 0 6px 0; font-size: 0.95em;">${item.itemName}</h4>
                    <p style="margin: 0; line-height: 1.4; color: #666; font-size: 0.85em;">${item.description}</p>
                </div>
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="
                            padding: 8px 16px;
                            background: #333;
                            color: white;
                            border: 1px solid #333;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 0.85em;
                        "
                        onmouseover="this.style.background='#555'"
                        onmouseout="this.style.background='#333'">
                    确定
                </button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        return overlay;
    }

    // 显示章节转场
    showChapterTransition(chapterEndResult) {
        // UIManager 显示章节转场
        
        // 创建全屏转场覆盖层
        const overlay = document.createElement('div');
        overlay.id = 'chapter-transition-overlay';
        overlay.className = 'chapter-transition-overlay';
        
        // 从 gameData 获取章节结束文本
        const currentChapter = chapterEndResult.chapter || this.stateManager.getState().chapter;
        const chapterKey = `chapter${currentChapter}`;
        const chapterData = this.stateManager.gameData?.chapters?.[chapterKey];
        
        // 根据结果类型显示不同内容
        let transitionContent = '';
        if (chapterEndResult.success) {
            // 从 gameData 获取成功结束文本
            const endTexts = chapterData?.chapterEndTexts?.success || {};
            const title = endTexts.title || chapterEndResult.title || `第${currentChapter}章 完成`;
            const description = endTexts.description || chapterEndResult.description || '成功完成任务！';
            
            // 根据结局类型显示不同的标题和描述
            let resultTitle = '🎉 成功！';
            let resultClass = 'success';
            
            if (chapterEndResult.ending) {
                // 如果是游戏结局，从 gameData 获取结局文本
                const endingData = chapterData?.endings?.[chapterEndResult.ending];
                if (endingData) {
                    switch (chapterEndResult.ending) {
                        case 'perfect':
                            resultTitle = '🌟 ' + (endingData.title || '完美成功！');
                            break;
                        case 'success':
                            resultTitle = '🎉 ' + (endingData.title || '成功！');
                            break;
                        case 'barely':
                            resultTitle = '⚡ ' + (endingData.title || '险胜！');
                            break;
                    }
                }
            }
            
            // 获取下一章节信息
            const nextChapter = chapterEndResult.nextChapter || (currentChapter + 1);
            const nextChapterData = this.stateManager.gameData?.chapters?.[`chapter${nextChapter}`];
            const nextChapterTitle = nextChapterData?.title || `第${nextChapter}章`;
            const nextChapterPreview = nextChapterData?.openingText?.substring(0, 50) + '...' || '即将开始新的章节...';
            
            transitionContent = `
                <div class="transition-content ${resultClass}">
                    <h1 class="chapter-title">${title}</h1>
                    <div class="result-text ${resultClass}">
                        <h2>${resultTitle}</h2>
                        <p>${description}</p>
                    </div>
                    <div class="next-chapter-preview">
                        <h3>${nextChapterTitle}</h3>
                        <p>${nextChapterPreview}</p>
                    </div>
                    <button class="continue-btn" onclick="window.gameInstance.uiManager.startNextChapter(${nextChapter})">进入${nextChapterTitle}</button>
                </div>
            `;
        } else {
            // 从 gameData 获取失败结束文本
            const endTexts = chapterData?.chapterEndTexts?.failure || {};
            const title = endTexts.title || chapterEndResult.title || `第${currentChapter}章 失败`;
            const description = endTexts.description || chapterEndResult.description || '任务失败，请重新尝试。';
            
            // 如果是游戏结局失败，从 gameData 获取失败结局文本
            if (chapterEndResult.ending === 'failure') {
                const failureEndingData = chapterData?.endings?.failure;
                if (failureEndingData) {
                    const failureTitle = failureEndingData.title || title;
                    const failureDescription = failureEndingData.description || description;
                    
                    transitionContent = `
                        <div class="transition-content failure">
                            <h1 class="chapter-title">${failureTitle}</h1>
                            <div class="result-text failure">
                                <h2>💔 ${failureEndingData.title || '失败'}</h2>
                                <p>${failureDescription}</p>
                            </div>
                            <div class="retry-options">
                                <button class="retry-btn" onclick="window.gameInstance.gameEngine.resetGame(); window.gameInstance.uiManager.hideChapterTransition();">重新开始</button>
                            </div>
                        </div>
                    `;
                } else {
                    transitionContent = `
                        <div class="transition-content failure">
                            <h1 class="chapter-title">${title}</h1>
                            <div class="result-text failure">
                                <h2>💔 失败</h2>
                                <p>${description}</p>
                            </div>
                            <div class="retry-options">
                                <button class="retry-btn" onclick="window.gameInstance.gameEngine.resetGame(); window.gameInstance.uiManager.hideChapterTransition();">重新开始</button>
                            </div>
                        </div>
                    `;
                }
            } else {
                transitionContent = `
                    <div class="transition-content failure">
                        <h1 class="chapter-title">${title}</h1>
                        <div class="result-text failure">
                            <h2>💔 失败</h2>
                            <p>${description}</p>
                        </div>
                        <div class="retry-options">
                            <button class="retry-btn" onclick="window.gameInstance.gameEngine.resetGame(); window.gameInstance.uiManager.hideChapterTransition();">重新开始</button>
                        </div>
                    </div>
                `;
            }
        }
        
        overlay.innerHTML = transitionContent;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .chapter-transition-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .transition-content {
                text-align: center;
                color: #333;
                max-width: 320px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                border: 1px solid #ccc;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .chapter-title {
                font-size: 1.3em;
                margin-bottom: 16px;
                color: #333;
                font-weight: 600;
            }
            
            .result-text h2 {
                font-size: 1.1em;
                margin-bottom: 12px;
                color: #666;
                font-weight: 500;
            }
            
            .result-text.success h2 {
                color: #333;
            }
            
            .result-text.failure h2 {
                color: #666;
            }
            
            .result-text p {
                font-size: 0.9em;
                line-height: 1.4;
                margin-bottom: 16px;
                color: #666;
            }
            
            .next-chapter-preview {
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            
            .next-chapter-preview h3 {
                color: #333;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .continue-btn, .retry-btn {
                background: #333;
                color: white;
                border: 1px solid #333;
                padding: 12px 24px;
                font-size: 0.9em;
                font-weight: 500;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
            }
            
            .continue-btn:hover, .retry-btn:hover {
                background: #555;
                border-color: #555;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }
    
    // 隐藏章节转场
    hideChapterTransition() {
        const overlay = document.getElementById('chapter-transition-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // 开始下一章节
    startNextChapter(chapterNumber) {
        // 开始新章节
        
        // 隐藏转场界面
        this.hideChapterTransition();
        
        // 切换到新章节状态
        this.stateManager.switchToChapter(chapterNumber);
        
        // 更新页面标题和header
        this.updateChapterHeader(chapterNumber);
        
        // 清空对话历史
        this.clearDialogue();
        
        // 显示新章节开幕文字
        this.showChapterOpening(chapterNumber);
        
        // 重新初始化UI
        this.updateStatusBar();
        this.updateGameInfo();
        
        // 自动调用AI开始新章节
        if (window.gameInstance && typeof window.gameInstance.autoCallAI === 'function') {
            setTimeout(() => {
                window.gameInstance.autoCallAI();
            }, 1000); // 延迟1秒让UI更新完成
        }
    }
    
    // 更新章节header
    updateChapterHeader(chapterNumber) {
        const chapterData = this.stateManager.gameData?.chapters?.[`chapter${chapterNumber}`];
        if (chapterData) {
            const newTitle = `草船借箭 - 第${chapterNumber}章：${chapterData.title}`;
            
            // 更新页面标题
            document.title = newTitle;
            
            // 更新header中的h1标题
            const headerH1 = document.querySelector('header h1');
            if (headerH1) {
                headerH1.textContent = newTitle;
            }
        }
    }
    
    // 显示章节开幕文字
    showChapterOpening(chapterNumber) {
        const chapterData = this.stateManager.gameData?.chapters?.[`chapter${chapterNumber}`];
        if (chapterData) {
            // 添加开幕文字到对话历史
            this.stateManager.addDialogue('system', chapterData.openingText, 'opening');
            
            // 显示在对话区域
            this.addDialogue('system', null, chapterData.openingText);
        }
    }

    // 显示事件弹窗
    showEventDialog(event) {
        const overlay = document.createElement('div');
        overlay.className = 'event-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        const dialog = document.createElement('div');
        dialog.className = 'event-dialog';
        dialog.style.cssText = `
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            width: 90%;
            max-width: 380px;
            max-height: 70%;
            overflow-y: auto;
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        
        let dialogContent = `
            <div style="text-align: center; margin-bottom: 16px;">
                <h3 style="color: #333; margin: 0 0 8px 0; font-size: 1.1em; font-weight: 600;">${event.title || '事件发生'}</h3>
                <p style="margin: 0; line-height: 1.5; color: #666; font-size: 0.9em;">${event.description || ''}</p>
            </div>
        `;
        
        // 根据事件类型添加不同内容
        if (event.type === 'dialogue_event') {
            dialogContent += `
                <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin: 12px 0; border: 1px solid #dee2e6;">
                    <p style="margin: 0; font-style: italic; color: #333; font-size: 0.9em; line-height: 1.4;">${event.content}</p>
                </div>
            `;
        } else if (event.type === 'check') {
            dialogContent += `
                <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; margin: 12px 0; border: 1px solid #dee2e6;">
                    <h4 style="color: #333; margin: 0 0 8px 0; font-size: 0.95em;">检定过程</h4>
                    <p style="margin: 4px 0; font-size: 0.85em; color: #666;">基础值: ${event.baseValue || 0}</p>
                    <p style="margin: 4px 0; font-size: 0.85em; color: #666;">修正值: ${event.modifier || 0}</p>
                    <p style="margin: 4px 0; font-size: 0.85em; color: #666;">随机值: ${event.randomValue || 0}</p>
                    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 8px 0;">
                    <p style="margin: 4px 0; font-weight: 600; color: ${event.success ? '#333' : '#666'}; font-size: 0.9em;">结果: ${event.success ? '成功' : '失败'}</p>
                </div>
            `;
        } else if (event.type === 'choice_event') {
            dialogContent += `
                <div style="margin: 12px 0;">
                    <h4 style="color: #333; margin: 0 0 12px 0; font-size: 0.95em;">请选择你的行动</h4>
            `;
            
            event.choices.forEach((choice, index) => {
                dialogContent += `
                    <button onclick="window.selectEventChoice('${event.id}', ${index})" 
                            style="
                                display: block;
                                width: 100%;
                                margin: 6px 0;
                                padding: 10px;
                                background: white;
                                color: #333;
                                border: 1px solid #dee2e6;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.85em;
                            "
                            onmouseover="this.style.background='#f8f9fa'"
                            onmouseout="this.style.background='white'">
                        ${choice.text}
                    </button>
                `;
            });
            
            dialogContent += `</div>`;
        }
        
        // 添加关闭按钮（除了选择事件）
        if (event.type !== 'choice_event') {
            dialogContent += `
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="window.closeEventDialog('${event.id}', '${event.type}')" 
                            style="
                                padding: 10px 20px;
                                background: #666;
                                color: white;
                                border: 1px solid #666;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.85em;
                            "
                            onmouseover="this.style.background='#333'"
                            onmouseout="this.style.background='#666'">
                        确定
                    </button>
                </div>
            `;
        }
        
        dialog.innerHTML = dialogContent;
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭（除了选择事件）
        if (event.type !== 'choice_event') {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        }
        
        return overlay;
    }
}