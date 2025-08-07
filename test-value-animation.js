// 测试数值更新和动画功能

// 模拟数值变化测试
function testValueAnimation() {
    console.log('=== 开始测试数值变化动画 ===');
    
    // 获取游戏实例
    const game = window.gameInstance;
    if (!game) {
        console.error('游戏实例未找到');
        return;
    }
    
    // 模拟第一章数值变化
    console.log('测试第一章数值变化...');
    const oldState1 = {
        zhouYu: { suspicion: 50 },
        luSu: { trust: 50 },
        timeProgress: 1,
        currentChapter: 1
    };
    
    const newState1 = {
        zhouYu: { suspicion: 65 },
        luSu: { trust: 40 },
        timeProgress: 2,
        currentChapter: 1
    };
    
    game.showValueChangeAnimations(oldState1, newState1);
    
    // 延迟测试第二章
    setTimeout(() => {
        console.log('测试第二章数值变化...');
        const oldState2 = {
            preparationProgress: 20,
            timeProgress: 1,
            currentChapter: 2
        };
        
        const newState2 = {
            preparationProgress: 35,
            timeProgress: 2,
            currentChapter: 2
        };
        
        game.showValueChangeAnimations(oldState2, newState2);
    }, 3000);
    
    // 延迟测试第三章
    setTimeout(() => {
        console.log('测试第三章数值变化...');
        const oldState3 = {
            dangerLevel: 30,
            soldierMorale: 60,
            shipLoss: 5,
            arrows: 100,
            timeProgress: 1,
            currentChapter: 3
        };
        
        const newState3 = {
            dangerLevel: 45,
            soldierMorale: 45,
            shipLoss: 8,
            arrows: 150,
            timeProgress: 2,
            currentChapter: 3
        };
        
        game.showValueChangeAnimations(oldState3, newState3);
    }, 6000);
}

// 测试状态栏更新
function testStatusBarUpdate() {
    console.log('=== 开始测试状态栏更新 ===');
    
    const game = window.gameInstance;
    if (!game) {
        console.error('游戏实例未找到');
        return;
    }
    
    // 模拟状态管理器返回不同章节的状态
    const originalGetState = game.stateManager.getState;
    
    // 测试第一章状态栏
    console.log('测试第一章状态栏显示...');
    game.stateManager.getState = () => ({
        currentChapter: 1,
        zhouYu: { suspicion: 75 },
        luSu: { trust: 25 },
        timeProgress: 2
    });
    game.uiManager.updateStatusBar();
    
    // 测试第二章状态栏
    setTimeout(() => {
        console.log('测试第二章状态栏显示...');
        game.stateManager.getState = () => ({
            currentChapter: 2,
            preparationProgress: 60,
            timeProgress: 2
        });
        game.uiManager.updateStatusBar();
    }, 2000);
    
    // 测试第三章状态栏
    setTimeout(() => {
        console.log('测试第三章状态栏显示...');
        game.stateManager.getState = () => ({
            currentChapter: 3,
            dangerLevel: 80,
            soldierMorale: 30,
            shipLoss: 15,
            arrows: 200,
            timeProgress: 3
        });
        game.uiManager.updateStatusBar();
    }, 4000);
    
    // 恢复原始方法
    setTimeout(() => {
        game.stateManager.getState = originalGetState;
        console.log('测试完成，已恢复原始状态');
    }, 6000);
}

// 在控制台中提供测试函数
window.testValueAnimation = testValueAnimation;
window.testStatusBarUpdate = testStatusBarUpdate;

console.log('数值动画测试脚本已加载');
console.log('使用 testValueAnimation() 测试数值变化动画');
console.log('使用 testStatusBarUpdate() 测试状态栏更新');