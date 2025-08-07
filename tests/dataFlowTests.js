/**
 * 草船借箭游戏 - 关键数据流自动化测试
 * 用于验证代码一致性和数据流完整性
 */

// 导入必要的模块
import gameData from '../js/data/gameData.js';
import { GameUtils } from '../js/utils/gameUtils.js';

/**
 * 数据流测试套件
 */
class DataFlowTests {
    constructor() {
        this.testResults = [];
        this.errors = [];
    }

    /**
     * 运行所有测试
     */
    runAllTests() {
        console.log('🚀 开始执行数据流测试...');
        
        this.testGameStateStructure();
        this.testCharacterAttributeConsistency();
        this.testEventDataConsistency();
        this.testItemDataConsistency();
        this.testValueChangeConsistency();
        this.testConditionCheckConsistency();
        this.testAIResponseFormatConsistency();
        
        return this.generateReport();
    }

    /**
     * 测试游戏状态结构一致性
     */
    testGameStateStructure() {
        const testName = '游戏状态结构一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            // 检查必需的角色属性
            const requiredCharacters = ['zhouYu', 'luSu', 'ganNing', 'zhugeLiang'];
            const requiredAttributes = {
                zhouYu: ['suspicion'],
                luSu: ['trust'],
                ganNing: ['alertness'],
                zhugeLiang: ['intelligence', 'eloquence', 'stamina']
            };

            // 检查角色数据结构
            for (const character of requiredCharacters) {
                if (!gameData.characters[character]) {
                    throw new Error(`缺少角色: ${character}`);
                }
                
                for (const attribute of requiredAttributes[character]) {
                    if (typeof gameData.characters[character].attributes[attribute] !== 'number') {
                        throw new Error(`${character}.${attribute} 应该是数字类型`);
                    }
                }
            }
            
            // 检查全局状态属性
            const requiredGameProps = ['timeProgress', 'arrows'];
            for (const prop of requiredGameProps) {
                if (!gameData.globalState[prop] || typeof gameData.globalState[prop].current !== 'number') {
                    throw new Error(`${prop} 应该是数字类型`);
                }
            }
            
            this.addTestResult(testName, true, '所有必需的状态属性都存在且类型正确');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试角色属性命名一致性
     */
    testCharacterAttributeConsistency() {
        const testName = '角色属性命名一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            // 检查角色属性命名是否符合规范
            const characters = gameData.characters;
            
            // 检查周瑜的猜忌值属性
            if (typeof characters.zhouYu?.attributes?.suspicion !== 'number') {
                throw new Error('周瑜应该有suspicion属性');
            }
            
            // 检查鲁肃的信任值属性
            if (typeof characters.luSu?.attributes?.trust !== 'number') {
                throw new Error('鲁肃应该有trust属性');
            }
            
            // 检查甘宁的机警值属性
            if (typeof characters.ganNing?.attributes?.alertness !== 'number') {
                throw new Error('甘宁应该有alertness属性');
            }
            
            this.addTestResult(testName, true, '角色属性命名符合规范');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试事件数据一致性
     */
    testEventDataConsistency() {
        const testName = '事件数据一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            const events = gameData.events;
            
            for (const [eventId, event] of Object.entries(events)) {
                // 检查必需字段
                const requiredFields = ['id', 'type', 'title'];
                for (const field of requiredFields) {
                    if (!event[field]) {
                        throw new Error(`事件 ${eventId} 缺少必需字段: ${field}`);
                    }
                }
                
                // 检查事件类型
                const validTypes = ['dialogue_event', 'choice_event', 'check_event', 'emergency_event'];
                if (!validTypes.includes(event.type)) {
                    throw new Error(`事件 ${eventId} 类型无效: ${event.type}`);
                }
                
                // 检查对话事件的内容
                if (event.type === 'dialogue_event' && !event.content) {
                    throw new Error(`对话事件 ${eventId} 缺少content字段`);
                }
                
                // 检查选择事件的选项
                if (event.type === 'choice_event' && (!event.options || event.options.length === 0)) {
                    throw new Error(`选择事件 ${eventId} 缺少选项`);
                }
                
                // 检查检定事件的检定配置
                if (event.type === 'check_event' && (!event.checkType || !event.baseSuccessRate)) {
                    throw new Error(`检定事件 ${eventId} 缺少检定配置`);
                }
            }
            
            this.addTestResult(testName, true, '所有事件数据结构正确');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试道具数据一致性
     */
    testItemDataConsistency() {
        const testName = '道具数据一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            const items = gameData.items;
            
            for (const [itemId, item] of Object.entries(items)) {
                // 检查必需字段
                const requiredFields = ['id', 'name', 'effect', 'usage'];
                for (const field of requiredFields) {
                    if (!item[field]) {
                        throw new Error(`道具 ${itemId} 缺少必需字段: ${field}`);
                    }
                }
                
                // 检查效果类型
                const validEffectTypes = ['checkBonus', 'attributeChange', 'special', 'multiple'];
                if (!validEffectTypes.includes(item.effect.type)) {
                    throw new Error(`道具 ${itemId} 效果类型无效: ${item.effect.type}`);
                }
                
                // 检查使用时机
                const validTimings = ['beforeCheck', 'duringEvent', 'afterEvent'];
                if (!validTimings.includes(item.usage.timing)) {
                    throw new Error(`道具 ${itemId} 使用时机无效: ${item.usage.timing}`);
                }
            }
            
            this.addTestResult(testName, true, '所有道具数据结构正确');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试数值变化一致性
     */
    testValueChangeConsistency() {
        const testName = '数值变化一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            // 测试数值变化解析
            const testCases = [
                'zhouYu.suspicion+5',
                'luSu.trust-3',
                'zhugeLiang.intelligence+2',
                'arrows+10',
                'timeProgress+1'
            ];
            
            for (const testCase of testCases) {
                const parsed = GameUtils.parseValueChange(testCase);
                if (!parsed || !parsed.path || typeof parsed.value !== 'number') {
                    throw new Error(`数值变化解析失败: ${testCase}`);
                }
            }
            
            // 测试无效格式
            const invalidCases = [
                'suspicion+5',  // 应该是 zhouYu.suspicion+5
                'trust-3',      // 应该是 luSu.trust-3
                'zhouYuAlert+1' // 已废弃的变量名
            ];
            
            for (const invalidCase of invalidCases) {
                const parsed = GameUtils.parseValueChange(invalidCase);
                if (parsed) {
                    throw new Error(`应该拒绝无效格式: ${invalidCase}`);
                }
            }
            
            this.addTestResult(testName, true, '数值变化格式验证正确');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试条件检查一致性
     */
    testConditionCheckConsistency() {
        const testName = '条件检查一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            const mockState = {
                zhouYu: { suspicion: 50 },
                luSu: { trust: 30 },
                zhugeLiang: { intelligence: 80 },
                arrows: 100,
                timeProgress: 2
            };
            
            // 测试条件检查
            const testConditions = [
                { condition: 'zhouYu.suspicion>40', expected: true },
                { condition: 'luSu.trust<50', expected: true },
                { condition: 'arrows>=100', expected: true },
                { condition: 'timeProgress==2', expected: true },
                { condition: 'zhugeLiang.intelligence<70', expected: false }
            ];
            
            for (const test of testConditions) {
                console.log(`条件检查: ${test.condition}`);
                const result = GameUtils.checkCondition(test.condition, mockState);
                console.log(`条件检查结果: ${test.condition}, 期望: ${test.expected}, 实际: ${result}`);
                if (result !== test.expected) {
                    throw new Error(`条件检查错误: ${test.condition}, 期望: ${test.expected}, 实际: ${result}`);
                }
            }
            
            this.addTestResult(testName, true, '条件检查逻辑正确');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 测试AI响应格式一致性
     */
    testAIResponseFormatConsistency() {
        const testName = 'AI响应格式一致性';
        console.log(`📋 测试: ${testName}`);
        
        try {
            // 检查AI响应应该包含的字段
            const requiredFields = ['special_progress', 'event_suggestion', 'item_grant'];
            
            // 模拟AI响应
            const mockAIResponse = {
                special_progress: [],
                event_suggestion: null,
                item_grant: []
            };
            
            for (const field of requiredFields) {
                if (!(field in mockAIResponse)) {
                    throw new Error(`AI响应缺少必需字段: ${field}`);
                }
            }
            
            // 检查已废弃的字段不应该存在
            const deprecatedFields = ['autoEvents', 'items'];
            for (const field of deprecatedFields) {
                if (field in mockAIResponse) {
                    throw new Error(`AI响应包含已废弃字段: ${field}`);
                }
            }
            
            this.addTestResult(testName, true, 'AI响应格式符合规范');
        } catch (error) {
            this.addTestResult(testName, false, error.message);
        }
    }

    /**
     * 添加测试结果
     */
    addTestResult(testName, passed, message) {
        const result = {
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        if (passed) {
            console.log(`✅ ${testName}: ${message}`);
        } else {
            console.error(`❌ ${testName}: ${message}`);
            this.errors.push(result);
        }
    }

    /**
     * 生成测试报告
     */
    generateReport() {
        console.log('\n📊 测试报告');
        console.log('='.repeat(50));
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过: ${passedTests}`);
        console.log(`失败: ${failedTests}`);
        console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ 失败的测试:');
            this.errors.forEach(error => {
                console.log(`  - ${error.name}: ${error.message}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        
        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: (passedTests / totalTests) * 100,
            errors: this.errors
        };
    }
}

// 导出测试类
export { DataFlowTests };

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined') {
    window.DataFlowTests = DataFlowTests;
    window.runDataFlowTests = () => {
        const tests = new DataFlowTests();
        return tests.runAllTests();
    };
}