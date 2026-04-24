# Phycat 主题重构规格书 v2

> 基于 COLOR-MAP.md 的设计决策，作为重构实施的唯一执行依据。

---

## 1. 重构目标

将 Phycat 主题的颜色系统从"每个预设硬编码 25+ 变量"重构为"3 种子色 + 统一派生"架构，同时：

- 亮暗模式共用同一套派生公式（除 15 项物理不可统一的例外）
- 亮色模式正文改为中性黑，使 primary/secondary 可直接做强调色
- 亮色预设的 secondary 重新选为对比色（不再是同色系和谐色）
- 标题 hover 行为统一（变色+位移规则一致，装饰特效保留各自设计）
- 行内格式 hover 不变色，只加特效
- 预设行数从 ~25 行降到 12-14 行
- Style Settings 面板简化为 6 个覆盖项（亮暗共用）

---

## 2. 不改的部分

- **Callout 颜色**：保持硬编码（原作者精心设计，不纳入变量系统）
- **代码语法色**：各预设独立定义（需要 8-10 个独立色相，无法从 3 种子派生）
- **UI 外壳**：侧栏、标签栏、状态栏、Ribbon 等保持 Obsidian 默认
- **Mermaid / 脚注 / 数学公式 / 图谱 / Canvas**：保持现状
- **KBD 键帽**：亮暗各自风格保持

---

## 3. 种子色架构

### 3.1 每个预设定义 3 个种子色

| 种子 | 语义 |
|------|------|
| `--seed-primary` | 主题主色（标题装饰、列表标记、边框、hover 效果等） |
| `--seed-secondary` | 对比强调色（斜体、链接、H1/H2 辅助装饰等） |
| `--seed-bg` | 背景基调 |

### 3.2 亮色预设 secondary 重新选色

| 预设 | primary | 新 secondary（对比色） |
|------|---------|----------------------|
| Sakura | #ff7096 粉 | #bd93f9 紫（不变） |
| Sky | #3498db 蓝 | #c56200 橙 |
| Forest | #11aa63 绿 | #8e24aa 紫 |
| Mint | #3db8bf 青 | #c2185b 玫红 |
| Mauve | #a06eb4 紫 | #00838f 青 |
| Golden | #f59e0b 金 | #4527a0 靛蓝 |
| Cheery | #aa1141 红 | #00695c 青 |
| Prussian | #1d4e89 蓝 | #c62828 红 |

### 3.3 正文色在预设中定义

`--text-color` 和 `--text-muted` 作为预设的标准字段，亮暗结构一致：
- 所有亮色预设统一填 `#2d2d2d` / `#6b6b6b`（中性黑）
- 暗色预设各自填不同值（Vampire #f8f8f2/#d0d0d0、Abyss #d6deeb/#7e8c9f、Radiation #e6e6e6/#99a699）

这样每个预设的 schema 完全相同：3 种子 + 2 文字色 + 1 代码块背景 + 10 代码色 = 16 行。

---

## 4. 派生变量

### 4.1 亮暗相同公式（零分支）

```css
/* 强调色系 */
--accent-bold:      color-mix(in srgb, var(--seed-primary), black 15%);
--accent-italic:    color-mix(in srgb, var(--seed-secondary), black 15%);
--accent-highlight:  var(--accent-bold);

/* 装饰色系（全部用 transparent 混合，自适应亮暗背景） */
--deco-border:          color-mix(in srgb, var(--seed-primary), transparent 60%);
--deco-glow:            color-mix(in srgb, var(--seed-primary), transparent 50%);
--deco-hover-bg:        color-mix(in srgb, var(--seed-primary), transparent 90%);
--deco-selection:       color-mix(in srgb, var(--seed-primary), transparent 70%);
--deco-primary-subtle:  color-mix(in srgb, var(--seed-primary), transparent 90%);
--deco-primary-light:   color-mix(in srgb, var(--seed-primary), transparent 80%);
--deco-primary-wash:    color-mix(in srgb, var(--seed-primary), transparent 95%);

/* 标题装饰色系 */
--heading-deep:   color-mix(in srgb, var(--seed-primary), black 25%);
--heading-light:  color-mix(in srgb, var(--seed-primary), transparent 50%);
```

### 4.2 必须分开的（亮暗值不同）

