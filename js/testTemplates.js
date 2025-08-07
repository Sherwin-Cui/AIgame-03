// 草船借箭 - 测试模板文件
// 包含所有事件和道具的完整测试JSON模板

// 提供测试用的JSON模板
window.getTestTemplates = function() {
    return {
        // ==================== 对话事件测试 ====================
        
        dialogue_event2: `{
            "narrative": "你提笔濡墨，从容书名，印上朱泥。军令状立下，三日为期。",
            "npc_dialogue": {
                "speaker": "周瑜",
                "content": "好！既然先生如此自信，那就请立下军令状吧！"
            },
            "special_progress": {
                "event_triggered": true,
                "event_id": "dialogue_event2",
                "event_type": "dialogue_event",
                "event_title": "立下军令",
                "event_description": "公瑾闻言，佯作惊诧，实则心中窃喜。即令左右取军令状来，白绢黑字，森然可畏。其上写明：限三日内交箭十万，如违期限，甘当军法。你提笔濡墨，从容书名，印上朱泥。公瑾收起军令，与你约定三日为期。"
            },
            "event_suggestion": {
                "should_trigger": false,
                "event_id": null,
                "reason": "当前对话事件已完成"
            },
            "item_grant": {
                "should_grant": true,
                "item_id": "militaryOrder",
                "condition_met": "立下军令状的条件已满足"
            }
        }`,
        
        dialogue_event3: `{
            "narrative": "你微微一笑，向鲁肃详细说明了所需物资。",
            "npc_dialogue": {
                "speaker": "鲁肃",
                "content": "先生所需，肃定当全力相助。但此事须得保密。"
            },
            "special_progress": {
                "event_triggered": true,
                "event_id": "dialogue_event3",
                "event_type": "dialogue_event",
                "event_title": "索要物资",
                "event_description": "你微微一笑：'子敬勿忧。烦请为亮备快船二十艘，每船用军士三十人，船皆用青布为幔，各束草千余个，分布两厢。吾别有妙用。'子敬愕然：'莫非先生欲往曹营劫寨？'你摇首不语，只道：'但依此行，勿令公瑾得知。'"
            },
            "event_suggestion": {
                "should_trigger": false,
                "event_id": null,
                "reason": "当前对话事件已完成"
            },
            "item_grant": {
                "should_grant": false,
                "item_id": null,
                "condition_met": null
            },
            "value_changes": {
                "preparationProgress": 20
            }
        }`,
        
        dialogue_event4: `{
            "narrative": "高台之上，夜风料峭。你仰望苍穹，心中暗自推算。",
            "npc_dialogue": {
                "speaker": "诸葛亮",
                "content": "善哉！善哉！三日后长江之上必有大雾，此正天助我也！"
            },
            "autoEvents": [{
                "id": "dialogue_event4",
                "type": "dialogue_event",
                "title": "天机预测",
                "content": "高台之上，夜风料峭。你负手而立，仰望苍穹。但见箕星东指，毕星西垂，心中暗自推算。忽而抚掌而笑：'善哉！善哉！'原来你夜观天象，已知三日后长江之上必有大雾。此正天助我也！"
            }],
            "items": [{
                "id": "sima",
                "name": "司南",
                "gained": true,
                "description": "观星所得的神秘司南，可提升智谋检定"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "sima",
                "itemName": "司南",
                "description": "观星所得的神秘司南，可提升智谋检定"
            }]
        }`,
        
        dialogue_event5: `{
            "narrative": "子时已至，大雾弥天。你立于船首，见将士面有忧色。",
            "npc_dialogue": {
                "speaker": "诸葛亮",
                "content": "诸位将士，今夜只需擂鼓呐喊，不必真个厮杀。待得功成，人人有赏！"
            },
            "autoEvents": [{
                "id": "dialogue_event5",
                "type": "dialogue_event",
                "title": "出发前动员",
                "content": "子时已至，大雾弥天。你立于船首，见将士面有忧色。遂扬声励众，言明今夜只需擂鼓呐喊，不必真个厮杀。曹贼生性多疑，雾中必不敢轻出。待得功成，人人有赏。众军闻言，渐觉心安。"
            }],
            "value_changes": {
                "soldierMorale": 15
            }
        }`,
        
        dialogue_event7: `{
            "narrative": "但见船船箭支如林，军士搬运不绝。有司清点，共得箭十万三千有余。",
            "npc_dialogue": {
                "speaker": "周瑜",
                "content": "先生真神人也！瑜不及远矣！"
            },
            "autoEvents": [{
                "id": "dialogue_event7",
                "type": "dialogue_event",
                "title": "周瑜认输",
                "content": "但见船船箭支如林，军士搬运不绝。有司清点，共得箭十万三千有余。公瑾面色数变，强颜笑道：'先生真神人也！瑜不及远矣！'"
            }],
            "chapterEnd": {
                "success": true,
                "ending": "perfect",
                "title": "神机妙算"
            }
        }`,
        
        // ==================== 检定事件测试 ====================
        
        check_event1_success: `{
            "narrative": "你的话语打动了鲁肃，他深深点头。",
            "npc_dialogue": {
                "speaker": "鲁肃",
                "content": "先生所言极是，这东吴虎符就交给先生了。"
            },
            "autoEvents": [{
                "id": "check_event1",
                "type": "check_event",
                "title": "说服鲁肃",
                "result": "success",
                "description": "检定成功！鲁肃被你的诚意打动。"
            }],
            "items": [{
                "id": "dongwuTiger",
                "name": "东吴虎符",
                "gained": true,
                "description": "鲁肃交付的东吴虎符，可用于通行"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "dongwuTiger",
                "itemName": "东吴虎符",
                "description": "鲁肃交付的东吴虎符，可用于通行"
            }],
            "value_changes": {
                "luSu.trust": 20
            }
        }`,
        
        check_event1_failure: `{
            "narrative": "鲁肃面露难色，似有顾虑。",
            "npc_dialogue": {
                "speaker": "鲁肃",
                "content": "先生之事，肃定当相助。容我明日再做安排。"
            },
            "autoEvents": [{
                "id": "check_event1",
                "type": "check_event",
                "title": "说服鲁肃",
                "result": "failure",
                "description": "检定失败！需要使用玄德亲笔增加说服力。"
            }],
            "value_changes": {
                "luSu.trust": -10
            }
        }`,
        
        check_event2_success: `{
            "narrative": "你巧妙地化解了甘宁的质疑，他狐疑地看了你一眼。",
            "npc_dialogue": {
                "speaker": "甘宁",
                "content": "哼，希望先生真的只是训练水军。"
            },
            "autoEvents": [{
                "id": "check_event2",
                "type": "check_event",
                "title": "智谋对决",
                "result": "success",
                "description": "检定成功！你成功化解了甘宁的怀疑。"
            }],
            "items": [{
                "id": "confusionIncense",
                "name": "迷魂香",
                "gained": true,
                "description": "甘宁亲兵暗中赠送的迷魂香"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "confusionIncense",
                "itemName": "迷魂香",
                "description": "甘宁亲兵暗中赠送的迷魂香"
            }],
            "value_changes": {
                "ganNing.alertness": -10
            }
        }`,
        
        check_event2_failure: `{
            "narrative": "甘宁目光如炬，显然不信你的说辞。",
            "npc_dialogue": {
                "speaker": "甘宁",
                "content": "诸葛亮，你当我是三岁孩童？说！你到底在谋划什么！"
            },
            "autoEvents": [{
                "id": "check_event2",
                "type": "check_event",
                "title": "智谋对决",
                "result": "failure",
                "description": "检定失败！甘宁识破了你的计划。"
            }],
            "chapterEnd": {
                "success": false,
                "ending": "failure",
                "title": "计划败露"
            }
        }`,
        
        check_event3_success: `{
            "narrative": "夜色掩护下，你成功准备了所需的草人。",
            "autoEvents": [{
                "id": "check_event3",
                "type": "check_event",
                "title": "夜间准备",
                "result": "success",
                "description": "检定成功！草人准备完毕。"
            }],
            "items": [{
                "id": "grassman",
                "name": "草人",
                "gained": true,
                "description": "精心制作的草人，借箭时的关键道具"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "grassman",
                "itemName": "草人",
                "description": "精心制作的草人，借箭时的关键道具"
            }],
            "value_changes": {
                "preparationProgress": 60,
                "zhugeLiang.stamina": -20
            }
        }`,
        
        check_event3_failure: `{
            "narrative": "准备工作进展不顺，只能勉强完成部分。",
            "autoEvents": [{
                "id": "check_event3",
                "type": "check_event",
                "title": "夜间准备",
                "result": "failure",
                "description": "检定失败！准备不充分，可能引起甘宁注意。"
            }],
            "value_changes": {
                "preparationProgress": 30,
                "zhugeLiang.stamina": -30
            }
        }`,
        
        check_event4_success: `{
            "narrative": "擂鼓声震天，曹军万箭齐发！你的计策成功了！",
            "autoEvents": [{
                "id": "check_event4",
                "type": "check_event",
                "title": "擂鼓借箭",
                "result": "success",
                "description": "检定成功！成功借得十万支箭！"
            }],
            "value_changes": {
                "arrows": 100000,
                "soldierMorale": 10,
                "dangerLevel": 30
            }
        }`,
        
        check_event4_great_success: `{
            "narrative": "擂鼓声震天，曹军万箭齐发！你的计策大获成功！",
            "autoEvents": [{
                "id": "check_event4",
                "type": "check_event",
                "title": "擂鼓借箭",
                "result": "great_success",
                "description": "大成功！借箭效果超出预期！"
            }],
            "items": [{
                "id": "windTalisman",
                "name": "顺风符",
                "gained": true,
                "description": "天助神威，获得顺风符"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "windTalisman",
                "itemName": "顺风符",
                "description": "天助神威，获得顺风符"
            }],
            "value_changes": {
                "arrows": 120000,
                "soldierMorale": 20,
                "dangerLevel": 20
            }
        }`,
        
        check_event4_failure: `{
            "narrative": "擂鼓声起，但曹军反应谨慎，箭支不多。",
            "autoEvents": [{
                "id": "check_event4",
                "type": "check_event",
                "title": "擂鼓借箭",
                "result": "failure",
                "description": "检定失败！借箭效果不佳。"
            }],
            "value_changes": {
                "arrows": 70000,
                "soldierMorale": -10,
                "dangerLevel": 50
            }
        }`,
        
        check_event4_great_failure: `{
            "narrative": "计划出现重大失误，曹军起疑，箭支寥寥。",
            "autoEvents": [{
                "id": "check_event4",
                "type": "check_event",
                "title": "擂鼓借箭",
                "result": "great_failure",
                "description": "大失败！计划几乎失败！"
            }],
            "value_changes": {
                "arrows": 40000,
                "soldierMorale": -30,
                "dangerLevel": 70
            }
        }`,
        
        check_event5_success: `{
            "narrative": "你当机立断，指挥船队安全撤离。",
            "autoEvents": [{
                "id": "check_event5",
                "type": "check_event",
                "title": "紧急撤退",
                "result": "success",
                "description": "检定成功！安全撤离，无损失。"
            }],
            "value_changes": {
                "soldierMorale": 20
            }
        }`,
        
        check_event5_failure: `{
            "narrative": "撤退过程中遭遇追击，损失惨重。",
            "autoEvents": [{
                "id": "check_event5",
                "type": "check_event",
                "title": "紧急撤退",
                "result": "failure",
                "description": "检定失败！撤退时遭受损失。"
            }],
            "value_changes": {
                "arrows": -15000,
                "soldierMorale": -30
            }
        }`,
        
        // ==================== 抉择事件测试 ====================
        
        choice_event1: `{
            "narrative": "面对周瑜的刁难，你需要做出选择。",
            "autoEvents": [{
                "id": "choice_event1",
                "type": "choice_event",
                "title": "应对挑衅",
                "description": "面对周瑜的刁难，你如何应对？",
                "options": {
                    "A": {
                        "text": "慨然应诺：'三日足矣，亮愿立军令状。'",
                        "consequences": [{
                            "type": "trigger",
                            "value": "startCountdown",
                            "description": "开启三日倒计时"
                        }]
                    },
                    "B": {
                        "text": "推辞婉拒：'此事重大，容亮思虑。'",
                        "consequences": [{
                            "type": "result",
                            "value": "failureEnding",
                            "description": "直接触发失败结局"
                        }]
                    }
                }
            }]
        }`,
        
        choice_event2: `{
            "narrative": "甘宁冷笑：'准备船只作甚？莫非要临阵脱逃？'",
            "autoEvents": [{
                "id": "choice_event2",
                "type": "choice_event",
                "title": "应对甘宁",
                "description": "甘宁冷笑：'准备船只作甚？莫非要临阵脱逃？'",
                "options": {
                    "A": {
                        "text": "虚言掩饰：'训练水军阵法。'",
                        "consequences": [{
                            "type": "trigger",
                            "value": "checkEvent2",
                            "description": "引发检定事件2"
                        }]
                    },
                    "B": {
                        "text": "反客为主：'甘将军为何如此关心？'",
                        "consequences": [{
                            "type": "change",
                            "target": "ganNing.alertness",
                            "value": 15,
                            "description": "甘宁机警值+15"
                        }]
                    }
                }
            }]
        }`,
        
        choice_event3_with_tiger: `{
            "narrative": "巡江将领：'都督有令，夜间不得出江！'",
            "autoEvents": [{
                "id": "choice_event3",
                "type": "choice_event",
                "title": "突破封锁",
                "description": "巡江将领：'都督有令，夜间不得出江！'",
                "options": {
                    "A": {
                        "text": "出示兵符：'奉鲁肃将军之命。'",
                        "requirements": ["item:dongwuTiger"],
                        "consequences": [{
                            "type": "success",
                            "description": "成功通过，无损失"
                        }]
                    },
                    "B": {
                        "text": "强闯：'军情紧急，后果我担！'",
                        "consequences": [{
                            "type": "loss",
                            "value": "ships",
                            "amount": 2,
                            "description": "损失2艘船"
                        }]
                    }
                }
            }]
        }`,
        
        choice_event3_without_tiger: `{
            "narrative": "你摸索半天，竟无虎符。巡江将领疑心大起。",
            "npc_dialogue": {
                "speaker": "巡江将领",
                "content": "无凭无据，焉能放行？来人，扣下此船！"
            },
            "autoEvents": [{
                "id": "choice_event3",
                "type": "choice_event",
                "title": "突破封锁",
                "result": "failure",
                "description": "没有虎符，被巡江军阻拦。"
            }],
            "value_changes": {
                "zhouYu.suspicion": 20
            }
        }`,
        
        choice_event4_with_wind: `{
            "narrative": "追兵将至，船因载箭过重行动缓慢。",
            "autoEvents": [{
                "id": "choice_event4",
                "type": "choice_event",
                "title": "最后危机",
                "description": "追兵将至，船因载箭过重行动缓慢",
                "options": {
                    "A": {
                        "text": "抛弃部分箭支加速",
                        "consequences": [{
                            "type": "change",
                            "target": "arrows",
                            "value": -20000,
                            "description": "箭支数量-20000"
                        }]
                    },
                    "B": {
                        "text": "使用顺风符",
                        "requirements": ["item:windTalisman"],
                        "consequences": [{
                            "type": "maintainArrows",
                            "description": "箭支数量不变"
                        }]
                    }
                }
            }]
        }`,
        
        // ==================== 突发事件测试 ====================
        
        emergency_event1: `{
            "narrative": "三更时分，甘宁率兵突至。火把照如白昼，将你等围在当中。",
            "npc_dialogue": {
                "speaker": "甘宁",
                "content": "深夜至此，所为何事？"
            },
            "autoEvents": [{
                "id": "emergency_event1",
                "type": "emergency_event",
                "title": "甘宁夜查",
                "description": "甘宁突然夜查，需要紧急应对。"
            }]
        }`,
        
        // ==================== 道具触发测试 ====================
        
        // 初始携带道具
        initial_items: `{
            "narrative": "你整理随身物品，确认携带的道具。",
            "items": [{
                "id": "kongMingFan",
                "name": "孔明羽扇",
                "gained": true,
                "description": "你的标志性羽扇，可提升口才检定"
            }, {
                "id": "xuanDeBrush",
                "name": "玄德亲笔",
                "gained": true,
                "description": "刘备的亲笔信，可增加鲁肃信任"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "kongMingFan",
                "itemName": "孔明羽扇",
                "description": "你的标志性羽扇，可提升口才检定"
            }, {
                "type": "item_gained",
                "itemId": "xuanDeBrush",
                "itemName": "玄德亲笔",
                "description": "刘备的亲笔信，可增加鲁肃信任"
            }]
        }`,
        
        // 条件触发道具
        conditional_war_drum: `{
            "narrative": "准备工作进展顺利，你获得了额外的战鼓。",
            "items": [{
                "id": "warDrum",
                "name": "战鼓",
                "gained": true,
                "description": "用于借箭的战鼓，可提升借箭效率"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "warDrum",
                "itemName": "战鼓",
                "description": "用于借箭的战鼓，可提升借箭效率"
            }]
        }`,
        
        conditional_lusu_letter: `{
            "narrative": "鲁肃见你筹划有方，写下举荐信以备不时之需。",
            "items": [{
                "id": "luSuLetter",
                "name": "鲁肃举荐信",
                "gained": true,
                "description": "鲁肃的举荐信，可降低猜忌值"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "luSuLetter",
                "itemName": "鲁肃举荐信",
                "description": "鲁肃的举荐信，可降低猜忌值"
            }]
        }`,
        
        // ==================== 多道具获得测试 ====================
        
        multiple_items: `{
            "narrative": "鲁肃见你筹划有方，不仅交付了虎符，还写下举荐信。",
            "items": [{
                "id": "dongwuTiger",
                "name": "东吴虎符",
                "gained": true,
                "description": "鲁肃交付的东吴虎符"
            }, {
                "id": "luSuLetter",
                "name": "鲁肃举荐信",
                "gained": true,
                "description": "鲁肃的举荐信，可降低猜忌值"
            }],
            "itemNotifications": [{
                "type": "item_gained",
                "itemId": "dongwuTiger",
                "itemName": "东吴虎符",
                "description": "鲁肃交付的东吴虎符"
            }, {
                "type": "item_gained",
                "itemId": "luSuLetter",
                "itemName": "鲁肃举荐信",
                "description": "鲁肃的举荐信，可降低猜忌值"
            }]
        }`,
        
        // ==================== 数值变化测试 ====================
        
        value_changes_comprehensive: `{
            "narrative": "经过一番交涉，各方关系发生了变化。",
            "value_changes": {
                "luSu.trust": 15,
                "zhouYu.suspicion": -10,
                "ganNing.alertness": 5,
                "zhugeLiang.stamina": -10,
                "preparationProgress": 25,
                "soldierMorale": 10
            }
        }`,
        
        // ==================== 章节结束测试 ====================
        // 注意：章节结束和游戏结局的详细文本已迁移到 gameData.js 中
        // 这里保留简化的测试模板用于功能测试
        
        // 第一章结束测试
        chapter1_end_success: `{
            "narrative": "第一章目标达成，获得东吴虎符。",
            "chapterEnd": {
                "success": true,
                "nextChapter": 2
            }
        }`,
        
        chapter1_end_failure: `{
            "narrative": "第一章失败，被逐出东吴。",
            "chapterEnd": {
                "success": false,
                "ending": "failure"
            }
        }`,
        
        // 第二章结束测试
        chapter2_end_success: `{
            "narrative": "第二章目标达成，准备工作完成。",
            "chapterEnd": {
                "success": true,
                "nextChapter": 3
            }
        }`,
        
        chapter2_end_failure: `{
            "narrative": "第二章失败，计划败露。",
            "chapterEnd": {
                "success": false,
                "ending": "failure"
            }
        }`,
        
        // 通用章节结束测试（向后兼容）
        chapter_end_success: `{
            "narrative": "当前章节目标达成。",
            "chapterEnd": {
                "success": true,
                "nextChapter": 2
            }
        }`,
        
        chapter_end_failure: `{
            "narrative": "章节失败。",
            "chapterEnd": {
                "success": false,
                "ending": "failure"
            }
        }`,
        
        // ==================== 游戏结局测试 ====================
        // 注意：详细的结局文本已迁移到 gameData.js 中
        
        ending_perfect: `{
            "narrative": "完美结局测试。",
            "chapterEnd": {
                "success": true,
                "ending": "perfect"
            }
        }`,
        
        ending_success: `{
            "narrative": "成功结局测试。",
            "chapterEnd": {
                "success": true,
                "ending": "success"
            }
        }`,
        
        ending_barely: `{
            "narrative": "险胜结局测试。",
            "chapterEnd": {
                "success": true,
                "ending": "barely"
            }
        }`,
        
        ending_failure: `{
            "narrative": "失败结局测试。",
            "chapterEnd": {
                "success": false,
                "ending": "failure"
            }
        }`
    };
};

