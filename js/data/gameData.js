// 草船借箭 - 游戏数据配置文件

// 全局状态管理
const globalState = {
  timeProgress: { current: 1, max: 3, description: "当前日期/总共3日" },
  arrows: { current: 0, max: 120000, description: "当前箭支数量" }
};

// 数据类型定义
const dataTypes = {
  effectTypes: {
    checkBonus: "检定加成",
    attributeChange: "属性修改", 
    special: "特殊效果",
    multiple: "复合效果"
  },
  usageTypes: {
    automatic: "自动生效",
    manual: "手动使用",
    conditional: "条件触发"
  },
  timingTypes: {
    beforeCheck: "检定前",
    duringEvent: "事件中",
    afterEvent: "事件后"
  }
};

// 角色数据
const characters = {
  // 玩家角色
  zhugeLiang: {
    name: "诸葛亮",
    description: "字孔明，号卧龙。刘备军师，羽扇纶巾，飘然若仙。胸藏天地，腹隐兵机。善观天象，能察人心。",
    isPlayer: true,
    attributes: {
      intelligence: 95,  // 智谋值
      eloquence: 90,    // 口才值
      stamina: 100      // 体力值
    }
  },
  
  // NPC角色
  zhouYu: {
    name: "周瑜",
    description: "字公瑾，东吴大都督。姿质风流，雅量高致。然器量偏狭，见贤思齐而又妒贤嫉能。猜忌值越高，越对诸葛亮刁难。",
    isPlayer: false,
    attributes: {
      intelligence: 92,  // 智谋值
      suspicion: 50      // 猜忌值（兼任警觉功能）
    }
  },
  
  luSu: {
    name: "鲁肃",
    description: "字子敬，东吴谋臣。为人方正，宽厚长者。识才爱才，常为善类。信任值越高，越愿意帮助诸葛亮。",
    isPlayer: false,
    attributes: {
      trust: 50          // 信任值（兼任说服进度）
    }
  },
  
  ganNing: {
    name: "甘宁",
    description: "字兴霸，东吴大将。性烈如火，忠勇过人。奉公瑾之命，暗中监视。机警值越高，对玩家越刁难。",
    isPlayer: false,
    attributes: {
      intelligence: 65,  // 智谋值
      alertness: 75      // 机警值
    }
  }
};

