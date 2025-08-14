# UI边框系统更新文档

## 问题总结

### 1. 主要问题
- ❌ **层级关系混乱**: z-index设置导致边框遮挡内容
- ❌ **头像被边框遮挡**: 人物头像无法显示
- ❌ **背景图片不显示**: 对话区域背景图片路径错误和透明度问题
- ❌ **对话气泡无边框**: 对话内容没有边框显示
- ❌ **容器背景冗余**: 未加边框的容器仍有背景色

### 2. 修复过程中的错误
- **边框z-index设置为正值**: 导致遮挡内容，应设为负值
- **内容z-index设置过低**: 导致被边框遮挡
- **背景图片路径错误**: 使用了错误的图片路径
- **透明度设置不当**: 背景图片透明度过低
- **头像定位问题**: 头像位置被边框padding影响

## 边框和容器样式详细表

### 全局变量定义
```css
:root {
    /* 边框厚度常量 */
    --border-thickness: 16px;     /* 总厚度 */
    --outer-width: 4px;           /* 绿色外框宽度 */
    --inner-offset: 10px;         /* 棕色内线距离边缘 */
    
    /* 配色方案 */
    --border-outer: #2D3A2D;      /* 墨绿色 */
    --border-middle: #E8D4B0;     /* 暖玉色 */
    --border-inner: #B8986B;      /* 棕色 */
    --bg-main: #F5F2E8;           /* 玉白色 */
    --text: #2D3A2D;              /* 文字色 */
}
```

### 边框组件

| 组件类型 | CSS类名 | 应用元素 | 状态 | z-index层级 |
|---------|---------|----------|------|-------------|
| **标准小型边框** | `.small-border` | 人物头像、按钮、对话气泡 | ✅ 已实现 | 外层:-3, 中层:-2, 内层:-1, 内容:10 |
| **边框外层** | `.small-border::before` | 墨绿色外框 | ✅ 已实现 | z-index: -3 |
| **边框中层** | `.small-border::after` | 暖玉色填充 | ✅ 已实现 | z-index: -2 |
| **边框内层** | `.border-inner` | 棕色装饰线 | ✅ 已实现 | z-index: -1 |
| **边框内容** | `.border-content` | 内容容器 | ✅ 已实现 | z-index: 10 |

### 容器背景设置

| 容器名称 | CSS类名 | 背景设置 | 状态 | 说明 |
|---------|---------|----------|------|------|
| **游戏主容器** | `.game-container` | `#D4C4A8` | ✅ 保留 | 整体背景色 |
| **标题栏** | `.title-bar` | 横幅图片 | ✅ 已设置 | `assets/images/tank/titlebg.png` |
| **状态栏** | `.status-bar` | `transparent` | ✅ 透明 | 显示底层背景 |
| **人物栏** | `.character-bar` | `transparent` | ✅ 透明 | 显示底层背景 |
| **对话窗口** | `.dialogue-window` | 古典纹理 | ✅ 已设置 | `assets/images/bg/dialogue_bg01.png` |
| **输入框区域** | `.input-area` | `transparent` | ✅ 透明 | 显示底层背景 |
| **按钮栏** | `.button-bar` | `transparent` | ✅ 透明 | 显示底层背景 |
| **模态窗口** | `.modal` | `transparent` | ✅ 透明 | 显示底层背景 |
| **输入框** | `.input-field` | `transparent` | ✅ 透明 | 只保留边框 |

### 具体元素实现

#### 1. 人物头像
```css
/* HTML结构 */
<div class="character-slot small-border">
    <div class="border-inner"></div>
    <div class="border-content">
        <div class="character-avatar"></div>
    </div>
    <span class="character-name">角色名</span>
</div>

/* 关键样式 */
.character-avatar {
    width: calc(100% - 32px);
    height: calc(100% - 32px);
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 15;
}
```
**状态**: ✅ 已修复，头像正确显示在边框内

#### 2. 对话气泡
```css
/* HTML结构 */
<div class="dialogue-bubble small-border">
    <div class="border-inner"></div>
    <div class="border-content">
        <div class="bubble-content">对话内容</div>
    </div>
</div>

/* 关键样式 */
.dialogue-bubble {
    max-width: 75%;
    margin: 8px;
    z-index: 5;
}
```
**状态**: ✅ 已实现，统一NPC和旁白样式

#### 3. 按钮
```css
/* HTML结构 */
<button class="pixel-btn small-border">
    <div class="border-inner"></div>
    <span class="border-content">按钮文字</span>
</button>

/* 关键样式 */
.pixel-btn {
    background: transparent;
    border: none;
    color: var(--text);
}
```
**状态**: ✅ 已实现

### 层级管理规范

| 层级范围 | 用途 | z-index值 |
|---------|------|-----------|
| **背景层** | 背景图片、底层装饰 | -10 ~ -5 |
| **边框层** | 边框伪元素 | -3 ~ -1 |
| **内容层** | 可交互内容 | 1 ~ 20 |
| **覆盖层** | 模态窗口、弹窗 | 100+ |

### 当前实现状态

#### ✅ 已完成
- [x] 全局边框变量定义
- [x] 标准小型边框组件
- [x] 人物头像边框和显示
- [x] 按钮边框样式
- [x] 对话气泡边框
- [x] 背景图片正确显示
- [x] 层级关系修复
- [x] 容器背景透明化

#### 📝 需要注意的点
1. **层级管理**: 边框必须使用负z-index，内容使用正z-index
2. **定位关系**: 头像等内容需要相对边框内边距进行定位
3. **背景透明**: 未加边框的容器保持透明，显示底层纹理
4. **统一间距**: 对话气泡使用统一的margin间距

## 使用指南

### 添加新的边框元素
1. HTML结构使用三层嵌套：`small-border` > `border-inner` + `border-content`
2. 内容放在`border-content`内，确保z-index为正值
3. 交互元素设置合适的z-index避免被边框遮挡

### 调试层级问题
1. 检查z-index设置：边框负值，内容正值
2. 确认定位关系：`position: relative/absolute`
3. 验证背景设置：透明vs有背景的元素

---
*最后更新: 2025-08-14*
*版本: v1.0*