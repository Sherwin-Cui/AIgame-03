// 游戏配置
const GameConfig = {
    // API配置
    api: {
        key: 'sk-a3592d9ecb894dbfa9436f8f1d1fa42d',
        url: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
    },
    
    // 初始游戏状态
    initialState: {
        playerState: {
            name: "贾诩",
            attributes: {
                "野心": 50,
                "忠诚": 0,
                "智力": 99,
                "武力": 90
            },
            inventory: [
                {
                    itemName: "毒士秘录",
                    description: "贾诩私藏的计谋集，记载各种毒计",
                    quantity: 1
                }
            ]
        },
        npcStates: [
            {
                name: "曹操",
                attributes: {
                    "武力": 86,
                    "疑心": 70,
                    "威望": 95
                }
            },
            {
                name: "司马懿",
                attributes: {
                    "野心": 100,
                    "忠诚": 0,
                    "智力": 97,
                    "伪装": 90
                }
            },
            {
                name: "荀彧",
                attributes: {
                    "忠诚": 100,
                    "智力": 96,
                    "武力": 60,
                    "绝望值": 30
                }
            },
            {
                name: "典韦",
                attributes: {
                    "忠诚": 100,
                    "智力": 13,
                    "武力": 98,
                    "警觉": 60
                }
            }
        ]
    },
    
    // 游戏规则
    rules: {
        maxDialogueHistory: 10,
        winCondition: "成功阻止荀彧服毒自尽",
        failureCondition: "用户的野心达到100，且忠诚≤30，曹操怒斩用户"
    }
};