// 章节数据
const chapters = {
  chapter1: {
    id: 1,
    title: "三日之约",
    openingText: "建安十三年冬，曹操率八十万大军南下，兵锋直指江东。孙刘联盟初成，共御强敌。时诸葛孔明奉刘玄德之命，留驻东吴襄助破曹。然东吴大都督周公瑾，虽英姿勃发，才略过人，却心胸偏狭，见孔明智谋超群，恐日后为东吴之患，遂生妒贤之心。",
    plotSummary: "建安十三年冬，曹操大军压境，诸葛亮奉刘备之命留驻东吴协助抗曹。军议之上，周瑜心生妒忌，故意刁难诸葛亮，要求其在三日内造箭十万支。面对挑衅，诸葛亮需要做出选择。【此处触发抉择事件1-应对挑衅】若选择接受挑战，诸葛亮将立下军令状，以性命担保三日交箭。【此处触发对话事件2-立下军令，完成后AI应给予道具：军令状(militaryOrder)】当夜，诸葛亮独坐军帐，等待鲁肃来访。鲁肃悄然而至，诸葛亮需要说服他提供帮助。【此处触发检定事件1-说服鲁肃】若成功说服，鲁肃将交付东吴虎符。【检定成功后AI应给予道具：东吴虎符(dongwuTiger)】若失败，则需要使用玄德亲笔信来增加说服力。整章的核心是在第一日内获得鲁肃的帮助承诺，同时要注意不能让周瑜的猜忌值过高，否则会导致失败。",
    successConditions: [
      { variable: "item:dongwuTiger", operator: "==", value: true }
    ],
    failureConditions: [
      { type: "or", conditions: [
        { variable: "timeProgress", operator: ">", value: 3 },
        { variable: "zhouYu.suspicion", operator: ">=", value: 100 }
      ]}
    ],
    
    // 章节结束文本
    chapterEndTexts: {
      success: {
        title: "第一章：智取东吴",
        description: "成功说服鲁肃，获得了东吴虎符，为草船借箭做好了准备。",
        narrative: "第一章的目标已经达成。"
      },
      failure: {
        title: "第一章：功败垂成",
        description: "周瑜的猜忌达到顶点，你被逐出东吴。",
        narrative: "计划败露，任务失败。"
      }
    }
  },
  
  chapter2: {
    id: 2,
    title: "暗度陈仓",
    openingText: "次日拂晓，晨光熹微。你在鲁肃引领下，来到江边僻静之处，开始筹谋大计。然公瑾虽表面不动声色，暗中却遣人四处窥探，欲知你如何造箭。",
    plotSummary: "次日清晨，诸葛亮在鲁肃引领下来到江边筹划借箭大计。诸葛亮向鲁肃索要船只和草人等物资，但不透露真实用途。【此处触发对话事件3-索要物资】此时甘宁突然到访，质疑诸葛亮的行动。【此处触发抉择事件2-应对甘宁】若选择虚言掩饰，需要进行智谋对决。【此处触发检定事件2-智谋对决】检定成功后甘宁退去，若甘宁机警值较低，其亲兵会赠送迷魂香。【条件满足时AI应给予道具：迷魂香(confusionIncense)】午夜时分，诸葛亮登上观星台观察天象，预测到第三日必有大雾。【此处触发对话事件4-天机预测，完成后AI应给予道具：司南(sima)】随后需要在夜间秘密准备草人等物资。【此处触发检定事件3-夜间准备】准备成功可获得草人道具。【检定成功后AI应给予道具：草人(grassman)】鲁肃见诸葛亮筹划有方，写下举荐信以备不时之需。【此处AI应给予道具：鲁肃举荐信(luSuLetter)】若准备失败且周瑜警觉过高，可能触发甘宁夜查的突发事件。",
    chapterState: {
      preparationProgress: { current: 0, max: 100, description: "准备进度" }
    },
    successConditions: [
      { type: "and", conditions: [
        { variable: "preparationProgress", operator: ">=", value: 100 }
      ]}
    ],
    failureConditions: [
      { type: "or", conditions: [
        { type: "and", conditions: [
          { variable: "timeProgress", operator: ">", value: 2 },
          { variable: "preparationProgress", operator: "<", value: 80 }
        ]}
      ]}
    ],
    
    // 章节结束文本
    chapterEndTexts: {
      success: {
        title: "第二章：深入敌营",
        description: "成功潜入曹营，巧妙地完成了草船借箭的关键步骤。",
        narrative: "第二章的目标已经达成。"
      },
      failure: {
        title: "第二章：计划败露",
        description: "在曹营中被发现，计划失败，面临重大危机。",
        narrative: "第二章计划失败。"
      }
    }
  },
  
  chapter3: {
    id: 3,
    title: "雾夜借箭",
    openingText: "第三日子时，大雾弥天，长江之上白茫茫一片，对面不见人。正如你所料，天公作美，助你成事。",
    plotSummary: "第三日子时，大雾弥漫长江，正如诸葛亮所料。诸葛亮在船首动员士兵，说明今夜只需擂鼓呐喊，不必真正作战。【此处触发对话事件5-出发前动员】船队出发后遇到巡江哨船阻拦。【此处触发抉择事件3-突破封锁】若有东吴虎符可顺利通过，否则需要强闯并承受损失。抵达曹营水寨附近后，开始擂鼓借箭的关键行动。【此处触发检定事件4-擂鼓借箭】根据检定结果决定借箭数量，大成功可获得顺风符。【大成功时AI应给予道具：顺风符(windTalisman)】曹操听闻江上鼓声，疑有埋伏，下令万箭齐发。天将破晓，雾气渐散，需要紧急撤退。【此处触发检定事件5-紧急撤退】若撤退失败，追兵将至，需要做最后抉择。【失败时触发抉择事件4-最后危机】最终返回东吴，周瑜见十万余箭，不得不承认诸葛亮的才能。【此处触发对话事件7-周瑜认输，并进行最终结局判定】",
    chapterState: {
      dangerLevel: { current: 0, max: 100, description: "危险等级，满100任务失败" },
      soldierMorale: { current: 80, max: 100, description: "士兵士气，低于30会溃散" },
      shipLoss: { current: 0, max: 20, description: "损失的船只数量" }
    },
    endings: {
      perfect: {
        conditions: {
          type: "and",
          conditions: [
          { variable: "arrows", operator: ">=", value: 100000 },
          { variable: "dangerLevel", operator: "<", value: 50 },
          { variable: "shipLoss", operator: "==", value: 0 }
        ]
        },
        title: "神机妙算",
        description: "箭支充足，无人伤亡，完美完成任务。",
        narrative: "你的计策完美成功，获得了所有人的敬佩。"
      },
      success: {
        conditions: {
          type: "and",
          conditions: [
          { variable: "arrows", operator: ">=", value: 80000 },
          { variable: "dangerLevel", operator: "<", value: 80 }
        ]
        },
        title: "智计过人",
        description: "成功借得足够箭支，证明了自己的能力。",
        narrative: "虽有波折，但最终成功完成了任务。"
      },
      barely: {
        conditions: {
          type: "and",
          conditions: [
          { variable: "arrows", operator: ">=", value: 50000 }
        ]
        },
        title: "险中求胜",
        description: "虽然过程惊险，但最终还是完成了任务。",
        narrative: "险象环生，勉强完成了任务。"
      },
      failure: {
        conditions: {
          type: "or",
          conditions: [
            { variable: "arrowProgress", operator: "<", value: 70000 },
            { variable: "dangerLevel", operator: "==", value: 100 },
            { variable: "timeProgress", operator: ">", value: 3 }
          ]
        },
        title: "功败垂成",
        description: "未能完成任务，面临军法处置。",
        narrative: "计划失败，面临严重后果。",
        consequences: ["被周瑜处死", "全军覆没", "功败垂成"]
      }
    },
    
    // 章节结束文本
    chapterEndTexts: {
      success: {
        title: "第三章：雾夜借箭",
        description: "成功完成草船借箭，获得足够的箭支。",
        narrative: "第三章的目标已经达成。"
      },
      failure: {
        title: "第三章：计划败露", 
        description: "在最后关头功败垂成，计划失败。",
        narrative: "第三章计划失败。"
      }
    }
  }
};

