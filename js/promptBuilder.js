// 草船借箭 - AI提示词构建器
// 根据游戏状态动态构建发送给AI的Prompt

import { globalState, characters, chapters, events, items, reactionRules, dialogueRules } from './data/gameData.js';

/**
 * AI提示词构建器
 */
class PromptBuilder {
  constructor() {
    this.systemPrompt = this.getSystemPrompt();
    this.gameBackground = this.getGameBackground();
  }

  /**
   * 构建完整的AI提示词
   * @param {Object} gameState - 当前游戏状态
   * @param {Object} playerAction - 玩家行动
   * @returns {string} 完整的提示词
   */
  buildPrompt(gameState, playerAction) {
    const chapter = chapters[`chapter${gameState.chapter}`];
    const activeNPCs = this.getActiveNPCs(gameState.currentScene);
    
    let prompt = this.systemPrompt;
    
    // 添加游戏背景
    prompt += `\n## 游戏背景\n${this.gameBackground}`;
    
    // 添加当前章节信息
    prompt += `\n\n## 当前章节：第${chapter.id}章 ${chapter.title}`;
    prompt += `\n\n### 章节梗概\n${chapter.plotSummary}`;
    
    // 添加本章节需要触发的道具和事件
    prompt += this.buildChapterEventsAndItems(chapter.id);
    
    // 添加当前场景出场人物
    prompt += this.buildCharacterSection(gameState, activeNPCs);
    
    // 添加数值变化规则
    prompt += this.buildReactionRules(activeNPCs);
    
    // 添加当前游戏状态
    prompt += this.buildGameStateSection(gameState, chapter);
    
    // 添加对话历史
    prompt += this.buildDialogueHistory(gameState.dialogueHistory);
    
    // 添加玩家最新行动
    prompt += this.buildPlayerAction(playerAction);
    
    // 添加输出要求
    prompt += this.getOutputRequirements();
    
    return prompt;
  }

  /**
   * 获取系统设定
   */
  getSystemPrompt() {
    return `## 系统设定
你是文字冒险游戏《草船借箭》的游戏主持人。你需要：
1. 扮演所有NPC角色，保持其性格特征
2. 根据玩家（诸葛亮）的言行判断NPC属性值的变化
3. 根据章节规则更新特殊进度值
4. 推进剧情发展，营造紧张氛围
5. 识别何时应该触发特定事件，并按照格式输出`;
  }

  /**
   * 获取游戏背景
   */
  getGameBackground() {
    return `建安十三年冬，曹操率八十万大军南下，兵锋直指江东。孙刘联盟初成，共御强敌。时诸葛孔明奉刘玄德之命，留驻东吴襄助破曹。然东吴大都督周公瑾，虽英姿勃发，才略过人，却心胸偏狭，见孔明智谋超群，恐日后为东吴之患，遂生妒贤之心。`;
  }

  /**
   * 根据场景获取活跃的NPC列表
   * @param {string} scene - 当前场景
   * @returns {Array} NPC ID列表
   */
  getActiveNPCs(scene) {
    const sceneNPCs = {
      "东吴军营": ["zhouYu", "luSu"],
      "江边": ["luSu", "ganNing"],
      "船上": ["ganNing"],
      "军议厅": ["zhouYu", "luSu", "ganNing"],
      "观星台": [],
      "水寨": ["ganNing"]
    };
    return sceneNPCs[scene] || [];
  }

  /**
   * 构建角色信息部分
   * @param {Object} gameState - 游戏状态
   * @param {Array} activeNPCs - 活跃NPC列表
   * @returns {string} 角色信息文本
   */
  buildCharacterSection(gameState, activeNPCs) {
    let section = `\n\n### 当前场景出场人物`;
    
    // 添加玩家角色
    const playerAttrs = gameState.characters?.zhugeLiang?.attributes || characters.zhugeLiang.attributes;
    section += `\n\n**诸葛亮（玩家角色）**\n- 当前属性：智谋值${playerAttrs.intelligence}，口才值${playerAttrs.eloquence}，体力值${playerAttrs.stamina}`;
    
    // 添加当前场景NPC
    activeNPCs.forEach(npcId => {
      const npc = characters[npcId];
      const attrs = gameState.characters?.[npcId]?.attributes || npc.attributes;
      section += `\n\n**${npc.name}（NPC）**\n- 身份：${npc.description.split('。')[0]}\n- 性格：${npc.description.split('。')[1]}\n- 当前属性：${this.formatAttributes(attrs)}`;
    });
    
    return section;
  }