```css
/* 辉光系统——核心审美差异：亮=柔影，暗=霓虹 */
body.theme-light {
  --glow-shadow-text: none;
  --glow-shadow-box: 0 2px 10px color-mix(in srgb, var(--seed-primary), transparent 60%);
}
body.theme-dark {
  --glow-shadow-text: 0 0 8px var(--deco-glow);
  --glow-shadow-box: 0 0 8px var(--deco-glow);
}

/* 背景系统——加深 vs 提亮方向相反 */
body.theme-light {
  --bg-primary: color-mix(in srgb, var(--seed-bg), white 2%);
  --bg-secondary: color-mix(in srgb, var(--seed-bg), white 5%);
  --bg-hover: rgba(0, 0, 0, 0.05);
}
body.theme-dark {
  --bg-primary: var(--seed-bg);
  --bg-secondary: color-mix(in srgb, var(--seed-bg), black 15%);
  --bg-hover: rgba(255, 255, 255, 0.05);
}

/* 正文色——各预设统一定义 text-color 和 text-muted（亮色统一 #2d2d2d/#6b6b6b，暗色各预设不同） */
/* 极弱文字色——全局定义 */
body.theme-light { --text-faint: #999; }
body.theme-dark  { --text-faint: #555; }

/* 标题文字色 */
body.theme-light { --h1-color: #000; /* ...h2-h6 同 */ }
body.theme-dark { --h1-color: #fff; /* ...h2-h6 同 */ }
```

---

## 5. UI 元素映射规则

### 5.1 行内格式化

**粗体**
- normal: `color: var(--accent-bold)`
- hover: **不变色**，加 `text-shadow: var(--glow-shadow-text)` + `border-bottom: 1px solid color-mix(primary, transparent 70%)`

**斜体**
- normal: `color: var(--accent-italic)`，波浪底纹 `color-mix(accent-italic, transparent 60%)`
- hover: **不变色**，加 `text-shadow: var(--glow-shadow-text)`，波浪纹增强（降低透明度）

**高亮**
- normal: `background-image: gradient(accent-highlight, transparent 60%)`，`color: var(--text-color)`
- hover: **不变色**，渐变扩展到 100% + `text-shadow: var(--glow-shadow-text)` + `box-shadow: var(--glow-shadow-box)`

**删除线**
- normal: `color: var(--text-muted)`，`text-decoration-color: color-mix(primary, transparent 40%)`
- hover: **不变色**，加 `text-shadow: var(--glow-shadow-text)`

**行内代码**
- normal: `color: var(--seed-primary)`，`background: color-mix(primary, transparent 90%)`
- hover: `background: var(--seed-primary)`，`color: #fff`，`box-shadow: color-mix(primary, transparent 60%)`

**链接**
- normal: `color: var(--accent-italic)`，方括号装饰 `color: var(--text-muted)`
- hover: `background: var(--deco-hover-bg)`，`color: var(--seed-primary)`，括号弹开+变色 primary

### 5.2 标题 H1–H6

#### 通用 Hover 原则

| 行为 | 规则 |
|------|------|
| 文字变色 | `color: var(--heading-deep)` |
| 文字辉光 | `text-shadow: var(--glow-shadow-text)` |
| 文字位移 | `transform: translateX(5px)` |
| 例外：H1 居中 | 不位移（居中偏移不合适） |
| 例外：H2 胶囊 | 不位移（全宽块元素偏移不合适） |
| 文字缩放 | 无，全部禁止 |
| 装饰辉光 | `box-shadow: var(--glow-shadow-box)` |

#### 装饰特效（各级独立）

| 级别 | 装饰 hover 行为 | 亮暗统一？ |
|------|----------------|-----------|
| H1 居中 ::after | 下划线展开 width:100% + glow-shadow-box | ✅ |
| H1 左对齐 ::before/::after | 双柱增长 + glow-shadow-box，统一 opacity 0.4 / border-radius 3px | ✅ |
| H2 胶囊 | 亮：background-position shift + shadow 加深 / 暗：::after 光晕显现 | 分开 |
| H2 双柱 ::after | 变色 primary + glow-shadow-box | ✅ |
| H3 ::before | 竖条 width 5→7px + glow-shadow-box | ✅ |
| H4 ::before | 圆点 scale(1.2) + glow-shadow-box | ✅ |
| H5 ::before | 亮：填实 + glow-shadow-box / 暗：保持空心 + glow-shadow-box | 分开 |
| H6 ::before | 破折号 scaleX(1.5) + glow-shadow-text | ✅ |

