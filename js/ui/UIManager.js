// UI管理器
class UIManager {
    constructor(game) {
        this.game = game;
        this.statusUI = new StatusUI();
        this.dialogueUI = new DialogueUI(game);
        this.inventoryItems = [];
    }
    
    // 初始化UI
    init(gameState) {
        // 初始化状态栏
        this.statusUI.init(gameState.playerState);
        
        // 初始化背包
        this.updateInventory(gameState.playerState.inventory);
        
        // 绑定事件
        this.bindEvents(gameState);
        
        // 初始对话
        this.dialogueUI.addDialogue({
            speaker: '旁白',
            content: '深夜，曹操召集谋士议事。你察觉到今夜气氛异常...',
            type: 'narration'
        });
    }
    
    // 绑定事件
    bindEvents(gameState) {
        // 注意：发送按钮和回车事件已在main.js中绑定，这里不再重复绑定
        // 避免重复事件监听导致多次调用AI服务
        console.log('📝 [UIManager] 事件绑定已在main.js中处理，跳过重复绑定');
    }
    
    // 更新背包显示
    updateInventory(inventory) {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';
        
        inventory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item';
            itemEl.textContent = `${item.itemName} x${item.quantity}`;
            itemEl.onclick = () => this.selectItem(item);
            itemList.appendChild(itemEl);
        });
        
        this.inventoryItems = inventory;
    }
    
    // 选择道具
    selectItem(item) {
        window.gameState.selectedItem = item;
        this.updateSelectedItem(item);
        
        // 更新UI样式
        document.querySelectorAll('.item').forEach(el => {
            el.classList.remove('selected');
        });
        event.target.classList.add('selected');
    }
    
    // 更新选中道具显示
    updateSelectedItem(item) {
        const display = document.getElementById('selected-item');
        display.textContent = item ? `选中道具: ${item.itemName}` : '选中道具: 无';
    }
    
    // 显示获得道具提示
    showItemObtained(item) {
        // 简单的alert，后续可以改成更好的UI
        alert(`获得道具: ${item.itemName} - ${item.description}`);
    }
    
    // 重置UI
    reset() {
        this.dialogueUI.clear();
        location.reload(); // 简单粗暴的重置方法
    }
}