// 事件数据
const events = {
  // 对话事件
  
  dialogue_event2: {
    id: "dialogue_event2",
    type: "dialogue_event",
    chapter: 1,
    title: "立下军令",
    content: "公瑾闻言，佯作惊诧，实则心中窃喜。即令左右取军令状来，白绢黑字，森然可畏。其上写明：限三日内交箭十万，如违期限，甘当军法。你提笔濡墨，从容书名，印上朱泥。公瑾收起军令，与你约定三日为期。"
  },
  
  dialogue_event3: {
    id: "dialogue_event3",
    type: "dialogue_event",
    chapter: 2,
    title: "索要物资",
    content: "你微微一笑：'子敬勿忧。烦请为亮备快船二十艘，每船用军士三十人，船皆用青布为幔，各束草千余个，分布两厢。吾别有妙用。'子敬愕然：'莫非先生欲往曹营劫寨？'你摇首不语，只道：'但依此行，勿令公瑾得知。'"
  },
  
  dialogue_event4: {
    id: "dialogue_event4",
    type: "dialogue_event",
    chapter: 2,
    title: "天机预测",
    content: "高台之上，夜风料峭。你负手而立，仰望苍穹。但见箕星东指，毕星西垂，心中暗自推算。忽而抚掌而笑：'善哉！善哉！'原来你夜观天象，已知三日后长江之上必有大雾。此正天助我也！"
  },
  
  dialogue_event5: {
    id: "dialogue_event5",
    type: "dialogue_event",
    chapter: 3,
    title: "出发前动员",
    content: "子时已至，大雾弥天。你立于船首，见将士面有忧色。遂扬声励众，言明今夜只需擂鼓呐喊，不必真个厮杀。曹贼生性多疑，雾中必不敢轻出。待得功成，人人有赏。众军闻言，渐觉心安。"
  },
  
  dialogue_event7: {
    id: "dialogue_event7",
    type: "dialogue_event",
    chapter: 3,
    title: "周瑜认输",
    content: "但见船船箭支如林，军士搬运不绝。有司清点，共得箭十万三千有余。公瑾面色数变，强颜笑道：'先生真神人也！瑜不及远矣！'"
  },
  
  // 抉择事件
  choice_event1: {
    id: "choice_event1",
    type: "choice_event",
    chapter: 1,
    title: "应对挑衅",
    description: "面对周瑜的刁难，你如何应对？",
    options: {
      A: {
        text: "慨然应诺：'三日足矣，亮愿立军令状。'",
        consequences: [
          { type: "trigger", value: "startCountdown", description: "开启三日倒计时" }
        ]
      },
      B: {
        text: "推辞婉拒：'此事重大，容亮思虑。'",
        consequences: [
          { type: "result", value: "failureEnding", description: "直接触发失败结局" }
        ],
        additionalText: "公瑾拍案而起，厉声道：'先生莫非轻视东吴？既无良策，何必在此空谈！'众将肃然，气氛凝重。你的推辞彻底激怒了周瑜，被当场逐出军议。"
      }
    }
  },
  
  choice_event2: {
    id: "choice_event2",
    type: "choice_event",
    chapter: 2,
    title: "应对甘宁",
    description: "甘宁冷笑：'准备船只作甚？莫非要临阵脱逃？'",
    options: {
      A: {
        text: "虚言掩饰：'训练水军阵法。'",
        consequences: [
          { type: "trigger", value: "checkEvent2", description: "引发检定事件2" }
        ]
      },
      B: {
        text: "反客为主：'甘将军为何如此关心？'",
        consequences: [
          { type: "change", target: "ganNing.alertness", value: 15, description: "甘宁机警值+15" },
          { type: "condition", check: {
            type: "comparison",
            left: "zhugeLiang.intelligence",
            operator: ">",
            right: "ganNing.intelligence + 10"
          }, result: "ganNingRetreat", description: "若你智谋值>甘宁智谋值+10：甘宁退去" },
          { type: "condition", check: {
            type: "comparison",
            left: "zhugeLiang.intelligence",
            operator: "<=",
            right: "ganNing.intelligence + 10"
          }, result: "ganNingThreat", description: "否则：触发甘宁武力威胁事件" }
        ]
      }
    }
  },
  
  choice_event3: {
    id: "choice_event3",
    type: "choice_event",
    chapter: 3,
    title: "突破封锁",
    description: "巡江将领：'都督有令，夜间不得出江！'",
    options: {
      A: {
        text: "出示兵符：'奉鲁肃将军之命。'",
        requirements: ["item:dongwuTiger"],
        consequences: [
          { type: "success", description: "成功通过，无损失" }
        ],
        failureConsequences: [
          { type: "change", target: "zhouYu.suspicion", value: 20, description: "周瑜猜忌值+20" },
          { type: "risk", value: "detention", description: "可能被扣留" }
        ],
        successText: "巡江将领验看虎符，恭敬行礼：'原来是子敬将军安排，末将这就放行。'船队顺利通过。",
        failureText: "你摸索半天，竟无虎符。巡江将领疑心大起：'无凭无据，焉能放行？来人，扣下此船！'"
      },
      B: {
        text: "强闯：'军情紧急，后果我担！'",
        consequences: [
          { type: "trigger", value: "combat", description: "触发武力冲突" },
          { type: "loss", value: "ships", amount: 2, description: "损失2艘船" },
          { type: "change", target: "soldierMorale", value: -15, description: "士兵士气-15" }
        ],
        resultText: "你当机立断：'军情如火，延误战机罪责谁担？'强行突围。巡江军仓促应战，你损失两艘船，士兵士气下降，但终究冲出封锁。"
      }
    }
  },
  
  choice_event4: {
    id: "choice_event4",
    type: "choice_event",
    chapter: 3,
    title: "最后危机",
    description: "追兵将至，船因载箭过重行动缓慢",
    options: {
      A: {
        text: "抛弃部分箭支加速",
        consequences: [
          { type: "change", target: "arrows", value: -20000, description: "箭支数量-20000" },
          { type: "success", description: "成功逃脱" },
          { type: "change", target: "soldierMorale", value: -10, description: "士兵士气-10" }
        ],
        resultText: "你忍痛下令：'抛箭保命！'士兵们将部分箭支推入江中，船速立时加快。虽有损失，总算保全性命。"
      },
      B: {
        text: "使用顺风符",
        requirements: ["item:windTalisman"],
        consequences: [
          { type: "maintainArrows", description: "箭支数量不变" }
        ],
        resultText: "你取出顺风符，高声诵念。忽然江风大作，助船疾行。曹军追之不及，只能望江兴叹。"
      }
    }
  },
  
  // 检定事件
  check_event1: {
    id: "check_event1",
    type: "check_event",
    chapter: 1,
    title: "说服鲁肃",
    description: "夜深人静，子敬悄然来访。烛光摇曳间，故人相对而坐。你需巧言说服，方得其助。",
    checkType: "eloquence",
    baseSuccessRate: 60,
    formula: "60 + (character.eloquence-60) + item.eloquenceCheckBonus - event.difficulty",
    additionalCondition: {
      type: "comparison",
      left: "luSu.trust",
      operator: ">=",
      right: 80
    },
    successEffects: [
      { type: "change", target: "luSu.trust", value: 20, description: "鲁肃信任值 +20" },
      { type: "gainItem", value: "dongwuTiger", description: "获得道具【东吴虎符】" }
    ],
    successText: "子敬听罢，沉吟良久，终于下定决心。他从怀中取出一枚虎符，郑重交与你手：'此乃调兵虎符，先生持此可调船只。但切记，此事万不可让公瑾知晓。'",
    failureEffects: [
      { type: "change", target: "luSu.trust", value: -10, description: "鲁肃信任值 -10" },
      { type: "requirement", value: "item:xuanDeBrush", description: "需要使用道具（玄德亲笔）" }
    ],
    failureText: "子敬面露难色：'先生之事，肃定当相助。容我明日再做安排。'言罢匆匆离去。"
  },
  
  check_event2: {
    id: "check_event2",
    type: "check_event",
    chapter: 2,
    title: "智谋对决",
    description: "甘将军目光如炬，疑窦丛生。你需以智谋相抗，瞒天过海。",
    checkType: "intelligence",
    baseSuccessRate: 60,
    formula: "60 + (character.intelligence-60) + item.intelligenceCheckBonus - event.difficulty",
    additionalCondition: {
      type: "formula",
      expression: "character.intelligence - ganNing.alertness >= 20"
    },
    successEffects: [
      { type: "result", value: "ganNingMisled", description: "甘宁被成功误导" },

      { type: "continue", description: "可继续准备工作" }
    ],
    successText: "甘宁虽有疑虑，但无实据，只得悻悻而去。临行前，其亲兵悄悄塞给你一包香料，低声道：'将军虽严，亦知先生非常人，此物或有用处。'",
    conditionalReward: {
      condition: {
        type: "comparison",
        left: "ganNing.alertness",
        operator: "<",
        right: 65
      },
      reward: { type: "gainItem", value: "confusionIncense", description: "获得道具【迷魂香】" }
    },
    failureEffects: [
      { type: "ending", value: "failure", description: "给出【失败结局】" }
    ]
  },
  
  check_event3: {
    id: "check_event3",
    type: "check_event",
    chapter: 2,
    title: "夜间准备",
    description: "月黑风高，正宜行事。你需暗中调度，不露行迹。",
    checkType: "intelligence",
    baseSuccessRate: 60,
    formula: "60 + (character.intelligence-60) + item.intelligenceCheckBonus - event.difficulty",
    additionalCondition: {
      type: "formula",
      expression: "character.intelligence + character.stamina/2 >= 80"
    },
    successEffects: [
      { type: "change", target: "preparationProgress", value: 60, description: "准备进度 +60" },
      { type: "gainItem", value: "grassman", description: "获得道具【草人】" },
      { type: "change", target: "stamina", value: -20, description: "体力值 -20" }
    ],
    failureEffects: [
      { type: "change", target: "preparationProgress", value: 30, description: "准备进度 +30" },

      { type: "change", target: "stamina", value: -30, description: "体力值 -30" },
      { type: "risk", value: "ganNingNightCheck", description: "可能触发甘宁夜查事件" }
    ]
  },
  
  check_event4: {
    id: "check_event4",
    type: "check_event",
    chapter: 3,
    title: "擂鼓借箭",
    description: "雾锁长江，万籁俱寂。你需审时度势，引箭入彀。",
    checkType: "intelligence",
    baseSuccessRate: 60,
    formula: "60 + (character.intelligence-60) + item.intelligenceCheckBonus - environment.difficulty",
    environmentFactors: {
      noGrassman: -30,
      lowMorale: -10,
      highDanger: -10
    },
    itemBonuses: {
      warDrum: { intelligenceCheckBonus: 15 },
      grassman: { intelligenceCheckBonus: 30 }
    },
    results: {
      greatSuccess: {
        condition: {
          type: "comparison",
          left: "successRate",
          operator: ">",
          right: 90
        },
        effects: [
          { type: "set", target: "arrows", value: 120000, description: "箭支数量：120000支" },
          { type: "change", target: "soldierMorale", value: 20, description: "士兵士气+20" },
          { type: "change", target: "dangerLevel", value: 20, description: "危险等级+20" },
          { type: "gainItem", value: "windTalisman", description: "获得道具【顺风符】（士兵献上）" }
        ]
      },
      success: {
        condition: {
          type: "checkResult",
          value: "passed"
        },
        effects: [
          { type: "set", target: "arrows", value: 100000, description: "箭支数量：100000支" },
          { type: "change", target: "soldierMorale", value: 10, description: "士兵士气+10" },
          { type: "change", target: "dangerLevel", value: 30, description: "危险等级+30" }
        ]
      },
      failure: {
        condition: {
          type: "checkResult",
          value: "failed"
        },
        effects: [
          { type: "set", target: "arrows", value: 70000, description: "箭支数量：70000支" },
          { type: "change", target: "soldierMorale", value: -10, description: "士兵士气-10" },
          { type: "change", target: "dangerLevel", value: 50, description: "危险等级+50" }
        ]
      },
      greatFailure: {
        condition: {
          type: "comparison",
          left: "successRate",
          operator: "<",
          right: 20
        },
        effects: [
          { type: "set", target: "arrows", value: 40000, description: "箭支数量：40000支" },
          { type: "change", target: "soldierMorale", value: -30, description: "士兵士气-30" },
          { type: "change", target: "dangerLevel", value: 70, description: "危险等级+70" }
        ]
      }
    }
  },
  
  check_event5: {
    id: "check_event5",
    type: "check_event",
    chapter: 3,
    title: "紧急撤退",
    description: "天将破晓，雾渐消散。你需当机立断，全身而退。",
    checkType: "intelligence",
    baseSuccessRate: 60,
    formula: "60 + (character.intelligence-60) + item.intelligenceCheckBonus - event.difficulty",
    additionalCondition: {
      type: "formula",
      expression: "character.intelligence + soldierMorale/2 >= 100"
    },
    successEffects: [
      { type: "result", value: "safeRetreat", description: "安全撤离，无损失" },
      { type: "maintainArrows", description: "箭支数量不变" },
      { type: "change", target: "soldierMorale", value: 20, description: "士兵士气 +20" }
    ],
    failureEffects: [
      { type: "change", target: "arrows", value: -15000, description: "箭支数量 -15000" },
      { type: "change", target: "soldierMorale", value: -30, description: "士兵士气 -30" }
    ]
  },
  
  // 突发事件
  emergency_event1: {
    id: "emergency_event1",
    type: "emergency_event",
    chapter: 2,
    title: "甘宁夜查",
    description: "三更时分，甘宁率兵突至。火把照如白昼，将你等围在当中。'深夜至此，所为何事？'甘宁目光如电，手按剑柄。",
    triggerCondition: {
      type: "and",
      conditions: [
        { type: "eventResult", value: "nightPreparationFailed" },
        { type: "comparison", left: "timeProgress", operator: ">=", right: 2 }
      ]
    },
    immediateCheck: {
      type: "intelligence",
      difficulty: 80,
      failureResult: "planExposed"
    }
  }
};

