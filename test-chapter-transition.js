// 章节切换功能测试脚本
// 测试header更新、开幕文字显示和自动AI调用功能

import { StateManager } from './js/core/stateManager.js';
import { UIManager } from './js/ui/uiManager.js';
import { GameEngine } from './js/core/gameEngine.js';
import { AIManager } from './js/core/aiManager.js';

// 模拟DOM环境
class MockDocument {
    constructor() {
        this.title = '草船借箭 - 第一章：三日之约';
        this.elements = {
            'header h1': { textContent: '草船借箭 - 第一章：三日之约' },
            'dialogue-area': { innerHTML: '', scrollTop: 0, scrollHeight: 100 },
            'chapter-transition-overlay': null
        };
    }
    
    querySelector(selector) {
        return this.elements[selector] || null;
    }
    
    getElementById(id) {
        return this.elements[id] || { textContent: '', innerHTML: '', remove: () => {} };
    }
    
    createElement(tag) {
        return {
            id: '',
            className: '',
            innerHTML: '',
            textContent: '',
            style: { cssText: '' },
            appendChild: () => {},
            remove: () => {
                // 模拟remove方法
                if (this.id === 'chapter-transition-overlay') {
                    mockDocument.elements['chapter-transition-overlay'] = null;
                }
            }
        };
    }
}

// 模拟window对象
class MockWindow {
    constructor() {
        this.gameInstance = null;
    }
}

// 设置模拟环境
const mockDocument = new MockDocument();
const mockWindow = new MockWindow();
global.document = mockDocument;
global.window = mockWindow;

class ChapterTransitionTester {
    constructor() {
        this.testResults = [];
        this.stateManager = null;
        this.uiManager = null;
        this.gameEngine = null;
        this.aiManager = null;
    }
    
    async initialize() {
        try {
            // 初始化游戏组件
            this.stateManager = new StateManager();
            
            this.gameEngine = new GameEngine(this.stateManager);
            this.aiManager = new AIManager();
            this.uiManager = new UIManager(this.stateManager, this.gameEngine);
            
            // 设置mock gameInstance
            mockWindow.gameInstance = {
                autoCallAI: () => {
                    console.log('✓ 自动调用AI成功');
                    return Promise.resolve({ success: true });
                }
            };
            
            console.log('✓ 测试环境初始化成功');
            return true;
        } catch (error) {
            console.error('✗ 测试环境初始化失败:', error.message);
            return false;
        }
    }
    
    testHeaderUpdate(chapterNumber) {
        console.log(`\n=== 测试第${chapterNumber}章Header更新 ===`);
        
        try {
            // 获取章节数据
            const chapterData = this.stateManager.gameData?.chapters?.[`chapter${chapterNumber}`];
            if (!chapterData) {
                throw new Error(`第${chapterNumber}章数据不存在`);
            }
            
            // 测试updateChapterHeader方法
            this.uiManager.updateChapterHeader(chapterNumber);
            
            // 验证标题更新
            const expectedTitle = `草船借箭 - 第${chapterNumber}章：${chapterData.title}`;
            
            if (mockDocument.title === expectedTitle) {
                console.log('✓ 页面标题更新成功:', mockDocument.title);
                this.testResults.push({ test: `第${chapterNumber}章页面标题更新`, result: 'PASS' });
            } else {
                throw new Error(`页面标题更新失败，期望: ${expectedTitle}, 实际: ${mockDocument.title}`);
            }
            
            const headerElement = mockDocument.querySelector('header h1');
            if (headerElement && headerElement.textContent === expectedTitle) {
                console.log('✓ Header标题更新成功:', headerElement.textContent);
                this.testResults.push({ test: `第${chapterNumber}章Header标题更新`, result: 'PASS' });
            } else {
                throw new Error(`Header标题更新失败`);
            }
            
        } catch (error) {
            console.error('✗ Header更新测试失败:', error.message);
            this.testResults.push({ test: `第${chapterNumber}章Header更新`, result: 'FAIL', error: error.message });
        }
    }
    
