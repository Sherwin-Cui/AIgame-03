// js/ui/uiDisplay.js
class DialogueUI {
    constructor(game) {
        this.game = game;
    }
    
    /**
     * 添加对话气泡到界面
     */
    addDialogue(dialogueData) {
        console.log('📝 [DialogueUI] 添加对话:', dialogueData);
        console.log('📝 [DialogueUI] speaker值:', dialogueData.speaker);
        console.log('📝 [DialogueUI] speaker类型:', typeof dialogueData.speaker);
        const dialogueArea = document.getElementById('dialogue-area');
        
        // 创建对话容器
        const dialogueContainer = document.createElement('div');
        dialogueContainer.className = 'dialogue-container';
        
        // 根据类型设置样式
        if (dialogueData.type === 'narration' || dialogueData.speaker === '旁白') {
            // 旁白样式
            dialogueContainer.innerHTML = `
                <div class="narration-box">
                    <div class="narration-content">${dialogueData.content}</div>
                </div>
            `;
        } else {
            // 角色对话
            const isPlayer = dialogueData.isPlayer || dialogueData.speaker === '玩家';
            const alignClass = isPlayer ? 'align-right' : 'align-left';
            
            let innerContent = `
                <div class="dialogue-bubble ${alignClass} ${isPlayer ? 'player-bubble' : 'npc-bubble'}">
                    <div class="speaker-info">
                        <div class="speaker-avatar">${(dialogueData.speaker || '未知').charAt(0)}</div>
                        <span class="speaker-name">${dialogueData.speaker || '未知'}</span>
                    </div>
            `;
            
            // 添加动作描述
            if (dialogueData.action) {
                innerContent += `
                    <div class="action-text">（${dialogueData.action}）</div>
                `;
            }
            
            // 添加对话内容
            innerContent += `
                <div class="dialogue-text">${dialogueData.content}</div>
            `;
            
            // 添加内心想法（仅NPC）
            if (dialogueData.innerThought && !isPlayer) {
                innerContent += `
                    <div class="inner-thought">
                        <span class="thought-icon">💭</span>
                        <span class="thought-text">【${dialogueData.innerThought}】</span>
                    </div>
                `;
            }
            
            // 如果是曹操，显示他看到的属性
            if (dialogueData.speaker === '曹操' && dialogueData.innerThought) {
                // 解析内心想法中的属性信息
                const attributeMatch = dialogueData.innerThought.match(/野心:(\d+).*忠诚:(\d+)/);
                if (attributeMatch) {
                    innerContent += `
                        <div class="cao-cao-vision">
                            <span class="vision-icon">👁️</span>
                            <span class="vision-text">读心术感知</span>
                        </div>
                    `;
                }
            }
            
            innerContent += '</div>';
            dialogueContainer.innerHTML = innerContent;
        }
        
        // 添加到对话区域
        dialogueArea.appendChild(dialogueContainer);
        
        // 添加淡入动画
        dialogueContainer.style.opacity = '0';
        dialogueContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            dialogueContainer.style.transition = 'all 0.3s ease';
            dialogueContainer.style.opacity = '1';
            dialogueContainer.style.transform = 'translateY(0)';
        }, 50);
        
        // 滚动到底部
        dialogueArea.scrollTop = dialogueArea.scrollHeight;
    }
    
    /**
     * 显示属性变化动画
     */
    showAttributeChanges(characterName, changes) {
        // 创建浮动提示
        changes.forEach((change, index) => {
            setTimeout(() => {
                const floater = document.createElement('div');
                floater.className = `attribute-change-floater ${change.color}`;
                floater.innerHTML = `
                    <span class="change-character">${characterName}</span>
                    <span class="change-attr">${change.attribute}</span>
                    <span class="change-value">${change.value}</span>
                `;
                
                // 添加到属性变化区域
                const changeArea = document.getElementById('attribute-changes');
                if (changeArea) {
                    changeArea.appendChild(floater);
                    
                    // 动画效果
                    floater.style.animation = 'floatUp 2s ease-out forwards';
                    
                    // 移除元素
                    setTimeout(() => floater.remove(), 2000);
                }
            }, index * 200);
        });
    }
    
    /**
     * 显示道具获得提示
     */
    showItemObtained(itemData) {
        const modal = document.createElement('div');
        modal.className = 'item-obtained-modal';
        modal.innerHTML = `
            <div class="item-obtained-content">
                <h3>获得道具！</h3>
                <div class="item-display">
                    <img src="assets/images/items/${itemData.icon || 'default_item.png'}" 
                         class="item-image">
                    <div class="item-details">
                        <h4>【${itemData.itemName}】</h4>
                        <p class="item-desc">${itemData.description || '神秘道具'}</p>
                        <p class="item-effect">效果：${itemData.effect || '未知效果'}</p>
                        <p class="obtain-reason">${itemData.reason}</p>
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">确定</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 添加动画
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 50);
    }
    
    /**
     * 显示警告信息
     */
    showWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'warning-banner';
        warning.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">${message}</span>
        `;
        
        const warningArea = document.getElementById('warning-area');
        if (warningArea) {
            warningArea.appendChild(warning);
            
            // 自动消失
            setTimeout(() => {
                warning.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => warning.remove(), 500);
            }, 3000);
        }
    }
    
    /**
     * 更新章节信息显示
     */
    updateChapterInfo(chapter) {
        const chapterInfo = document.getElementById('chapter-info');
        if (chapterInfo) {
            chapterInfo.innerHTML = `
                <h3>${chapter.title}</h3>
                <div class="chapter-objectives">
                    <p class="main-objective">主要目标：${chapter.objectives.main}</p>
                    <p class="hidden-objective">隐藏目标：？？？</p>
                </div>
            `;
        }
    }
    
    /**
     * 显示游戏结局
     */
    showEndScene(endData) {
        const endScene = document.getElementById('end-scene');
        if (!endScene) return;
        
        // 根据结局类型选择内容
        let endingContent = '';
        switch (endData.endType) {
            case 'hermit':
                endingContent = `
                    <h2>结局：毒士归隐</h2>
                    <p>你成功救下了荀彧，也看清了这乱世的真相。</p>
                    <p>选择急流勇退，从此隐姓埋名，逍遥山水之间。</p>
                `;
                break;
            case 'ambitious':
                endingContent = `
                    <h2>结局：新的枭雄</h2>
                    <p>你不仅救下了荀彧，更在这场博弈中展现了超人的智谋。</p>
                    <p>取代司马懿的地位，成为曹营中真正的二号人物。</p>
                `;
                break;
            case 'loyal':
                endingContent = `
                    <h2>结局：王佐之臣</h2>
                    <p>你的忠诚和智慧赢得了曹操的完全信任。</p>
                    <p>成为真正的王佐之才，辅佐曹氏开创新的时代。</p>
                `;
                break;
            default:
                endingContent = `
                    <h2>${endData.isEnd ? '游戏结束' : '游戏继续'}</h2>
                    <p>${endData.reason}</p>
                `;
        }
        
        // 添加最终数值
        if (endData.playerState && endData.playerState.attributes) {
            endingContent += `
                <div class="final-stats">
                    <h3>最终属性</h3>
                    <div class="stats-grid">
                        ${Object.entries(endData.playerState.attributes).map(([key, value]) => `
                            <div class="stat-item">
                                <span class="stat-name">${key}：</span>
                                <span class="stat-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button onclick="location.reload()">重新开始</button>
            `;
        }
        
        endScene.innerHTML = endingContent;
        endScene.style.display = 'flex';
        
        // 保存通关记录
        this.saveEndingRecord(endData);
    }
    
    /**
     * 保存通关记录
     */
    saveEndingRecord(endData) {
        const records = JSON.parse(localStorage.getItem('game-endings') || '[]');
        records.push({
            date: new Date().toISOString(),
            endType: endData.endType,
            isEnd: endData.isEnd,
            finalAttributes: endData.playerState ? endData.playerState.attributes : {}
        });
        localStorage.setItem('game-endings', JSON.stringify(records));
    }
    
    /**
     * 清空对话区域
     */
    clear() {
        const dialogueArea = document.getElementById('dialogue-area');
        if (dialogueArea) {
            dialogueArea.innerHTML = '';
        }
    }
    
    /**
     * 格式化内容（处理心声等特殊标记）
     */
    formatContent(content) {
        // 将【心声】标记为特殊样式
        return content.replace(/【(.+?)】/g, '<em style="color:#888">【$1】</em>');
    }
}