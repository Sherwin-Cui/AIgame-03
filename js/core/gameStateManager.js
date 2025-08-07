// 草船借箭 - 游戏状态管理系统
// 负责管理游戏中所有动态变化的数值和状态

import { globalState, characters, chapters, events, items } from '../data/gameData.js';
import { GameUtils } from '../utils/gameUtils.js';

/**
 * 游戏状态管理器
 * 维护所有角色属性、章节进度、道具状态等动态数据
 */
class GameStateManager {
  constructor() {
    this.initializeGameState();
  }

  /**
   * 初始化游戏状态
   */
  initializeGameState() {
    // 角色当前属性状态
    this.characterStates = {
      zhugeLiang: {
        intelligence: 95,
        eloquence: 90,
        stamina: 100
      },
      zhouYu: {
        intelligence: 92,
        suspicion: 80
      },
      luSu: {
        trust: 50
      },
      ganNing: {
        intelligence: 65,
        alertness: 75
      }
    };

    // 当前章节状态
    this.chapterStates = {
      currentChapter: 1,
      chapter1: {
        timeProgress: 1,
        completed: false
      },
      chapter2: {
        timeProgress: 2,
        preparationProgress: 0,
        completed: false
      },
      chapter3: {
        arrowProgress: 0,
        dangerLevel: 0,
        soldierMorale: 80,
        completed: false
      }
    };

    // 玩家道具状态
    this.inventory = {
      kongMingFan: { owned: true, used: false },
      xuanDeBrush: { owned: true, used: false },
      militaryOrder: { owned: false, used: false },
      dongwuTiger: { owned: false, used: false },
      sima: { owned: false, used: false },
      grassman: { owned: false, used: false },
      warDrum: { owned: false, used: false },
      confusionIncense: { owned: false, used: false },
      windTalisman: { owned: false, used: false },
      luSuLetter: { owned: false, used: false }
    };

    // 游戏全局状态
    this.gameState = {
      isGameOver: false,
      currentEnding: null,
      totalArrows: 0,
      reputation: 100,
      daysPassed: 0,
      eventsCompleted: [],
      choicesMade: []
    };

    // 事件触发状态
    this.eventStates = {
      dialogue1: { triggered: false, completed: false },
      dialogue2: { triggered: false, completed: false },
      dialogue3: { triggered: false, completed: false },
      dialogue4: { triggered: false, completed: false },
      dialogue5: { triggered: false, completed: false },
      dialogue7: { triggered: false, completed: false },
      choice1: { triggered: false, completed: false, selectedOption: null },
      choice2: { triggered: false, completed: false, selectedOption: null },
      choice3: { triggered: false, completed: false, selectedOption: null },
      choice4: { triggered: false, completed: false, selectedOption: null },
      check1: { triggered: false, completed: false, result: null },
      check2: { triggered: false, completed: false, result: null },
      check3: { triggered: false, completed: false, result: null },
      check4: { triggered: false, completed: false, result: null },
      check5: { triggered: false, completed: false, result: null },
      emergency1: { triggered: false, completed: false }
    };
  }

  /**
   * 获取角色当前属性值
   * @param {string} characterId - 角色ID
   * @param {string} attribute - 属性名
   * @returns {number} 属性值
   */
  getCharacterAttribute(characterId, attribute) {
    return this.characterStates[characterId]?.[attribute] || 0;
  }

  /**
   * 修改角色属性值
   * @param {string} characterId - 角色ID
   * @param {string} attribute - 属性名
   * @param {number} change - 变化值（正数增加，负数减少）
   * @param {boolean} absolute - 是否为绝对值设置
   */
  modifyCharacterAttribute(characterId, attribute, change, absolute = false) {
    if (!this.characterStates[characterId]) {
      console.warn(`角色 ${characterId} 不存在`);
      return;
    }

    if (absolute) {
      this.characterStates[characterId][attribute] = change;
    } else {
      this.characterStates[characterId][attribute] = 
        (this.characterStates[characterId][attribute] || 0) + change;
    }

    // 确保属性值在合理范围内
    this.characterStates[characterId][attribute] = 
      Math.max(0, Math.min(100, this.characterStates[characterId][attribute]));

    console.log(`${characterId} 的 ${attribute} 变更为: ${this.characterStates[characterId][attribute]}`);
  }