    testOpeningText(chapterNumber) {
        console.log(`\n=== 测试第${chapterNumber}章开幕文字 ===`);
        
        try {
            // 获取章节数据
            const chapterData = this.stateManager.gameData?.chapters?.[`chapter${chapterNumber}`];
            if (!chapterData) {
                throw new Error(`第${chapterNumber}章数据不存在`);
            }
            
            // 清空对话历史
            this.stateManager.dialogueHistory = [];
            
            // 测试showChapterOpening方法
            this.uiManager.showChapterOpening(chapterNumber);
            
            // 验证开幕文字是否添加到对话历史
            const dialogueHistory = this.stateManager.dialogueHistory;
            const lastDialogue = dialogueHistory[dialogueHistory.length - 1];
            
            if (lastDialogue && lastDialogue.content === chapterData.openingText) {
                console.log('✓ 开幕文字添加到对话历史成功');
                console.log('开幕文字:', chapterData.openingText.substring(0, 50) + '...');
                this.testResults.push({ test: `第${chapterNumber}章开幕文字`, result: 'PASS' });
            } else {
                throw new Error('开幕文字未正确添加到对话历史');
            }
            
        } catch (error) {
            console.error('✗ 开幕文字测试失败:', error.message);
            this.testResults.push({ test: `第${chapterNumber}章开幕文字`, result: 'FAIL', error: error.message });
        }
    }
    
    async testChapterTransition(fromChapter, toChapter) {
        console.log(`\n=== 测试从第${fromChapter}章到第${toChapter}章的切换 ===`);
        
        try {
            // 设置初始章节
            this.stateManager.setState({ chapter: fromChapter });
            
            // 模拟章节切换
            let autoCallAICalled = false;
            mockWindow.gameInstance.autoCallAI = () => {
                autoCallAICalled = true;
                console.log('✓ 自动调用AI成功');
                return Promise.resolve({ success: true });
            };
            
            // 执行章节切换
            this.uiManager.startNextChapter(toChapter);
            
            // 等待异步操作完成
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 验证章节状态更新
            if (this.stateManager.state.chapter === toChapter) {
                console.log('✓ 章节状态更新成功');
                this.testResults.push({ test: `章节${fromChapter}到${toChapter}状态更新`, result: 'PASS' });
            } else {
                throw new Error(`章节状态更新失败，期望: ${toChapter}, 实际: ${this.stateManager.state.chapter}`);
            }
            
            // 验证自动AI调用
            if (autoCallAICalled) {
                console.log('✓ 自动AI调用成功');
                this.testResults.push({ test: `章节${fromChapter}到${toChapter}自动AI调用`, result: 'PASS' });
            } else {
                throw new Error('自动AI调用失败');
            }
            
        } catch (error) {
            console.error('✗ 章节切换测试失败:', error.message);
            this.testResults.push({ test: `章节${fromChapter}到${toChapter}切换`, result: 'FAIL', error: error.message });
        }
    }
    
    async runAllTests() {
        console.log('\n=== 开始章节切换功能测试 ===');
        
        // 初始化测试环境
        const initSuccess = await this.initialize();
        if (!initSuccess) {
            console.log('\n=== 测试环境初始化失败，终止测试 ===');
            return;
        }
        
        // 测试各章节的Header更新
        for (let chapter = 1; chapter <= 3; chapter++) {
            this.testHeaderUpdate(chapter);
        }
        
        // 测试各章节的开幕文字
        for (let chapter = 1; chapter <= 3; chapter++) {
            this.testOpeningText(chapter);
        }
        
        // 测试章节切换
        await this.testChapterTransition(1, 2);
        await this.testChapterTransition(2, 3);
        
        // 输出测试结果
        this.printTestResults();
    }
    
    printTestResults() {
        console.log('\n=== 章节切换功能测试结果 ===');
        
        let passCount = 0;
        let failCount = 0;
        
        this.testResults.forEach(result => {
            const status = result.result === 'PASS' ? '✓' : '✗';
            console.log(`${status} ${result.test}: ${result.result}`);
            if (result.error) {
                console.log(`   错误: ${result.error}`);
            }
            
            if (result.result === 'PASS') {
                passCount++;
            } else {
                failCount++;
            }
        });
        
        const total = passCount + failCount;
        const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;
        
        console.log(`\n总测试数: ${total}`);
        console.log(`通过: ${passCount}`);
        console.log(`失败: ${failCount}`);
        console.log(`通过率: ${passRate}%`);
        
        if (passRate >= 90) {
            console.log('\n🎉 章节切换功能测试基本通过！');
        } else if (passRate >= 70) {
            console.log('\n⚠️ 章节切换功能部分正常，建议检查失败项目。');
        } else {
            console.log('\n❌ 章节切换功能存在较多问题，需要修复。');
        }
    }
}

// 运行测试
const tester = new ChapterTransitionTester();
tester.runAllTests().catch(error => {
    console.error('测试运行失败:', error);
});