// 道具数据
const items = {
  // 增益道具
  kongMingFan: {
    id: "kongMingFan",
    name: "孔明羽扇",
    effect: {
      type: "checkBonus",
      target: "eloquence",
      value: 10
    },
    usage: {
      timing: "beforeCheck",
      description: "任何口才检定时可选择使用"
    },
    triggerCondition: "初始携带"
  },
  
  xuanDeBrush: {
    id: "xuanDeBrush",
    name: "玄德亲笔",
    effect: {
      type: "attributeChange",
      target: "luSu.trust",
      value: 30
    },
    usage: {
      timing: "duringEvent",
      description: "第一章与鲁肃对话时可选择出示"
    },
    triggerCondition: "初始携带"
  },
  
  militaryOrder: {
    id: "militaryOrder",
    name: "军令状",
    effect: {
      type: "special",
      target: "plotItem",
      value: true
    },
    usage: {
      timing: "duringEvent",
      description: "无需使用，仅作剧情道具"
    },
    triggerCondition: "第一章对话事件2后获得"
  },
  
  dongwuTiger: {
    id: "dongwuTiger",
    name: "东吴虎符",
    effect: {
      type: "special",
      target: "passagePermission",
      value: true
    },
    usage: {
      timing: "duringEvent",
      description: "第三章遇巡江时可选择出示"
    },
    triggerCondition: "check_event1成功后获得"
  },
  
  sima: {
    id: "sima",
    name: "司南",
    effect: {
      type: "checkBonus",
      target: "intelligence",
      value: 20
    },
    usage: {
      timing: "beforeCheck",
      description: "任何智谋检定时可选择使用"
    },
    triggerCondition: "dialogue_event4触发后获得"
  },
  
  grassman: {
    id: "grassman",
    name: "草人",
    effect: {
      type: "multiple",
      effects: [
        { type: "checkBonus", target: "intelligence", value: 30 },
        { type: "special", target: "arrowEfficiencyMultiplier", value: 2 }
      ]
    },
    usage: {
      timing: "duringEvent",
      description: "借箭相关检定时自动生效"
    },
    triggerCondition: "check_event3成功后获得"
  },
  
  warDrum: {
    id: "warDrum",
    name: "战鼓",
    effect: {
      type: "multiple",
      effects: [
        { type: "checkBonus", target: "intelligence", value: 15 },
        { type: "special", target: "arrowEfficiencyMultiplier", value: 1.5 }
      ]
    },
    usage: {
      timing: "beforeCheck",
      description: "借箭相关检定时可选择使用"
    },
    triggerCondition: "preparationProgress >= 80时获得"
  },
  
  confusionIncense: {
    id: "confusionIncense",
    name: "迷魂香",
    effect: {
      type: "special",
      target: "ganNingNightCheckAutoSuccess",
      value: true
    },
    usage: {
      timing: "duringEvent",
      description: "第二章甘宁夜查事件时可选择使用"
    },
    triggerCondition: "check_event2成功且ganNing.alertness < 65时获得"
  },
  
  windTalisman: {
    id: "windTalisman",
    name: "顺风符",
    effect: {
      type: "multiple",
      effects: [
        { type: "checkBonus", target: "intelligence", value: 25 },
        { type: "special", target: "retreatAutoSuccess", value: true }
      ]
    },
    usage: {
      timing: "beforeCheck",
      description: "撤退相关检定时可选择使用"
    },
    triggerCondition: "check_event4大成功时获得"
  },
  
  luSuLetter: {
    id: "luSuLetter",
    name: "鲁肃举荐信",
    effect: {
      type: "attributeChange",
      target: "zhouYu.suspicion",
      value: -30
    },
    usage: {
      timing: "duringEvent",
      description: "第二章任意时刻可选择使用降低猜忌值"
    },
    triggerCondition: "特定条件下获得"
  }
};