  /**
   * 获取章节状态值
   * @param {number} chapterNum - 章节号
   * @param {string} stateKey - 状态键
   * @returns {any} 状态值
   */
  getChapterState(chapterNum, stateKey) {
    const chapterKey = `chapter${chapterNum}`;
    return this.chapterStates[chapterKey]?.[stateKey];
  }

  /**
   * 修改章节状态值
   * @param {number} chapterNum - 章节号
   * @param {string} stateKey - 状态键
   * @param {any} value - 新值
   * @param {boolean} relative - 是否为相对变化
   */
  modifyChapterState(chapterNum, stateKey, value, relative = false) {
    const chapterKey = `chapter${chapterNum}`;
    if (!this.chapterStates[chapterKey]) {
      console.warn(`章节 ${chapterNum} 不存在`);
      return;
    }

    if (relative) {
      this.chapterStates[chapterKey][stateKey] = 
        (this.chapterStates[chapterKey][stateKey] || 0) + value;
    } else {
      this.chapterStates[chapterKey][stateKey] = value;
    }

    console.log(`第${chapterNum}章 ${stateKey} 更新为: ${this.chapterStates[chapterKey][stateKey]}`);
  }

  /**
   * 检查道具是否拥有
   * @param {string} itemId - 道具ID
   * @returns {boolean} 是否拥有
   */
  hasItem(itemId) {
    return this.inventory[itemId]?.owned || false;
  }

  /**
   * 获得道具
   * @param {string} itemId - 道具ID
   */
  gainItem(itemId) {
    if (this.inventory[itemId]) {
      this.inventory[itemId].owned = true;
      console.log(`获得道具: ${items[itemId]?.name || itemId}`);
    } else {
      console.warn(`道具 ${itemId} 不存在`);
    }
  }

  /**
   * 使用道具
   * @param {string} itemId - 道具ID
   * @returns {boolean} 是否使用成功
   */
  useItem(itemId) {
    if (!this.hasItem(itemId)) {
      console.warn(`没有道具: ${itemId}`);
      return false;
    }

    if (this.inventory[itemId].used) {
      console.warn(`道具 ${itemId} 已经使用过`);
      return false;
    }

    this.inventory[itemId].used = true;
    console.log(`使用道具: ${items[itemId]?.name || itemId}`);
    return true;
  }

  /**
   * 执行检定
   * @param {string} checkType - 检定类型 (intelligence, eloquence)
   * @param {number} difficulty - 难度值
   * @param {Array} itemBonuses - 道具加成列表
   * @returns {Object} 检定结果
   */
  performCheck(checkType, difficulty = 0, itemBonuses = []) {
    const playerAttribute = this.getCharacterAttribute('zhugeLiang', checkType);
    let totalBonus = 0;

    // 计算道具加成
    itemBonuses.forEach(itemId => {
      if (this.hasItem(itemId) && !this.inventory[itemId].used) {
        const item = items[itemId];
        if (item && item.effect.includes(checkType)) {
          // 简单的加成计算，实际应该根据道具效果解析
          totalBonus += 10; // 默认加成
        }
      }
    });

    const successRate = Math.max(0, Math.min(100, playerAttribute + totalBonus - difficulty));
    const randomValue = Math.random() * 100;
    const success = randomValue < successRate;

    const result = {
      success,
      playerAttribute,
      totalBonus,
      difficulty,
      successRate,
      randomValue
    };

    console.log(`检定结果: ${checkType} - ${success ? '成功' : '失败'} (成功率: ${successRate}%, 随机值: ${randomValue.toFixed(2)}%)`);
    return result;
  }

  /**
   * 触发事件
   * @param {string} eventId - 事件ID
   */
  triggerEvent(eventId) {
    if (this.eventStates[eventId]) {
      this.eventStates[eventId].triggered = true;
    }
  }

