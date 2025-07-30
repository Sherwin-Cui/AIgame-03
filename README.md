# AI对话游戏MVP

## 项目结构

```
ai-dialogue-mvp/
├── index.html                 # 主页面
├── css/
│   └── main.css              # 样式文件
├── js/
│   ├── main.js               # 入口文件
│   ├── game/
│   │   ├── GameState.js      # 游戏状态管理
│   │   ├── DialogueSystem.js # 对话系统
│   │   └── InventorySystem.js # 背包系统
│   ├── ai/
│   │   ├── AIService.js      # AI服务接口
│   │   ├── PromptBuilder.js  # 提示词构建
│   │   └── ResponseParser.js # 响应解析
│   ├── ui/
│   │   ├── UIManager.js      # UI管理器
│   │   ├── DialogueUI.js     # 对话界面
│   │   └── StatusUI.js       # 状态栏界面
│   └── config/
│       ├── gameConfig.js     # 游戏配置
│       └── prompts.js        # 提示词模板
└── README.md
```