// 检定机制配置
const checkMechanics = {
  baseFormula: "(character.attribute + item.checkBonus - event.difficulty)",
  successCalculation: "Math.random() * 100 < successRate",
  arrowEfficiency: {
    baseRate: 10000, // 支/小时
    modifiers: {
      grassman: { multiplier: 2, description: "草人效果：箭支效率×2" },
      warDrum: { multiplier: 1.5, description: "战鼓效果：箭支效率×1.5" },
      morale: { formula: "soldierMorale/100", description: "士气影响效率" }
    }
  },
  checkBonusTypes: {
    eloquence: "口才检定加成",
    intelligence: "智谋检定加成"
  },
  effectTypes: {
    set: "直接设置数值",
    change: "增减数值",
    gainItem: "获得道具",
    loseItem: "失去道具",
    trigger: "触发事件",
    condition: "条件判断",
    risk: "风险事件"
  },
  shipArrowCapacity: 5000, // 每艘船载箭数量
  retreatDifficultyModifier: {
    highDanger: 20, // 高危险等级增加撤退难度
    lowMorale: 15,  // 低士气增加撤退难度
    heavyLoad: 10   // 重载增加撤退难度
  }
};

// 人物数值变化规则
const reactionRules = {
  // 第一章人物规则
  
  // 周瑜的反应规则
  zhouYu: "【- 玩家谦逊示弱：suspicion -5到-10\n  例如：\"在下才疏学浅\"、\"都督高见\"\n- 玩家显示才能：suspicion +5到+15\n  例如：提及功绩、表现自信\n- 玩家讽刺挑衅：suspicion +15到+25\n  例如：质疑周瑜能力、言语轻慢\n- 玩家推辞任务：suspicion +20到+30\n  例如：拒绝造箭、找借口】",
  
  // 鲁肃的反应规则（第一章）
  luSu: "【- 玩家以大义劝说：trust +5到+10\n  例如：\"抗曹大业\"、\"孙刘联盟\"\n- 玩家展现真诚：trust +10到+15\n  例如：坦诚相告、推心置腹\n- 玩家欺骗威胁：trust -10到-20\n  例如：编造谎言、恐吓威胁\n- 玩家提及刘备：trust +5\n  例如：\"玄德兄托我\"、\"刘皇叔\"】",
  
  // 第二章人物规则
  
  // 甘宁的反应规则
  ganNing: "【- 玩家强硬对抗：alertness +5到+10\n  例如：言语冲突、拒绝配合\n- 玩家巧言应对：alertness -5\n  例如：转移话题、合理解释\n- 玩家露出破绽：alertness +10到+15\n  例如：言语矛盾、紧张慌乱】",
  
  // 鲁肃的反应规则（第二章延续）
  luSuChapter2: "【- 玩家请求帮助：trust +5\n  例如：详细说明需求\n- 玩家表现焦虑：trust -5\n  例如：催促鲁肃、言语急切】"
};