  /**
   * 完成事件
   * @param {string} eventId - 事件ID
   * @param {any} result - 事件结果
   */
  completeEvent(eventId, result = null) {
    if (this.eventStates[eventId]) {
      this.eventStates[eventId].completed = true;
      this.eventStates[eventId].result = result;
      this.gameState.eventsCompleted.push(eventId);
    }
  }

  /**
   * 记录选择
   * @param {string} choiceEventId - 选择事件ID
   * @param {string} option - 选择的选项
   */
  recordChoice(choiceEventId, option) {
    if (this.eventStates[choiceEventId]) {
      this.eventStates[choiceEventId].selectedOption = option;
      this.gameState.choicesMade.push({ eventId: choiceEventId, option });
    }
  }

  /**
   * 检查条件是否满足
   * @param {string} condition - 条件表达式
   * @returns {boolean} 是否满足
   */
  checkCondition(condition) {
    return GameUtils.checkCondition(condition, (expr) => this.evaluateExpression(expr));
  }

  /**
   * 计算表达式值
   * @param {string} expression - 表达式
   * @returns {number} 计算结果
   */
  evaluateExpression(expression) {
    // 简单的表达式计算，支持角色属性访问
    if (expression.includes('.')) {
      const [characterId, attribute] = expression.split('.');
      return this.getCharacterAttribute(characterId, attribute);
    }
    return parseFloat(expression) || 0;
  }

  /**
   * 推进到下一章
   */
  advanceToNextChapter() {
    const currentChapter = this.chapterStates.currentChapter;
    this.chapterStates[`chapter${currentChapter}`].completed = true;
    this.chapterStates.currentChapter = currentChapter + 1;
    console.log(`推进到第${currentChapter + 1}章`);
  }

  /**
   * 设置游戏结局
   * @param {string} ending - 结局类型
   */
  setGameEnding(ending) {
    this.gameState.isGameOver = true;
    this.gameState.currentEnding = ending;
  }

  /**
   * 获取当前游戏状态摘要
   * @returns {Object} 状态摘要
   */
  getGameStateSummary() {
    return {
      currentChapter: this.chapterStates.currentChapter,
      playerAttributes: this.characterStates.zhugeLiang,
      keyNPCStates: {
        zhouYu: this.characterStates.zhouYu,
        luSu: this.characterStates.luSu,
        ganNing: this.characterStates.ganNing
      },
      inventory: Object.keys(this.inventory).filter(item => this.inventory[item].owned),
      gameProgress: {
        eventsCompleted: this.gameState.eventsCompleted.length,
        isGameOver: this.gameState.isGameOver,
        currentEnding: this.gameState.currentEnding
      }
    };
  }

  /**
   * 保存游戏状态到本地存储
   */
  saveGameState() {
    const saveData = {
      characterStates: this.characterStates,
      chapterStates: this.chapterStates,
      inventory: this.inventory,
      gameState: this.gameState,
      eventStates: this.eventStates,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('grassBoatGameSave', JSON.stringify(saveData));
      console.log('游戏状态已保存');
    } catch (error) {
      console.error('保存游戏状态失败:', error);
    }
  }

  /**
   * 从本地存储加载游戏状态
   * @returns {boolean} 是否加载成功
   */
  loadGameState() {
    try {
      const saveData = localStorage.getItem('grassBoatGameSave');
      if (saveData) {
        const parsedData = JSON.parse(saveData);
        this.characterStates = parsedData.characterStates;
        this.chapterStates = parsedData.chapterStates;
        this.inventory = parsedData.inventory;
        this.gameState = parsedData.gameState;
        this.eventStates = parsedData.eventStates;
        console.log('游戏状态已加载');
        return true;
      }
    } catch (error) {
      console.error('加载游戏状态失败:', error);
    }
    return false;
  }

  /**
   * 重置游戏状态
   */
  resetGameState() {
    this.initializeGameState();
    localStorage.removeItem('grassBoatGameSave');
    console.log('游戏状态已重置');
  }
}

// 创建全局游戏状态管理器实例
const gameStateManager = new GameStateManager();

// 导出管理器类和实例
export { GameStateManager };
export default gameStateManager;

// 为了方便调试，将管理器挂载到全局对象
if (typeof window !== 'undefined') {
  window.gameStateManager = gameStateManager;
}