  /**
   * 构建反应规则部分
   * @param {Array} activeNPCs - 活跃NPC列表
   * @returns {string} 反应规则文本
   */
  buildChapterEventsAndItems(chapterId) {
    const chapterEventsAndItems = {
      1: {
        events: [
          { name: "应对挑衅", id: "choice_event1" },
          { name: "立下军令", id: "dialogue_event2" },
          { name: "说服鲁肃", id: "check_event1" }
        ],
        items: [
          { name: "军令状", id: "militaryOrder", trigger: "dialogue_event2完成后获得" },
          { name: "东吴虎符", id: "dongwuTiger", trigger: "check_event1成功后获得" }
        ]
      },
      2: {
        events: [
          { name: "索要物资", id: "dialogue_event3" },
          { name: "应对甘宁", id: "choice_event2" },
          { name: "智谋对决", id: "check_event2" },
          { name: "天机预测", id: "dialogue_event4" },
          { name: "夜间准备", id: "check_event3" }
        ],
        items: [
          { name: "司南", id: "sima", trigger: "dialogue_event4完成后获得" },
          { name: "迷魂香", id: "confusionIncense", trigger: "check_event2成功且甘宁机警值<65时获得" },
          { name: "草人", id: "grassman", trigger: "check_event3成功后获得" },
          { name: "战鼓", id: "warDrum", trigger: "准备进度>=80时获得" },
          { name: "鲁肃举荐信", id: "luSuLetter", trigger: "特定条件下获得" }
        ]
      },
      3: {
        events: [
          { name: "出发前动员", id: "dialogue_event5" },
          { name: "突破封锁", id: "choice_event3" },
          { name: "擂鼓借箭", id: "check_event4" },
          { name: "紧急撤退", id: "check_event5" },
          { name: "最后危机", id: "choice_event4" },
          { name: "周瑜认输", id: "dialogue_event7" }
        ],
        items: [
          { name: "顺风符", id: "windTalisman", trigger: "check_event4大成功时获得" }
        ]
      }
    };
    
    const chapterData = chapterEventsAndItems[chapterId];
    if (!chapterData) return '';
    
    let section = `\n\n### 本章节需要触发的道具和事件`;
    
    if (chapterData.events.length > 0) {
      section += `\n\n**事件列表：**`;
      chapterData.events.forEach(event => {
        section += `\n- ${event.name} (ID: ${event.id})`;
      });
    }
    
    if (chapterData.items.length > 0) {
      section += `\n\n**道具获得规则：**`;
      chapterData.items.forEach(item => {
        section += `\n- ${item.name} (ID: ${item.id}) - ${item.trigger}`;
      });
      section += `\n\n**重要：当满足道具获得条件时，你必须在回复的items字段中包含对应道具，格式为：\"items\": {\"${chapterData.items[0]?.id || 'itemId'}\": {\"gained\": true}}**`;
    }
    
    return section;
  }

  buildReactionRules(activeNPCs) {
    let section = `\n\n### 数值变化规则`;
    
    activeNPCs.forEach(npcId => {
      // 处理基本NPC规则
      if (reactionRules[npcId]) {
        section += `\n\n**${characters[npcId].name}的反应规则：**\n${reactionRules[npcId]}`;
      }
      
      // 处理第二章鲁肃的特殊规则
      if (npcId === 'luSu' && reactionRules.luSuChapter2) {
        section += `\n\n**${characters[npcId].name}的第二章特殊规则：**\n${reactionRules.luSuChapter2}`;
      }
    });
    
    return section;
  }

  /**
   * 构建章节特殊规则
   * @param {number} chapterId - 章节ID
   * @returns {string} 特殊规则文本
   */
  buildChapterSpecialRules(chapterId) {
    let section = `\n\n### 章节特殊规则`;
    
    // 添加基本成功/失败条件
    switch(chapterId) {
      case 1:
        section += `\n- 成功条件：获得道具"东吴虎符"\n- 失败条件：时间进度>3或周瑜猜忌值≥100\n- 特殊机制：通过说服鲁肃获得虎符，避免周瑜过度猜忌`;
        break;
      case 2:
        section += `\n- 成功条件：准备进度≥100\n- 失败条件：时间进度>2且准备进度<80\n- 特殊机制：准备进度通过各种准备活动累积，需要平衡效率与隐蔽性`;
        break;
      case 3:
        section += `\n- 多重结局系统：\n  * 完美结局：箭支≥100000，危险等级<50，船只损失=0\n  * 成功结局：箭支≥80000，危险等级<80\n  * 勉强结局：箭支≥50000\n  * 失败结局：箭支<70000或危险等级=100或时间进度>3\n- 特殊机制：危险等级和士兵士气影响借箭效率和撤退成功率`;
        break;
    }
    
    // 添加章节特殊数值变化规则
    const chapterKey = `chapter${chapterId}`;
    if (dialogueRules[chapterKey]) {
      section += `\n\n### 章节特殊数值变化规则`;
      const chapterRules = dialogueRules[chapterKey];
      
      Object.keys(chapterRules).forEach(ruleKey => {
        const ruleName = this.getRuleDisplayName(ruleKey);
        section += `\n\n**${ruleName}：**\n${chapterRules[ruleKey]}`;
      });
    }
    
    return section;
  }
  
  /**
   * 获取规则显示名称
   * @param {string} ruleKey - 规则键名
   * @returns {string} 显示名称
   */
  getRuleDisplayName(ruleKey) {
    const displayNames = {
      persuasionProgress: '说服进度',
      preparationProgress: '准备进度',
      arrows: '箭支数量',
      dangerLevel: '危险等级',
      soldierMorale: '士兵士气',
      shipLoss: '船只损失'
    };
    
    return displayNames[ruleKey] || ruleKey;
  }

