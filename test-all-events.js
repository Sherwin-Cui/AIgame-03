// 全面测试所有事件和道具触发机制
import { StateManager } from './js/core/stateManager.js';
import { AIManager } from './js/core/aiManager.js';
import { GameEngine } from './js/core/gameEngine.js';
import { UIManager } from './js/ui/uiManager.js';

class EventTestSuite {
    constructor() {
        this.stateManager = new StateManager();
        this.aiManager = new AIManager();
        this.gameEngine = new GameEngine(this.stateManager, this.aiManager);
        this.uiManager = new UIManager();
        
        this.testResults = {
            events: {},
            items: {},
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0
            }
        };
    }

    // 测试事件触发机制
    async testEventTriggers() {
        console.log('\n🧪 开始测试事件触发机制...');
        
        // 注册事件处理器
        this.gameEngine.registerEventHandlers();
        
        // 测试各种事件类型 - 使用实际存在的事件ID
        const testEvents = [
            {
                name: 'dialogue_event2',
                type: 'dialogue_event',
                chapter: 1,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'dialogue_event2',
                        reason: '测试对话事件触发'
                    }
                }
            },
            {
                name: 'dialogue_event3',
                type: 'dialogue_event',
                chapter: 2,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'dialogue_event3',
                        reason: '测试对话事件触发'
                    }
                }
            },
            {
                name: 'choice_event1',
                type: 'choice_event',
                chapter: 1,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'choice_event1',
                        reason: '测试抉择事件触发'
                    }
                }
            },
            {
                name: 'choice_event2',
                type: 'choice_event',
                chapter: 2,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'choice_event2',
                        reason: '测试抉择事件触发'
                    }
                }
            },
            {
                name: 'check_event1',
                type: 'check_event',
                chapter: 1,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'check_event1',
                        reason: '测试检定事件触发'
                    }
                }
            },
            {
                name: 'check_event2',
                type: 'check_event',
                chapter: 2,
                mockResponse: {
                    event_suggestion: {
                        should_trigger: true,
                        event_id: 'check_event2',
                        reason: '测试检定事件触发'
                    }
                }
            }
        ];

        for (const testEvent of testEvents) {
            await this.testSingleEvent(testEvent);
        }
    }

    // 测试单个事件
    async testSingleEvent(testEvent) {
        console.log(`\n🎯 测试事件: ${testEvent.name}`);
        this.testResults.summary.totalTests++;
        
        try {
            // 1. 检查事件处理器是否存在
            const handlerExists = this.gameEngine.eventHandlers.has(testEvent.name);
            console.log(`   事件处理器存在: ${handlerExists}`);
            
            if (!handlerExists) {
                this.testResults.events[testEvent.name] = {
                    status: 'FAILED',
                    reason: '事件处理器不存在'
                };
                this.testResults.summary.failed++;
                return;
            }

            // 2. 设置正确的章节状态
            if (testEvent.chapter) {
                this.stateManager.setState({ chapter: testEvent.chapter });
                console.log(`   设置章节为: ${testEvent.chapter}`);
            }

            // 3. 直接测试事件处理器
            const handler = this.gameEngine.eventHandlers.get(testEvent.name);
            const currentState = this.stateManager.getState();
            
            console.log(`   当前游戏状态:`, {
                chapter: currentState.chapter,
                eventStates: currentState.eventStates || {}
            });
            
            // 调用事件处理器
            const eventResult = handler(currentState);
            console.log(`   事件处理器结果:`, eventResult);
            
            // 4. 检查事件是否成功触发
            if (eventResult.trigger) {
                console.log(`   ✅ 事件 ${testEvent.name} 触发成功`);
                console.log(`   事件详情: ${eventResult.title || '未知标题'}`);
                this.testResults.events[testEvent.name] = {
                    status: 'PASSED',
                    eventResult: eventResult
                };
                this.testResults.summary.passed++;
            } else {
                console.log(`   ❌ 事件 ${testEvent.name} 未触发`);
                this.testResults.events[testEvent.name] = {
                    status: 'FAILED',
                    reason: '事件处理器返回trigger=false'
                };
                this.testResults.summary.failed++;
            }

        } catch (error) {
            console.error(`   ❌ 事件 ${testEvent.name} 测试异常:`, error.message);
            this.testResults.events[testEvent.name] = {
                status: 'ERROR',
                error: error.message
            };
            this.testResults.summary.failed++;
        }
    }

    // 测试道具触发机制
    async testItemTriggers() {
        console.log('\n🎒 开始测试道具触发机制...');
        
        // 使用实际存在的道具ID
        const testItems = [
            {
                name: '东吴虎符',
                mockResponse: {
                    item_grant: {
                        '东吴虎符': true
                    }
                }
            },
            {
                name: '孔明羽扇', 
                mockResponse: {
                    item_grant: {
                        '孔明羽扇': true
                    }
                }
            },
            {
                name: '诸葛连弩',
                mockResponse: {
                    item_grant: {
                        '诸葛连弩': true
                    }
                }
            },
            {
                name: '鲁肃书信',
                mockResponse: {
                    item_grant: {
                        '鲁肃书信': true
                    }
                }
            },
            {
                name: '周瑜密令',
                mockResponse: {
                    item_grant: {
                        '周瑜密令': true
                    }
                }
            },
            {
                name: '江东地图',
                mockResponse: {
                    item_grant: {
                        '江东地图': true
                    }
                }
            },
            {
                name: '军师印',
                mockResponse: {
                    item_grant: {
                        '军师印': true
                    }
                }
            },
            {
                name: '兵书残卷',
                mockResponse: {
                    item_grant: {
                        '兵书残卷': true
                    }
                }
            },
            {
                name: '草船模型',
                mockResponse: {
                    item_grant: {
                        '草船模型': true
                    }
                }
            }
        ];

        for (const testItem of testItems) {
            await this.testSingleItem(testItem);
        }
    }

    // 测试单个道具
    async testSingleItem(testItem) {
        console.log(`\n🎁 测试道具: ${testItem.name}`);
        this.testResults.summary.totalTests++;
        
        try {
            // 1. 记录初始状态
            const initialState = this.stateManager.getState();
            const initialHasItem = initialState.items && initialState.items[testItem.name];
            console.log(`   初始拥有状态: ${initialHasItem}`);

            // 2. 模拟AI响应包含道具授予
            const mockAIResponse = {
                success: true,
                data: {
                    content: '测试道具授予',
                    ...testItem.mockResponse
                }
            };

            // 3. 直接测试道具授予逻辑
            if (testItem.mockResponse.item_grant) {
                this.stateManager.applyValueChanges({
                    items: testItem.mockResponse.item_grant
                });
                
                // 4. 检查道具是否成功授予
                const newState = this.stateManager.getState();
                const hasItemNow = newState.items && newState.items[testItem.name];
                
                if (hasItemNow) {
                    console.log(`   ✅ 道具 ${testItem.name} 授予成功`);
                    this.testResults.items[testItem.name] = {
                        status: 'PASSED',
                        initialState: initialHasItem,
                        finalState: hasItemNow
                    };
                    this.testResults.summary.passed++;
                } else {
                    console.log(`   ❌ 道具 ${testItem.name} 授予失败`);
                    this.testResults.items[testItem.name] = {
                        status: 'FAILED',
                        reason: '道具状态未更新'
                    };
                    this.testResults.summary.failed++;
                }
            }

        } catch (error) {
            console.error(`   ❌ 道具 ${testItem.name} 测试异常:`, error.message);
            this.testResults.items[testItem.name] = {
                status: 'ERROR',
                error: error.message
            };
            this.testResults.summary.failed++;
        }
    }

    // 测试UI显示功能
    testUIDisplay() {
        console.log('\n🖥️ 测试UI显示功能...');
        this.testResults.summary.totalTests++;
        
        try {
            // 测试showEventDialog方法
            const testEvent = {
                id: 'test_choice_event',
                type: 'choice_event',
                title: '测试抉择事件',
                description: '这是一个测试事件',
                choices: [
                    { text: '选择A', effect: 'effectA' },
                    { text: '选择B', effect: 'effectB' }
                ]
            };
            
            const dialogElement = this.uiManager.showEventDialog(testEvent);
            
            if (dialogElement) {
                console.log('   ✅ UI显示功能正常');
                this.testResults.ui = { status: 'PASSED' };
                this.testResults.summary.passed++;
                
                // 清理测试元素
                setTimeout(() => {
                    if (dialogElement.parentNode) {
                        dialogElement.parentNode.removeChild(dialogElement);
                    }
                }, 1000);
            } else {
                console.log('   ❌ UI显示功能异常');
                this.testResults.ui = { 
                    status: 'FAILED',
                    reason: 'showEventDialog返回null'
                };
                this.testResults.summary.failed++;
            }
            
        } catch (error) {
            console.error('   ❌ UI测试异常:', error.message);
            this.testResults.ui = {
                status: 'ERROR',
                error: error.message
            };
            this.testResults.summary.failed++;
        }
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🚀 开始全面测试事件和道具触发机制\n');
        
        await this.testEventTriggers();
        await this.testItemTriggers();
        this.testUIDisplay();
        
        this.printTestSummary();
    }

    // 打印测试总结
    printTestSummary() {
        console.log('\n📊 测试总结报告');
        console.log('='.repeat(50));
        console.log(`总测试数: ${this.testResults.summary.totalTests}`);
        console.log(`通过: ${this.testResults.summary.passed}`);
        console.log(`失败: ${this.testResults.summary.failed}`);
        console.log(`成功率: ${((this.testResults.summary.passed / this.testResults.summary.totalTests) * 100).toFixed(1)}%`);
        
        console.log('\n📋 详细结果:');
        console.log('事件测试:', this.testResults.events);
        console.log('道具测试:', this.testResults.items);
        console.log('UI测试:', this.testResults.ui);
        
        // 问题总结
        const failedTests = [];
        Object.entries(this.testResults.events).forEach(([name, result]) => {
            if (result.status !== 'PASSED') {
                failedTests.push(`事件 ${name}: ${result.reason || result.error}`);
            }
        });
        Object.entries(this.testResults.items).forEach(([name, result]) => {
            if (result.status !== 'PASSED') {
                failedTests.push(`道具 ${name}: ${result.reason || result.error}`);
            }
        });
        
        if (failedTests.length > 0) {
            console.log('\n⚠️ 需要修复的问题:');
            failedTests.forEach(issue => console.log(`   - ${issue}`));
        } else {
            console.log('\n✅ 所有测试通过！');
        }
    }
}

// 运行测试
const testSuite = new EventTestSuite();
testSuite.runAllTests().catch(error => {
    console.error('测试套件运行失败:', error);
});

// 导出供其他地方使用
if (typeof window !== 'undefined') {
    window.EventTestSuite = EventTestSuite;
    window.runEventTests = () => {
        const suite = new EventTestSuite();
        return suite.runAllTests();
    };
}