// 提供快速测试函数
window.quickTest = function(templateName) {
    const templates = window.getTestTemplates();
    if (templates[templateName]) {
        const textarea = document.getElementById('ai-response');
        if (textarea) {
            textarea.value = templates[templateName];
            // 触发输入事件以便系统识别
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        console.log(`已加载测试模板: ${templateName}`);
    } else {
        console.error(`未找到测试模板: ${templateName}`);
        console.log('可用模板:', Object.keys(templates));
    }
};

// 列出所有可用模板
window.listTestTemplates = function() {
    const templates = window.getTestTemplates();
    console.log('=== 可用测试模板 ===');
    
    const categories = {
        '对话事件': Object.keys(templates).filter(k => k.startsWith('dialogue_')),
        '检定事件': Object.keys(templates).filter(k => k.startsWith('check_')),
        '抉择事件': Object.keys(templates).filter(k => k.startsWith('choice_')),
        '突发事件': Object.keys(templates).filter(k => k.startsWith('emergency_')),
        '道具相关': Object.keys(templates).filter(k => k.includes('item') || k === 'multiple_items'),
        '数值变化': Object.keys(templates).filter(k => k.includes('value')),
        '章节结束': Object.keys(templates).filter(k => k.includes('chapter_end')),
        '游戏结局': Object.keys(templates).filter(k => k.startsWith('ending_')),
        '其他': Object.keys(templates).filter(k => 
            !k.startsWith('dialogue_') && 
            !k.startsWith('check_') && 
            !k.startsWith('choice_') && 
            !k.startsWith('emergency_') && 
            !k.includes('item') && 
            !k.includes('value') && 
            !k.includes('chapter_end') && 
            !k.startsWith('ending_') &&
            k !== 'multiple_items'
        )
    };
    
    Object.entries(categories).forEach(([category, templates]) => {
        if (templates.length > 0) {
            console.log(`\n${category}:`);
            templates.forEach(template => {
                console.log(`  - ${template}`);
            });
        }
    });
    
    console.log('\n使用方法: quickTest("模板名称")');
};

// 自动加载提示
console.log('测试模板已加载！');
console.log('使用 listTestTemplates() 查看所有可用模板');
console.log('使用 quickTest("模板名称") 快速加载测试数据');