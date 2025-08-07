// 状态栏UI
class StatusUI {
    init(playerState) {
        this.updateDisplay(playerState);
    }
    
    updateDisplay(playerState) {
        const statusBar = document.getElementById('status-bar');
        const attributes = playerState.attributes;
        
        let html = `<div class="player-status">`;
        html += `<strong>${playerState.name}</strong> - `;
        
        for (const [key, value] of Object.entries(attributes)) {
            if (key !== '数值分析') {
                html += `<span class="attribute-item" data-attr="${key}">${key}: <span class="value">${value}</span></span>`;
            }
        }
        
        html += `</div>`;
        statusBar.innerHTML = html;
    }
    
    // 更新玩家属性（带动画）
    updatePlayerAttributes(attributes, changes) {
        for (const [key, value] of Object.entries(attributes)) {
            if (key === '数值分析') continue;
            
            const element = document.querySelector(`[data-attr="${key}"] .value`);
            if (element) {
                element.textContent = value;
                
                // 显示变化动画
                if (changes[key]) {
                    const changeEl = document.createElement('span');
                    changeEl.className = `attribute-change ${changes[key] < 0 ? 'negative' : ''}`;
                    changeEl.textContent = `${changes[key] > 0 ? '+' : ''}${changes[key]}`;
                    element.parentElement.appendChild(changeEl);
                    
                    setTimeout(() => changeEl.remove(), 2000);
                }
            }
        }
    }
}