// 主入口文件
window.addEventListener('DOMContentLoaded', () => {
    DebugLogger.log('Main', '🚀 开始初始化游戏...');
    
    // 初始化游戏状态
    DebugLogger.log('Main', '初始化游戏状态');
    window.gameState = new GameState();
    DebugLogger.log('Main', '游戏状态初始化完成:', window.gameState);
    DebugLogger.log('Main', 'playerState:', window.gameState.playerState);
    DebugLogger.log('Main', 'playerState.name:', window.gameState.playerState.name);
    
    // 初始化AI服务
    DebugLogger.log('Main', '初始化AI服务');
    window.aiService = new AIService();
    
    // 初始化UI管理器
    DebugLogger.log('Main', '初始化UI管理器');
    window.uiManager = new UIManager(window.gameState);
    
    // 初始化对话系统
    DebugLogger.log('Main', '初始化对话系统');
    window.dialogueSystem = new DialogueSystem(window.gameState, window.uiManager);
    
    // 初始化UI
    DebugLogger.log('Main', '初始化UI界面');
    window.uiManager.init(window.gameState);
    
    // 绑定事件监听器
    setupEventListeners();
    
    DebugLogger.success('Main', '✅ 游戏初始化完成!');
    DebugLogger.info('Main', '💡 打开浏览器控制台查看详细调试信息');
    DebugLogger.info('Main', '💡 使用 debugToggle() 切换调试模式');
});

// 设置事件监听器
function setupEventListeners() {
    DebugLogger.log('Main', '设置事件监听器...');
    
    // 发送按钮事件
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
        DebugLogger.log('Main', '✅ 发送按钮事件已绑定');
    }
    
    // 输入框回车事件
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                DebugLogger.logGameEvent('user_input', '用户按下回车键发送消息');
                handleSendMessage();
            }
        });
        DebugLogger.log('Main', '✅ 输入框回车事件已绑定');
    }
    
    // 背包道具点击事件（如果存在）
    const itemList = document.getElementById('item-list');
    if (itemList) {
        itemList.addEventListener('click', (e) => {
            if (e.target.classList.contains('inventory-item')) {
                DebugLogger.logGameEvent('user_input', '用户点击背包道具', {
                    itemName: e.target.textContent,
                    itemElement: e.target
                });
            }
        });
        DebugLogger.log('Main', '✅ 背包道具点击事件已绑定');
    }
}

// 处理发送消息
function handleSendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        DebugLogger.logGameEvent('user_input', '处理用户消息发送', { message });
        window.dialogueSystem.handleUserInput(message);
        userInput.value = '';
    } else {
        DebugLogger.warn('Main', '用户尝试发送空消息');
    }
}