// 章节特殊数值规则
const dialogueRules = {
  // 第一章特殊数值
  chapter1: {
    // 说服进度（仅用于AI判断，不在gameData中）
    persuasionProgress: "【- 每次与鲁肃对话：+5\n- 提及\"曹操大军\"、\"八十万\"：+10\n- 提及\"东吴安危\"、\"江东\"：+15\n- 展示计划\"我有妙计\"、\"三日可成\"：+20\n- 提及\"子敬兄\"、\"故人\"：+10\n- 对话偏离主题：+0\n- 冒犯鲁肃：-10到-20】",
    

  },
  
  // 第二章特殊数值
  chapter2: {
    // preparationProgress（章节变量）
    preparationProgress: "【- 每次准备行动：+5\n- 成功获取物资：+20到+30\n- 鲁肃全力支持：+15到+25\n- 遭遇阻碍：+5或不变\n- 检定事件3成功：+60（固定值）】",
    

  },
  
  // 第三章特殊数值
  chapter3: {
    // arrows（全局变量）
    arrows: "【- 检定事件4结果决定：\n  大成功：设为120000\n  成功：设为100000\n  失败：设为70000\n  大失败：设为40000\n- 抉择事件4选A：-20000\n- 检定事件5失败：-15000】",
    
    // dangerLevel（章节变量）
    dangerLevel: "【- 每次行动基础：+10\n- 遭遇巡逻：+15到+20\n- 擂鼓声过大：+10到+15\n- 曹军起疑：+20到+30\n- 成功规避：+5或不变】",
    
    // soldierMorale（章节变量）
    soldierMorale: "【- 玩家鼓舞（\"必胜\"、\"重赏\"）：+10到+20\n- 看到成效：+15到+25\n- 遭遇危险：-10到-20\n- 损失船只：-15\n- 玩家慌张：-10到-20】",
    
    // shipLoss（章节变量）
    shipLoss: "【- 抉择事件3选B（强闯）：+2\n- 其他损失事件：+1到+3\n- 每损失1艘船，箭支容量-5000】"
  }
};