#### 静态样式

- 装饰元素颜色：全部 `--seed-primary`（H1 左 ::before 和 H2 双柱 ::after 用 `--seed-secondary`）
- H3-H6 ::after 图标底色：`--heading-light`
- H1-H6 文字色：亮 #000 / 暗 #fff（分开）
- H1 左 mix-blend-mode：亮 multiply / 暗 screen（分开）

### 5.3 其他元素

| 元素 | 关键规则 |
|------|---------|
| **标签** | 文字 accent-bold，背景/边框 color-mix(accent-bold, transparent 85%/50%) |
| **引用块** | 背景 deco-primary-wash，边框 color-mix(primary, transparent 80%)，hover 加 glow-shadow-box |
| **代码块** | 容器 code-block-bg，头部 deco-primary-subtle，语言名 seed-secondary，hover 边框 primary |
| **表格** | 表头背景 deco-primary-subtle，表头文字 primary，单元格 hover glow-shadow-text |
| **复选框** | 未选 color-mix(primary, transparent 90%)，已选 color-mix(primary, transparent 80%) + glow-shadow-box |
| **列表标记** | 全部 seed-primary |
| **水平线** | gradient(transparent → primary → transparent)，菱形 seed-primary |
| **文字选区** | deco-selection |
| **缩进引导线** | color-mix(primary, transparent 50%) |

---

## 6. 预设结构

### 亮色预设（16 行，与暗色结构完全一致）

```css
body.theme-light.theme-light-sakura {
  --seed-primary: #ff7096;
  --seed-secondary: #bd93f9;
  --seed-bg: #fff7fa;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #faf0f3;
  --code-normal: #37474f;
  --code-keyword: #d81b60;
  --code-function: #6a1b9a;
  --code-string: #2e7d32;
  --code-comment: #78909c;
  --code-property: #0277bd;
  --code-value: #ad1457;
  --code-punctuation: #37474f;
  --code-tag: #d81b60;
  --code-operator: #e65100;
}
```

### 暗色预设（16 行）

```css
body.theme-dark.theme-dark-vampire {
  --seed-primary: #ff5555;
  --seed-secondary: #bd93f9;
  --seed-bg: #282a36;
  --text-color: #f8f8f2;
  --text-muted: #d0d0d0;
  --code-block-bg: #282a36;
  --code-normal: #f8f8f2;
  --code-keyword: #ff79c6;
  --code-function: #50fa7b;
  --code-string: #f1fa8c;
  --code-comment: #6272a4;
  --code-property: #66d9ef;
  --code-value: #bd93f9;
  --code-punctuation: #f8f8f2;
  --code-tag: #ff79c6;
  --code-operator: #ff79c6;
}
```

---

## 7. Style Settings 面板

6 个覆盖项，亮暗共用：

```yaml
settings:
  - id: user-primary
    title: Theme Color / 主题色
    type: variable-color
    default: ''  # 空=跟随预设
  - id: user-secondary
    title: Accent Color / 对比强调色
    type: variable-color
    default: ''
  - id: user-bold
    title: Bold Color / 粗体色
    type: variable-color
    default: ''  # 空=跟随派生
  - id: user-italic
    title: Italic Color / 斜体色
    type: variable-color
    default: ''
  - id: user-highlight
    title: Highlight Color / 高亮色
    type: variable-color
    default: ''
  - id: user-bg
    title: Background Color / 背景色
    type: variable-color
    default: ''
```

优先级：用户覆盖 > 派生值 > 预设种子值

实现方式：`var(--user-bold, var(--accent-bold))`

---

## 8. 变量消除清单

以下旧变量在重构中删除，替代关系见 COLOR-MAP.md 第四节：

**核心重命名（影响全局，~220+ 处引用）：**
`--primary-color` → `--seed-primary`,
`--secondary-color` → `--seed-secondary`,
`--bg-color` → `--seed-bg`,
`--text-color-secondary` → `--text-muted`（暗色预设中）,

