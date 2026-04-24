# Phycat 主题重构规格书

## 背景

原作者 sumruler 希望重构主题，核心方向：**颜色变量全部可自定义，现有配色方案做成可选预设**。我们已经在 fork 上做了一轮增强（PR #75），现在基于现有代码做结构性重构。

## 重构目标

### 1. 颜色系统重新架构

**现状问题：**
- 11 个配色方案（8 浅 + 3 暗）各自硬编码 20+ 颜色变量
- 同一颜色变量在不同方案中重复定义（如 `--code-normal` 在 4 个方案中定义了两次）
- `--secondary-color` 被链接、斜体、装饰等多处引用，语义不清
- `--light-deep`、`--light-light`、`--light-lighter`、`--light-pale` 命名含义模糊

**目标架构：**

```
:root / body {
  /* 语义化颜色角色（用户可自定义） */
  --color-primary: ...;          /* 主强调色 */
  --color-primary-bold: ...;     /* 粗体/一级强调 */
  --color-secondary: ...;        /* 斜体/二级强调 */
  --color-highlight: ...;        /* 高亮 */
  --color-link: ...;             /* 链接 */
  --color-tag: ...;              /* 标签 */
  --color-bg: ...;               /* 背景 */
  --color-text: ...;             /* 正文 */
  --color-text-muted: ...;       /* 次要文字 */
  --color-border: ...;           /* 边框 */
  --color-code-*: ...;           /* 代码语法 */
  /* ... */
}

/* 预设通过 class-select 切换 */
body.preset-sakura { --color-primary: #ff7096; --color-primary-bold: #e91e63; ... }
body.preset-sky { --color-primary: #3498db; ... }
/* ... */
```

**关键原则：**
- 所有颜色通过语义化变量引用，CSS 规则中不出现硬编码颜色
- 预设只是一组变量赋值，不包含任何 CSS 规则
- Style Settings 暴露所有语义化变量，用户可覆盖任何颜色
- 预设是"起点"，用户自定义是"覆盖"

### 2. 清理 !important 链

**现状：** 505 个 `!important`，部分互相打架。

**目标：** 通过合理的选择器特异性设计，减少 `!important` 使用。仅在需要覆盖 Obsidian 默认样式时使用。

### 3. 修复 background-image vs background-color 问题

**现状：** 高亮用 `background-color: transparent !important` + `background-image: linear-gradient()` 实现，PDF 导出时背景图不渲染。

**目标：**
- 屏幕显示仍用渐变（视觉效果不变）
- 添加 `@media print` 回退到 `background-color`
- 去掉 `background-color: transparent` 上的 `!important`，让 print 规则能覆盖

### 4. 变量 fallback 链完善

**现状：** `--bg-color`、`--light-deep` 等变量在通用规则中引用时无 fallback。

**目标：** 所有 `var()` 调用都有合理的 fallback 值。

### 5. 清理死代码

- 重复定义的变量（`--code-normal` 等）
- 被覆盖的行高变量
- 重复的规则块
- L4278 处的 `*/` 语法污染

### 6. CSS 嵌套兼容性

**现状：** L649-694 使用了 CSS nesting，旧版 Obsidian/移动端可能不支持。

**目标：** 展开为标准平铺写法，确保全平台兼容。

---

## 现有代码审计摘要

### CRITICAL
- L4278：`*/` 污染选择器，暗色 bug callout 样式丢失
- L649-694：CSS nesting 兼容性问题

### HIGH
- L3479：`--bg-color` 无 fallback
- L1755 等：`--light-deep`/`--light-lighter` 在通用 `.theme-light` 选择器中无 fallback
- L3219-3286：高亮 `background-color: transparent !important` 导致 print 无法覆盖
- 暗色模式无 `--text-bold`/`--text-italic` 定义（不对称）

### MEDIUM
- 4 个主题 `--code-normal` 双重定义
- 行高变量双重定义
- 重复规则块
- `!important` 不对称（亮暗模式不一致）

### 已完成的改进（本轮）
- `--text-bold`、`--text-italic`、`--text-highlight` 变量引入 ✓
- 链接/标签颜色跟随语义变量 ✓
- Style Settings 面板 ✓
- 编辑模式 hover / wikilink toggle ✓
- 引用弱化 toggle ✓

---

## 重构策略

### 分阶段执行

**Phase 1：颜色变量抽取**
- 定义完整的语义化颜色变量表
- 将 11 个配色方案重写为纯变量赋值预设
- 将 CSS 规则中的硬编码颜色替换为变量引用
- 更新 Style Settings @settings 块

**Phase 2：代码清理**
- 消除死代码（重复定义、被覆盖的变量）
- 修复语法问题（L4278 `*/` 污染、CSS nesting）
- 完善 `var()` fallback

**Phase 3：!important 清理**
- 分析每个 `!important` 的必要性
- 通过选择器重新设计消除不必要的 `!important`

**Phase 4：Print 兼容**
- 添加 `@media print` 规则
- 高亮回退到 `background-color`

### 安全措施
- 新开 `refactor/color-system` 分支
- 每个 Phase 完成后在 Obsidian 中全面测试
- 保留 `feat/enhanced-light-mode-and-editor-effects` 分支作为当前可用版本

---

## 配色方案变量清单（待重构）

每个预设需要定义的完整变量列表：

### 核心颜色（用户最可能自定义的）
| 变量 | 语义 | Sakura 示例 |
|------|------|------------|
| --color-primary | 主题主色 | #ff7096 |
| --color-primary-bold | 粗体/一级强调 | #e91e63 |
| --color-secondary | 斜体/二级强调 | #0277bd |
| --color-highlight | 高亮 | #e91e63 |
| --color-link | 链接 | #0277bd |
| --color-bg | 页面背景 | #fff7fa |
| --color-text | 正文 | #1c1719 |
| --color-text-muted | 次要文字 | #3f3a3b |

### 装饰颜色（从核心颜色派生）
| 变量 | 语义 | 派生方式 |
|------|------|---------|
| --color-border | 边框 | primary + 60% transparent |
| --color-tag-bg | 标签背景 | primary-bold + 85% white |
| --color-selection | 选区 | primary + 70% transparent |
| --color-glow | 发光效果 | primary + 50% transparent |

### 代码颜色（独立体系）
| 变量 | 语义 |
|------|------|
| --color-code-normal | 代码默认 |
| --color-code-keyword | 关键字 |
| --color-code-function | 函数 |
| --color-code-string | 字符串 |
| --color-code-comment | 注释 |
| --color-code-value | 值 |
| --color-code-tag | 标签 |
| --color-code-operator | 运算符 |
| --color-code-property | 属性 |
| --color-code-punctuation | 标点 |
| --color-code-block-bg | 代码块背景 |

---

## 文件位置
- 主题文件：`/Users/zhuhuibin/Nutstore Files/Nutstore/.obsidian/themes/Phycat/theme.css`
- Fork 仓库：`pku-zhb/obsidian-theme-phycat`
- 上游仓库：`sumruler/obsidian-theme-phycat`
- 当前分支：`feat/enhanced-light-mode-and-editor-effects`
- 重构分支（待创建）：`refactor/color-system`