// 导出所有游戏数据
// 数据验证配置
const dataValidation = {
  requiredFields: {
    character: ['name', 'attributes'],
    item: ['id', 'name', 'effect', 'usage'],
    event: ['id', 'type', 'chapter', 'title'],
    checkEvent: ['checkType', 'baseSuccessRate', 'formula']
  },
  attributeRanges: {
    intelligence: { min: 0, max: 100 },
    eloquence: { min: 0, max: 100 },
    stamina: { min: 0, max: 100 },
    trust: { min: 0, max: 100 },
    suspicion: { min: 0, max: 100 },
    alertness: { min: 0, max: 100 }
  },
  gameStateRanges: {
    timeProgress: { min: 1, max: 3 },
    arrows: { min: 0, max: 120000 },
    preparationProgress: { min: 0, max: 100 },
    dangerLevel: { min: 0, max: 100 },
    soldierMorale: { min: 0, max: 100 },
    shipLoss: { min: 0, max: 20 }
  }
};

export {
  globalState,
  dataTypes,
  characters,
  chapters,
  events,
  items,
  checkMechanics,
  dataValidation,
  reactionRules,
  dialogueRules
};

// 默认导出
export default {
  globalState,
  dataTypes,
  characters,
  chapters,
  events,
  items,
  checkMechanics,
  dataValidation,
  reactionRules,
  dialogueRules
};