**删除的变量：**
`--light-deep`, `--light-light`, `--light-lighter`, `--light-pale`,
`--text-bold`, `--text-italic`, `--text-highlight`,
`--text-color`（亮色色调版）, `--text-color-secondary`（亮色色调版）,
`--glow-color`, `--select-text-bg-color`, `--hover-background-color`,
`--link-hover-color`, `--bold-light-color`, `--italic-light-color`,
`--bold-dark-color`, `--italic-dark-color`, `--highlight-light-color`,
`--highlight-dark-color`, `--h2-bg-gradient`（改为派生）,
`--h1-underline-color`（用 seed-primary）,
`--h2-shadow-color/hover`（从 primary 派生）,
`--h2-bg-image/hover`（暗色预设中硬编码，改为从 seed-primary 派生）,
`--border-color`（各预设硬编码版，改为 deco-border 统一派生）,
`--setting-items-background`（引用了 light-lighter，改为从 primary 派生）,
`--accent-color`（未使用）

---

## 9. Obsidian 原生变量桥接层

theme.css 中有一段将自定义变量映射到 Obsidian 内置 CSS 变量的代码，重构时必须同步更新：

```css
/* 重构后的桥接层 */
--text-normal: var(--text-color);
--text-accent: var(--seed-primary);
--text-accent-hover: var(--heading-deep);
--list-marker-color: var(--seed-primary);
--interactive-accent: var(--seed-primary);
--interactive-accent-hover: var(--heading-deep);
--text-selection: var(--deco-selection);
--background-modifier-border: var(--deco-border);
--background-modifier-border-hover: var(--seed-secondary);
--code-background: var(--code-block-bg);
--code-normal: var(--code-normal);  /* 从预设获取 */
--input-shadow: inset 0 0 0 1px var(--deco-border);
--input-shadow-hover: inset 0 0 0 1px var(--seed-secondary);
```

所有 `var(--primary-color)` → `var(--seed-primary)`，`var(--secondary-color)` → `var(--seed-secondary)` 等引用必须全局替换。

---

## 10. 代码清理（附带完成）


在重构过程中顺带修复：

| 问题 | 位置 | 修复方式 |
|------|------|---------|
| `*/` 语法污染 | L4278 | 删除多余的 `*/` |
| CSS nesting | L649-694 | 展开为标准平铺写法 |
| `--code-normal` 重复定义 | 多处 | 保留一处，删除重复 |
| var() 无 fallback | 多处 | 所有 var() 加合理 fallback |

---

## 11. 迁移策略

### 分支

从 `feat/enhanced-light-mode-and-editor-effects` 创建 `refactor/color-system` 分支。

### 执行顺序

1. **Phase 1：变量系统** — 定义种子色+派生层，重写 11 个预设，替换 CSS 规则中的旧变量引用
2. **Phase 2：标题 hover 统一** — 按 §5.2 规则重写所有标题 hover 规则
3. **Phase 3：行内格式 hover 统一** — 按 §5.1 规则重写粗体/斜体/高亮/删除线 hover
4. **Phase 4：代码清理** — §9 中的附带修复
5. **Phase 5：Style Settings 面板** — 按 §7 重写 @settings 块

每个 Phase 完成后在 Obsidian 中测试所有 11 个预设，确认无回归。

### 兼容性

- 旧 Style Settings 配置会失效（预设 class 名不变，但颜色变量名全部改变）
- 在 changelog 中说明一次性迁移
- 不提供别名过渡层（用户群小，不值得维护成本）

---

## 12. 「必须分开」完整清单

仅以下 15 项保留亮暗分支：

| # | 项目 | 原因 |
|---|------|------|
| 1-3 | 正文色 / 次要文字 / 极弱文字 | 对比方向相反 |
| 4 | 标题文字色 (#000/#fff) | 对比方向相反 |
| 5 | 辉光系统 (柔影/霓虹) | 核心审美差异 |
| 6 | H1 左对齐 mix-blend-mode | multiply/screen 天然相反 |
| 7 | H2 胶囊装饰特效 | 两套不同设计语言 |
| 8 | H5 ::before hover (填实/空心) | 亮暗各有独立设计 |
| 9 | bg-hover | 加深 vs 提亮 |
| 10 | 表格容器背景 | 磨砂 vs 浮层 |
| 11 | 表格行 hover | 加深 vs 提亮 |
| 12 | KBD 键帽 | 两套独立设计 |
| 13 | 引用 emoji | 审美选择 |
| 14-15 | bg-primary / bg-secondary 派生 | 方向不同 |
