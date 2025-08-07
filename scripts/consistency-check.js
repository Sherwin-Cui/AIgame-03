#!/usr/bin/env node

/**
 * 草船借箭游戏 - 代码一致性检查脚本
 * 用于自动化检查代码库中的命名一致性和数据流完整性
 */

const fs = require('fs');
const path = require('path');

class ConsistencyChecker {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.errors = [];
        this.warnings = [];
        this.jsFiles = [];
        this.mdFiles = [];
    }

    /**
     * 运行所有一致性检查
     */
    async runAllChecks() {
        console.log('🔍 开始代码一致性检查...');
        console.log('=' .repeat(50));
        
        // 扫描文件
        this.scanFiles();
        
        // 执行各项检查
        this.checkVariableNaming();
        this.checkFunctionNaming();
        this.checkModuleImports();
        this.checkDataStructures();
        this.checkDeprecatedUsage();
        this.checkAIResponseFormat();
        
        // 生成报告
        this.generateReport();
        
        return {
            errors: this.errors.length,
            warnings: this.warnings.length,
            success: this.errors.length === 0
        };
    }

    /**
     * 扫描项目文件
     */
    scanFiles() {
        const scanDir = (dir) => {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                    scanDir(filePath);
                } else if (file.endsWith('.js')) {
                    this.jsFiles.push(filePath);
                } else if (file.endsWith('.md')) {
                    this.mdFiles.push(filePath);
                }
            }
        };
        
        scanDir(this.projectRoot);
        console.log(`📁 扫描到 ${this.jsFiles.length} 个 JS 文件，${this.mdFiles.length} 个 MD 文件`);
    }

    /**
     * 检查变量命名一致性
     */
    checkVariableNaming() {
        console.log('\n🏷️  检查变量命名一致性...');
        
        const deprecatedVariables = [
            'zhouYuAlert',
            'luSuTrust'
        ];
        
        const correctPatterns = [
            'zhouYu.suspicion',
            'luSu.trust',
            'ganNing.alertness',
            'zhugeLiang.intelligence',
            'zhugeLiang.eloquence',
            'zhugeLiang.stamina'
        ];
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                // 检查已废弃的变量
                for (const deprecated of deprecatedVariables) {
                    if (line.includes(deprecated) && !line.includes('//') && !line.includes('*')) {
                        // 排除注释中的使用
                        if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                            this.addError(
                                `已废弃变量: ${deprecated}`,
                                filePath,
                                index + 1,
                                line.trim()
                            );
                        }
                    }
                }
                
                // 检查是否使用了正确的格式
                for (const pattern of correctPatterns) {
                    if (line.includes(pattern)) {
                        console.log(`  ✅ 发现正确格式: ${pattern} (${path.basename(filePath)}:${index + 1})`);
                    }
                }
            });
        }
    }

    /**
     * 检查函数命名一致性
     */
    checkFunctionNaming() {
        console.log('\n🔧 检查函数命名一致性...');
        
        const functionPatterns = {
            'parseValueChange': 'GameUtils.parseValueChange',
            'checkCondition': 'GameUtils.checkCondition',
            'applyValueChanges': 'GameUtils.applyValueChanges'
        };
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                for (const [oldPattern, newPattern] of Object.entries(functionPatterns)) {
                    // 检查是否使用了旧的函数调用方式
                    if (line.includes(oldPattern) && !line.includes(newPattern) && !line.includes('//')) {
                        this.addWarning(
                            `建议使用模块化函数: ${newPattern} 而不是 ${oldPattern}`,
                            filePath,
                            index + 1,
                            line.trim()
                        );
                    }
                }
            });
        }
    }

    /**
     * 检查模块导入一致性
     */
    checkModuleImports() {
        console.log('\n📦 检查模块导入一致性...');
        
        const importPatterns = [
            /import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g,
            /import\s+\w+\s+from\s+['"][^'"]+['"]/g
        ];
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                // 检查相对路径导入
                if (line.includes('import') && line.includes('./')) {
                    console.log(`  📋 导入语句: ${line.trim()} (${path.basename(filePath)}:${index + 1})`);
                }
            });
        }
    }

    /**
     * 检查已废弃用法
     */
    checkDeprecatedUsage() {
        console.log('\n🚫 检查已废弃用法...');
        
        const deprecatedPatterns = [
            'autoEvents',
            'zhouYuAlert',
            'luSuTrust'
        ];
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                for (const pattern of deprecatedPatterns) {
                    if (line.includes(pattern) && !line.includes('//') && !line.includes('*')) {
                        if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                            this.addError(
                                `使用了已废弃的模式: ${pattern}`,
                                filePath,
                                index + 1,
                                line.trim()
                            );
                        }
                    }
                }
            });
        }
    }

    /**
     * 检查AI响应格式一致性
     */
    checkAIResponseFormat() {
        console.log('\n🤖 检查AI响应格式一致性...');
        
        const requiredAIFields = ['special_progress', 'event_suggestion', 'item_grant'];
        const deprecatedAIFields = ['autoEvents', 'items'];
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                // 检查是否包含正确的AI响应字段
                for (const field of requiredAIFields) {
                    if (line.includes(field)) {
                        console.log(`  ✅ 发现正确AI字段: ${field} (${path.basename(filePath)}:${index + 1})`);
                    }
                }
                
                // 检查是否使用了已废弃的AI响应字段
                for (const field of deprecatedAIFields) {
                    if (line.includes(field) && !line.includes('//') && !line.includes('*')) {
                        if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                            this.addError(
                                `AI响应使用了已废弃字段: ${field}`,
                                filePath,
                                index + 1,
                                line.trim()
                            );
                        }
                    }
                }
            });
        }
    }

    /**
     * 检查数据结构一致性
     */
    checkDataStructures() {
        console.log('\n🏗️  检查数据结构一致性...');
        
        for (const filePath of this.jsFiles) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 检查gameData.js中的数据结构
            if (filePath.includes('gameData.js')) {
                const requiredStructures = ['initialState', 'events', 'items'];
                for (const structure of requiredStructures) {
                    if (content.includes(structure)) {
                        console.log(`  ✅ 发现数据结构: ${structure}`);
                    }
                }
            }
        }
    }

    /**
     * 添加错误
     */
    addError(message, file, line, code) {
        this.errors.push({
            type: 'error',
            message,
            file: path.relative(this.projectRoot, file),
            line,
            code
        });
    }

    /**
     * 添加警告
     */
    addWarning(message, file, line, code) {
        this.warnings.push({
            type: 'warning',
            message,
            file: path.relative(this.projectRoot, file),
            line,
            code
        });
    }

    /**
     * 生成检查报告
     */
    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 一致性检查报告');
        console.log('='.repeat(50));
        
        console.log(`错误数量: ${this.errors.length}`);
        console.log(`警告数量: ${this.warnings.length}`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ 错误列表:');
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.message}`);
                console.log(`   文件: ${error.file}:${error.line}`);
                if (error.code) {
                    console.log(`   代码: ${error.code}`);
                }
                console.log('');
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  警告列表:');
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. ${warning.message}`);
                console.log(`   文件: ${warning.file}:${warning.line}`);
                if (warning.code) {
                    console.log(`   代码: ${warning.code}`);
                }
                console.log('');
            });
        }
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('\n🎉 恭喜！没有发现一致性问题。');
        }
        
        console.log('='.repeat(50));
        
        // 保存报告到文件
        this.saveReportToFile();
    }

    /**
     * 保存报告到文件
     */
    saveReportToFile() {
        const reportPath = path.join(this.projectRoot, 'consistency-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                errors: this.errors.length,
                warnings: this.warnings.length,
                filesScanned: this.jsFiles.length + this.mdFiles.length
            },
            errors: this.errors,
            warnings: this.warnings
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 详细报告已保存到: ${reportPath}`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const projectRoot = process.argv[2] || process.cwd();
    const checker = new ConsistencyChecker(projectRoot);
    
    checker.runAllChecks().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('检查过程中发生错误:', error);
        process.exit(1);
    });
}

module.exports = ConsistencyChecker;