  /**
   * 构建游戏状态部分
   * @param {Object} gameState - 游戏状态
   * @param {Object} chapter - 章节信息
   * @returns {string} 游戏状态文本
   */
  buildGameStateSection(gameState, chapter) {
    let section = `\n\n### 当前游戏状态\n全局状态：`;
    
    // 全局状态
    const globalStateData = gameState.globalState || globalState;

    section += `\n- 时间进度(timeProgress)：第${globalStateData.timeProgress.current}日/共${globalStateData.timeProgress.max}日`;
    section += `\n- 箭支数量(arrows)：${globalStateData.arrows.current}支`;
    
    // 章节特有状态
    if (chapter.chapterState) {
      section += `\n\n章节状态：`;
      Object.entries(chapter.chapterState).forEach(([key, value]) => {
        const currentValue = gameState.chapterState?.[key]?.current || value.current;
        section += `\n- ${value.description}(${key})：${currentValue}/${value.max}`;
      });
    }
    
    return section;
  }

  /**
   * 构建对话历史部分
   * @param {Array} dialogueHistory - 对话历史
   * @returns {string} 对话历史文本
   */
  buildDialogueHistory(dialogueHistory) {
    let section = `\n\n### 对话历史`;
    
    if (!dialogueHistory || dialogueHistory.length === 0) {
      section += `\n暂无对话历史`;
      return section;
    }
    
    // 取最近10条对话
    const recentDialogue = dialogueHistory.slice(-10);
    recentDialogue.forEach(dialogue => {
      section += `\n${dialogue.speaker}：${dialogue.content}`;
    });
    
    return section;
  }

  /**
   * 构建玩家行动部分
   * @param {Object} playerAction - 玩家行动
   * @returns {string} 玩家行动文本
   */
  buildPlayerAction(playerAction) {
    let section = `\n\n### 玩家最新发言`;
    
    // 道具使用
    if (playerAction.item) {
      const item = items[playerAction.item];
      if (item) {
        section += `\n玩家使用道具：${item.name}，效果：${this.formatItemEffect(item.effect)}`;
      }
    }
    
    // 玩家发言
    section += `\n玩家发言：${playerAction.input || '（无发言）'}`;
    
    return section;
  }

  /**
   * 获取输出要求
   */
  getOutputRequirements() {
    return `\n\n## 输出要求\n**根据当前的对话历史判断，你应该如何安排旁白和出场人物的发言顺序和内容以及数值变化。**\n请根据当前情况，以JSON格式输出：\n{\n  "narrative": "环境描述和剧情推进的叙述文本",\n  "npc_dialogue": {\n    "speaker": "NPC名字",\n    "content": "对话内容"\n  },\n  "value_changes": {\n    "npcName": {\n      "attribute": "±数值"\n    }\n  },\n  "special_progress": {\n    "progressName": "±数值"\n  },\n  "event_suggestion": {\n    "should_trigger": true/false,\n    "event_id": "事件ID",\n    "reason": "触发理由"\n  },\n  "item_grant": {\n    "should_grant": true/false,\n    "item_id": "道具ID",\n    "condition_met": "条件说明"\n  }\n}\n\n**重要说明：**\n- event_suggestion字段：当需要触发事件时，设置should_trigger为true，并提供事件ID和触发理由\n- item_grant字段：当需要获得道具时，设置should_grant为true，并提供道具ID和条件说明\n- special_progress字段：用于更新特殊进度值，如preparationProgress等\n- 如果不需要触发事件或获得道具，对应字段可以省略或设为null`;
  }

  /**
   * 格式化属性显示
   * @param {Object} attrs - 属性对象
   * @returns {string} 格式化的属性文本
   */
  formatAttributes(attrs) {
    const attrNameMap = {
      intelligence: "智谋值",
      suspicion: "猜忌值",
      trust: "信任值",
      alertness: "机警值",
      eloquence: "口才值",
      stamina: "体力值"
    };
    
    return Object.entries(attrs)
      .map(([key, value]) => {
        const attrName = attrNameMap[key] || key;
        return `${attrName}${value}`;
      })
      .join('，');
  }

  /**
   * 格式化道具效果
   * @param {Object} effect - 道具效果
   * @returns {string} 格式化的效果文本
   */
  formatItemEffect(effect) {
    if (effect.type === 'attributeChange') {
      return `${effect.target}+${effect.value}`;
    } else if (effect.type === 'checkBonus') {
      return `${effect.target}检定+${effect.value}`;
    } else if (effect.type === 'special') {
      return effect.target;
    } else if (effect.type === 'multiple') {
      return effect.effects.map(e => this.formatItemEffect(e)).join('，');
    }
    return "特殊效果";
  }
}

/**
 * API调用函数示例
 * @param {string} prompt - 构建的提示词
 * @returns {Promise} API响应
 */
async function callDeepSeekAPI(prompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-f3ebd7b147f648c99f24ba9ee9e07550'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// 导出
export { PromptBuilder, callDeepSeekAPI };
export default PromptBuilder;