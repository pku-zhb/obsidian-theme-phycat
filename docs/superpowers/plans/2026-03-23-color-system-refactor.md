# Phycat 颜色系统重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Phycat 主题从"每预设 25+ 硬编码变量"重构为"3 种子色 + 统一派生"架构，亮暗共用一套公式。

**Architecture:** 单文件 `theme.css`（5522 行）。重构分 7 个 Task：先建新变量基础层，再转换预设，再全局替换旧引用，然后统一标题/行内 hover 行为，最后清理代码和重写 Style Settings。每个 Task 完成后在 Obsidian 中验证 11 个预设无回归。

**Tech Stack:** CSS (Obsidian theme) + Style Settings plugin `@settings` YAML

**参考文档：**
- 规格书：`docs/REFACTOR-SPEC-v2.md`
- 颜色映射表：`docs/COLOR-MAP.md`

---

## File Structure

- **Modify:** `theme.css` — 唯一需要修改的文件
  - L1-580: @settings 面板定义（Task 7 重写）
  - L649-694: CSS nesting 块（Task 6 展开）
  - L695-800: 暗色预设 × 3（Task 2 重写）
  - L801-1123: 亮色预设 × 8（Task 2 重写）
  - L1124-1202: body.theme-light 通用变量块（Task 1 重写）
  - L1203-1266: body.theme-dark 通用变量块（Task 1 重写）
  - L1267+: CSS 规则区（Task 3 全局替换 + Task 4/5 hover 统一）
  - L4278: `*/` 语法污染（Task 6 修复）

## 注意事项

- **不要改 Callout 颜色**（L3932-4311）——保持原作者硬编码设计
- **不要改 KBD 键帽**——亮暗各自风格保留
- **不要改 Mermaid / UI 外壳**——保持现状
- 预设 class 名不变（`.theme-light-sakura` 等），避免破坏用户配置
- 所有 `var()` 调用应加 fallback（用 Sakura/Vampire 的值作为默认）
- 编辑模式规则（`.HyperMD-header-N`、`.editor-heading-hover`、`.editor-wikilink-style`）需要和阅读模式同步更新

---

### Task 1: 创建分支 + 新变量基础层

**Files:**
- Modify: `theme.css:1124-1266` — 替换 body.theme-light 和 body.theme-dark 通用变量块

- [ ] **Step 1: 创建重构分支**

```bash
git checkout -b refactor/color-system
```

- [ ] **Step 2: 在 body.theme-light 块（L1124-1202）前插入统一派生层**

在 L1123（最后一个预设块结束）之后、原 body.theme-light 块之前，插入新的 `body` 级别派生变量（亮暗共用）：

```css
/* ============================================
   Derived Variables — 亮暗统一公式，零分支
   ============================================ */
body {
  /* 强调色系 */
  --accent-bold: color-mix(in srgb, var(--seed-primary, #ff7096), black 15%);
  --accent-italic: color-mix(in srgb, var(--seed-secondary, #bd93f9), black 15%);
  --accent-highlight: var(--accent-bold);

  /* 装饰色系 */
  --deco-border: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 60%);
  --deco-glow: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 50%);
  --deco-hover-bg: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 90%);
  --deco-selection: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 70%);
  --deco-primary-subtle: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 90%);
  --deco-primary-light: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 80%);
  --deco-primary-wash: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 95%);

  /* 标题装饰色系 */
  --heading-deep: color-mix(in srgb, var(--seed-primary, #ff7096), black 25%);
  --heading-light: color-mix(in srgb, var(--seed-primary, #ff7096), transparent 50%);
}
```

- [ ] **Step 3: 重写 body.theme-light 通用变量块（L1124-1202）**

替换为：

```css
body.theme-light {
  /* 辉光系统：柔影 */
  --glow-shadow-text: none;
  --glow-shadow-box: 0 2px 10px color-mix(in srgb, var(--seed-primary), transparent 60%);

  /* 背景系统 */
  --bg-hover: rgba(0, 0, 0, 0.05);
  --text-faint: #999;

  /* 标题文字色 */
  --h1-color: #000;
  --h2-color: #000;
  --h3-color: #000;
  --h4-color: #000;
  --h5-color: #000;
  --h6-color: #000;

  /* Obsidian 桥接层 */
  --background-primary: color-mix(in srgb, var(--seed-bg, #fff7fa), white 2%);
  --background-primary-alt: color-mix(in srgb, var(--seed-bg, #fff7fa), black 3%);
  --background-secondary: color-mix(in srgb, var(--seed-bg, #fff7fa), white 5%);
  --background-secondary-alt: color-mix(in srgb, var(--seed-bg, #fff7fa), black 8%);
  --background-card: color-mix(in srgb, var(--seed-primary), #fff calc(var(--bg-mix-percent, 96) * 1%));
  --text-normal: var(--text-color);
  --text-accent: var(--seed-primary);
  --text-accent-hover: var(--heading-deep);
  --list-marker-color: var(--seed-primary);
  --interactive-accent: var(--seed-primary);
  --interactive-accent-hover: var(--heading-deep);
  --text-selection: var(--deco-selection);
  --background-modifier-hover: var(--bg-hover);
  --background-modifier-active-hover: rgba(0, 0, 0, 0.1);
  --background-modifier-border: var(--deco-border);
  --background-modifier-border-hover: var(--seed-secondary);
  --background-modifier-error: #d32f2f;
  --background-modifier-success: #388e3c;
  --code-background: var(--code-block-bg);
  --input-shadow: inset 0 0 0 1px var(--deco-border);
  --input-shadow-hover: inset 0 0 0 1px var(--seed-secondary);
  --mermaid-text-color: var(--text-color);

  /* 复选框 */
  --checkbox-bg-unchecked: color-mix(in srgb, var(--seed-primary), transparent 90%);
  --checkbox-border-unchecked: color-mix(in srgb, var(--seed-primary), transparent 50%);
  --checkbox-bg-checked: color-mix(in srgb, var(--seed-primary), transparent 80%);
  --checkbox-shadow-checked: var(--glow-shadow-box);
  --checkmark-color: #ffffff;

  /* 表格 */
  --table-bg: rgba(255, 255, 255, 0.4);
  --table-border-inner: rgba(0, 0, 0, 0.06);
  --table-row-hover-bg: rgba(0, 0, 0, 0.03);
  --table-th-bg: var(--deco-primary-subtle);
  --table-th-border: color-mix(in srgb, var(--seed-primary), transparent 80%);
  --table-cell-hover-bg: var(--deco-primary-light);
  --table-cell-hover-text: var(--seed-primary);

  /* 标签 */
  --tag-color: var(--accent-bold);
  --tag-background: color-mix(in srgb, var(--accent-bold), transparent 85%);
  --tag-background-hover: color-mix(in srgb, var(--accent-bold), transparent 75%);
  --tag-border-color: color-mix(in srgb, var(--accent-bold), transparent 50%);
  --tag-border-color-hover: var(--accent-bold);

  /* 引用块 */
  --blockquote-background-color: var(--deco-primary-wash);

  /* 缩进引导线 */
  --indentation-guide-color: color-mix(in srgb, var(--seed-primary), transparent 50%);

  /* 设置面板 */
  --setting-items-background: color-mix(in srgb, var(--seed-primary), transparent 94%);
}
```

- [ ] **Step 4: 重写 body.theme-dark 通用变量块（L1203-1266）**

替换为（结构与亮色对称，仅值不同）：

```css
body.theme-dark {
  /* 辉光系统：霓虹 */
  --glow-shadow-text: 0 0 8px var(--deco-glow);
  --glow-shadow-box: 0 0 8px var(--deco-glow);

  /* 背景系统 */
  --bg-hover: rgba(255, 255, 255, 0.05);
  --text-faint: #555;

  /* 标题文字色 */
  --h1-color: #fff;
  --h2-color: #fff;
  --h3-color: #fff;
  --h4-color: #fff;
  --h5-color: #fff;
  --h6-color: #fff;

  /* Obsidian 桥接层 */
  --background-primary: var(--seed-bg);
  --background-primary-alt: var(--seed-bg);
  --background-secondary: color-mix(in srgb, var(--seed-bg, #282a36), black 15%);
  --background-secondary-alt: color-mix(in srgb, var(--seed-bg, #282a36), black 25%);
  --text-normal: var(--text-color);
  --text-accent: var(--seed-primary);
  --text-accent-hover: var(--heading-deep);
  --list-marker-color: var(--seed-primary);
  --interactive-accent: var(--seed-primary);
  --interactive-accent-hover: var(--heading-deep);
  --text-selection: var(--deco-selection);
  --background-modifier-hover: var(--bg-hover);
  --background-modifier-active-hover: rgba(255, 255, 255, 0.1);
  --background-modifier-border: var(--deco-border);
  --background-modifier-border-hover: var(--seed-secondary);
  --background-modifier-error: #ff5555;
  --background-modifier-success: #50fa7b;
  --code-background: var(--code-block-bg);
  --input-shadow: inset 0 0 0 1px var(--deco-border);
  --input-shadow-hover: inset 0 0 0 1px var(--seed-secondary);
  --mermaid-text-color: #000;

  /* 复选框 */
  --checkbox-bg-unchecked: color-mix(in srgb, var(--seed-primary), transparent 90%);
  --checkbox-border-unchecked: color-mix(in srgb, var(--seed-primary), transparent 50%);
  --checkbox-bg-checked: color-mix(in srgb, var(--seed-primary), transparent 80%);
  --checkbox-shadow-checked: var(--glow-shadow-box);
  --checkmark-color: #ffffff;

  /* 表格 */
  --table-bg: rgba(255, 255, 255, 0.02);
  --table-border-inner: rgba(255, 255, 255, 0.05);
  --table-row-hover-bg: rgba(255, 255, 255, 0.03);
  --table-th-bg: var(--deco-primary-subtle);
  --table-th-border: color-mix(in srgb, var(--seed-primary), transparent 85%);
  --table-cell-hover-bg: var(--deco-primary-light);
  --table-cell-hover-text: var(--seed-primary);

  /* 标签（统一用 accent-bold） */
  --tag-color: var(--accent-bold);
  --tag-background: color-mix(in srgb, var(--accent-bold), transparent 85%);
  --tag-background-hover: color-mix(in srgb, var(--accent-bold), transparent 75%);
  --tag-border-color: color-mix(in srgb, var(--accent-bold), transparent 50%);
  --tag-border-color-hover: var(--accent-bold);

  /* 引用块 */
  --blockquote-background-color: var(--deco-primary-wash);

  /* 代码块头部 */
  --code-block-header-bg: var(--deco-primary-subtle);

  /* 缩进引导线 */
  --indentation-guide-color: color-mix(in srgb, var(--seed-primary), transparent 50%);

  /* 设置面板 */
  --setting-items-background: color-mix(in srgb, var(--seed-primary), transparent 94%);
}
```

- [ ] **Step 5: 在 Obsidian 中验证**

此时主题应该能加载但显示不正确（旧预设还在用旧变量名，新派生层引用了 `--seed-*` 但预设还没定义它们）。确认没有 CSS 语法错误导致整个主题崩溃。

- [ ] **Step 6: Commit**

```bash
git add theme.css
git commit -m "refactor: 添加统一派生变量层和 Obsidian 桥接层"
```

---

### Task 2: 重写 11 个预设块

**Files:**
- Modify: `theme.css:695-1123` — 替换所有 11 个预设块

每个预设从 ~35 行缩减为 16 行的统一 schema。

- [ ] **Step 1: 重写 3 个暗色预设（L695-800）**

**Vampire (L695-730):**
```css
body.theme-dark.theme-dark-vampire,
body.theme-dark:not(.theme-dark-abyss):not(.theme-dark-radiation) {
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

**Abyss (L731-765):**
```css
body.theme-dark.theme-dark-abyss {
  --seed-primary: #00b7c0;
  --seed-secondary: #2e8bd6;
  --seed-bg: #0f111a;
  --text-color: #d6deeb;
  --text-muted: #7e8c9f;
  --code-block-bg: #0f111a;
  --code-normal: #d6deeb;
  --code-keyword: #c792ea;
  --code-function: #82aaff;
  --code-string: #ecc48d;
  --code-comment: #637777;
  --code-property: #80cbc4;
  --code-value: #f78c6c;
  --code-punctuation: #d6deeb;
  --code-tag: #ff5370;
  --code-operator: #89ddff;
}
```

**Radiation (L766-800):**
```css
body.theme-dark.theme-dark-radiation {
  --seed-primary: #4cd964;
  --seed-secondary: #ffc107;
  --seed-bg: #1b1d1b;
  --text-color: #e6e6e6;
  --text-muted: #99a699;
  --code-block-bg: #1b1d1b;
  --code-normal: #e6e6e6;
  --code-keyword: #ffcb6b;
  --code-function: #4cd964;
  --code-string: #c3e88d;
  --code-comment: #546e7a;
  --code-property: #4cd964;
  --code-value: #f78c6c;
  --code-punctuation: #e6e6e6;
  --code-tag: #ff5370;
  --code-operator: #89ddff;
}
```

- [ ] **Step 2: 重写 8 个亮色预设（L801-1123）**

**Sakura (L801-847):** （默认预设，选择器保留 :not() fallback）
```css
body.theme-light.theme-light-sakura,
body.theme-light:not(.theme-light-sky):not(.theme-light-forest):not(.theme-light-mint):not(.theme-light-mauve):not(.theme-light-golden):not(.theme-light-cheery):not(.theme-light-prussian) {
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

**Sky (L848-889):**
```css
body.theme-light.theme-light-sky {
  --seed-primary: #3498db;
  --seed-secondary: #c56200;
  --seed-bg: #f4faff;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #f0f4f8;
  --code-normal: #24292e;
  --code-keyword: #d73a49;
  --code-function: #6f42c1;
  --code-string: #032f62;
  --code-comment: #6a737d;
  --code-property: #005cc5;
  --code-value: #005cc5;
  --code-punctuation: #24292e;
  --code-tag: #22863a;
  --code-operator: #d73a49;
}
```

**Forest (L890-934):**
```css
body.theme-light.theme-light-forest {
  --seed-primary: #11aa63;
  --seed-secondary: #8e24aa;
  --seed-bg: #f2f9f5;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #eef5f0;
  --code-normal: #383a42;
  --code-keyword: #a626a4;
  --code-function: #4078f2;
  --code-string: #50a14f;
  --code-comment: #a0a1a7;
  --code-property: #986801;
  --code-value: #986801;
  --code-punctuation: #383a42;
  --code-tag: #e45649;
  --code-operator: #0184bc;
}
```

**Mint (L935-971):**
```css
body.theme-light.theme-light-mint {
  --seed-primary: #3db8bf;
  --seed-secondary: #c2185b;
  --seed-bg: #f4fdff;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #edf8f9;
  --code-normal: #546e7a;
  --code-keyword: #00838f;
  --code-function: #6200ea;
  --code-string: #2e7d32;
  --code-comment: #90a4ae;
  --code-property: #f4511e;
  --code-value: #6200ea;
  --code-punctuation: #546e7a;
  --code-tag: #00838f;
  --code-operator: #d81b60;
}
```

**Mauve (L972-1009):**
```css
body.theme-light.theme-light-mauve {
  --seed-primary: #a06eb4;
  --seed-secondary: #00838f;
  --seed-bg: #fafafc;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #f5f0f7;
  --code-normal: #3c3836;
  --code-keyword: #9c27b0;
  --code-function: #1565c0;
  --code-string: #558b2f;
  --code-comment: #8d6e63;
  --code-property: #e65100;
  --code-value: #ad1457;
  --code-punctuation: #3c3836;
  --code-tag: #6a1b9a;
  --code-operator: #00695c;
}
```

**Golden Hour (L1010-1047):**
```css
body.theme-light.theme-light-golden {
  --seed-primary: #f59e0b;
  --seed-secondary: #4527a0;
  --seed-bg: #fffbeb;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #fdf6e3;
  --code-normal: #657b83;
  --code-keyword: #859900;
  --code-function: #268bd2;
  --code-string: #2aa198;
  --code-comment: #93a1a1;
  --code-property: #b58900;
  --code-value: #d33682;
  --code-punctuation: #657b83;
  --code-tag: #cb4b16;
  --code-operator: #859900;
}
```

**Cheery (L1048-1085):**
```css
body.theme-light.theme-light-cheery {
  --seed-primary: #aa1141;
  --seed-secondary: #00695c;
  --seed-bg: #fffbfb;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #faf0f0;
  --code-normal: #3c3836;
  --code-keyword: #cc241d;
  --code-function: #b16286;
  --code-string: #98971a;
  --code-comment: #928374;
  --code-property: #d79921;
  --code-value: #8f3f71;
  --code-punctuation: #3c3836;
  --code-tag: #cc241d;
  --code-operator: #689d6a;
}
```

**Prussian (L1086-1123):**
```css
body.theme-light.theme-light-prussian {
  --seed-primary: #1d4e89;
  --seed-secondary: #c62828;
  --seed-bg: #f0f6fa;
  --text-color: #2d2d2d;
  --text-muted: #6b6b6b;
  --code-block-bg: #eaf0f5;
  --code-normal: #1d3557;
  --code-keyword: #e63946;
  --code-function: #457b9d;
  --code-string: #2a9d8f;
  --code-comment: #6c757d;
  --code-property: #e76f51;
  --code-value: #264653;
  --code-punctuation: #1d3557;
  --code-tag: #e63946;
  --code-operator: #2a9d8f;
}
```

- [ ] **Step 3: 删除 Forest h2 override 块（L932-934）**

这个小块为 Forest 单独设置了 `--h2-bg-gradient`，重构后改为统一从 `--seed-primary` + `--heading-light` 派生，不再需要。

- [ ] **Step 4: 在 Obsidian 中验证**

切换所有 11 个预设，确认：
- 背景色正确（各预设不同）
- 代码块语法高亮颜色正确
- 暗色文字色正确（Vampire 近白、Abyss 浅蓝、Radiation 浅灰）

此时其他元素仍不正确（CSS 规则还引用旧变量名），属于预期。

- [ ] **Step 5: Commit**

```bash
git add theme.css
git commit -m "refactor: 重写 11 个预设为 16 行统一 schema"
```

---

### Task 3: 全局变量名替换

**Files:**
- Modify: `theme.css:1267+` — CSS 规则区全局替换旧变量引用

这是工作量最大的 Task。需要将 CSS 规则中所有旧变量引用替换为新名称。

- [ ] **Step 1: 核心变量全局替换**

在 CSS 规则区（预设和通用变量块之后的所有内容）执行以下替换：

| 旧 | 新 | 预估次数 |
|----|-----|---------|
| `var(--primary-color)` | `var(--seed-primary)` | ~120 |
| `var(--secondary-color)` | `var(--seed-secondary)` | ~15 |
| `var(--bg-color)` | `var(--seed-bg)` | ~5 |
| `var(--text-color-secondary)` | `var(--text-muted)` | ~5 |
| `var(--border-color)` | `var(--deco-border)` | ~15 |
| `var(--glow-color)` | `var(--deco-glow)` | ~5 |
| `var(--select-text-bg-color)` | `var(--deco-selection)` | ~2 |
| `var(--hover-background-color)` | `var(--seed-primary)` | ~3（暗色引用块 hover 用，需要实色不能用透明） |
| `var(--link-hover-color)` | `var(--heading-deep)` | ~5 |
| `var(--h2-shadow-color)` | `color-mix(in srgb, var(--seed-primary), transparent 65%)` | ~2 |
| `var(--h2-shadow-hover)` | `color-mix(in srgb, var(--seed-primary), transparent 35%)` | ~2 |
| `var(--code-block-header-bg)` | `var(--deco-primary-subtle)` | ~2 |

**注意：**
- 只替换 CSS 规则区（L1267+），不要碰预设块（L695-1123）和通用变量块（L1124-1266）——这些已经在 Task 1/2 中重写了
- **不要碰 Callout 区域**（L3932-4311）——保持原作者硬编码设计
- L4312-5522 的 post-callout 区域也需要替换（约 46 处 `--primary-color` 引用）
- `--code-important` 在新预设中被省略，会自动 fallback 到 `--code-keyword`（有意为之）

- [ ] **Step 2: 强调色变量替换**

| 旧 | 新 | 位置 |
|----|-----|------|
| `var(--text-bold)` | `var(--accent-bold)` | 粗体规则、标签规则 |
| `var(--text-italic)` | `var(--accent-italic)` | 斜体规则、亮色链接规则 |
| `var(--text-highlight)` | `var(--accent-highlight)` | 高亮规则 |

- [ ] **Step 3: 标题装饰色替换**

| 旧 | 新 |
|----|-----|
| `var(--light-deep)` | `var(--heading-deep)` |
| `var(--light-light)` | `var(--heading-light)` |
| `var(--light-lighter)` | `var(--glow-shadow-box)` 或删除（按上下文判断） |
| `var(--h1-underline-color)` | `var(--seed-primary)` |

- [ ] **Step 4: 删除已废弃变量的残余引用**

搜索以下变量名，确认在 CSS 规则区已无引用：
`--light-pale`, `--accent-color`, `--bold-light-color`, `--italic-light-color`,
`--bold-dark-color`, `--italic-dark-color`, `--highlight-light-color`, `--highlight-dark-color`

如果仍有引用，按 COLOR-MAP.md 的映射关系替换。

- [ ] **Step 5: 处理 `--h2-bg-gradient` 引用**

在 CSS 规则中搜索 `--h2-bg-gradient`，替换为从 seed-primary + heading-light 直接派生：

```css
/* 旧 */
background-image: var(--h2-bg-gradient);
/* 新 */
background-image: linear-gradient(to right, var(--heading-light), var(--seed-primary), var(--heading-light));
```

`--h2-bg-image` 和 `--h2-bg-image-hover`（暗色 H2 胶囊用）同理，替换为直接使用 `--seed-primary` 的 radial-gradient。

- [ ] **Step 6: 在 Obsidian 中全面验证**

逐个切换 11 个预设，检查：
- 所有标题装饰颜色正确
- 粗体/斜体/高亮颜色正确
- 链接/标签颜色正确
- 表格/代码块/引用块样式正确
- hover 效果基本可用（hover 统一在 Task 4/5 做，此时可能不完美）

- [ ] **Step 7: Commit**

```bash
git add theme.css
git commit -m "refactor: 全局替换旧变量引用为新种子色/派生变量"
```

---

### Task 4: 标题 Hover 统一

**Files:**
- Modify: `theme.css` — 阅读模式标题 hover 规则（约 L1481-1827 亮色 + L1828-2161 暗色）
- Modify: `theme.css` — 编辑模式标题 hover 规则（约 L2357-2583 editor-heading-hover 区域）

- [ ] **Step 1: 统一 H1 居中 hover（阅读模式）**

删除现有的 `.theme-light h1:hover` 和 `.theme-dark h1:hover` 两个块，合并为一个不带 theme 前缀的块：

```css
/* H1 居中 hover — 亮暗统一 */
.markdown-preview-view h1:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  /* 不做位移 */
}
.markdown-preview-view h1:hover::after {
  width: 100%;
  box-shadow: var(--glow-shadow-box);
}
```

- [ ] **Step 2: 统一 H1 左对齐 hover（阅读模式）**

合并亮暗为统一规则：

```css
.h1-align-left .markdown-preview-view h1:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
.h1-align-left .markdown-preview-view h1:hover::before {
  height: 32px; margin-top: 0; left: 4px;
  width: 6px; opacity: 0.4; border-radius: 3px;
}
.h1-align-left .markdown-preview-view h1:hover::after {
  height: 26px; margin-top: 0; left: 12px;
  width: 6px; border-radius: 3px;
  box-shadow: var(--glow-shadow-box);
}
```

- [ ] **Step 3: 统一 H2 胶囊 hover 文字行为**

文字行为统一，但装饰特效保持亮暗分开：

```css
/* H2 胶囊文字 hover — 统一 */
.h2-style-capsule .markdown-preview-view h2:hover,
.h2-style-dark-capsule .markdown-preview-view h2:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  /* 不做位移 */
}
/* H2 胶囊装饰 — 亮色 */
.theme-light.h2-style-capsule .markdown-preview-view h2:hover {
  background-position: 100% center;
  box-shadow: 0 8px 20px var(--h2-shadow-hover, color-mix(in srgb, var(--seed-primary), transparent 65%));
}
/* H2 胶囊装饰 — 暗色 */
.theme-dark.h2-style-dark-capsule .markdown-preview-view h2:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.theme-dark.h2-style-dark-capsule .markdown-preview-view h2:hover::after {
  opacity: 1;
}
```

- [ ] **Step 4: 统一 H2 双子塔 hover**

```css
:not(.h2-style-capsule):not(.h2-style-dark-capsule) .markdown-preview-view h2:hover {
  color: var(--heading-deep) !important;
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
/* ::before/::after 统一 */
:not(.h2-style-capsule):not(.h2-style-dark-capsule) .markdown-preview-view h2:hover::before {
  top: auto; margin-top: 0em; height: 1.4em; opacity: 0.5;
}
:not(.h2-style-capsule):not(.h2-style-dark-capsule) .markdown-preview-view h2:hover::after {
  top: auto; margin-top: 0.15em; height: 1.1em;
  width: 4px; opacity: 1;
  background-color: var(--seed-primary);
  box-shadow: var(--glow-shadow-box);
}
```

- [ ] **Step 5: 统一 H3-H6 hover**

```css
/* H3 */
.markdown-preview-view h3:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
.markdown-preview-view h3:hover::before {
  height: 24px; width: 7px; opacity: 1;
  box-shadow: var(--glow-shadow-box);
}

/* H4 */
.markdown-preview-view h4:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
.markdown-preview-view h4:hover::before {
  transform: translateY(-50%) scale(1.2);
  box-shadow: var(--glow-shadow-box);
}

/* H5 — 文字统一，装饰分开 */
.markdown-preview-view h5:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
.theme-light .markdown-preview-view h5:hover::before {
  background-color: var(--seed-primary);
  transform: translateY(-50%) scale(1.2);
  box-shadow: var(--glow-shadow-box);
}
.theme-dark .markdown-preview-view h5:hover::before {
  border-color: var(--seed-primary);
  box-shadow: var(--glow-shadow-box);
  transform: translateY(-50%) scale(1.2);
}

/* H6 */
.markdown-preview-view h6:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
.markdown-preview-view h6:hover::before {
  transform: translateY(-50%) scaleX(1.5);
  text-shadow: var(--glow-shadow-text);
}
```

- [ ] **Step 6: 同步更新编辑模式标题 hover 规则**

将 `body.editor-heading-hover` 区域（约 L2357-2583）按相同模式合并亮暗规则。选择器从 `.theme-light`/`.theme-dark` 变体合并为不带 theme 前缀（H5 除外）。

例如 H3 编辑模式：
```css
body.editor-heading-hover .markdown-source-view.mod-cm6 .HyperMD-header-3:hover {
  color: var(--heading-deep) !important;
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
body.editor-heading-hover .markdown-source-view.mod-cm6 .HyperMD-header-3:hover::before {
  height: 24px; width: 7px; opacity: 1;
  box-shadow: var(--glow-shadow-box);
}
```

其他级别同理。

- [ ] **Step 7: 删除旧的分散 hover 规则**

确认所有旧的 `.theme-light .markdown-preview-view hN:hover` 和 `.theme-dark .markdown-preview-view hN:hover` 规则已被新的统一规则替代，删除残留。

- [ ] **Step 8: 在 Obsidian 中验证**

在阅读模式和编辑模式下：
- hover H1-H6 确认变色+位移+辉光效果
- 亮色模式：变色+柔影，无位移（H1 居中/H2 胶囊）
- 暗色模式：变色+霓虹 glow
- H2 胶囊/双子塔两种风格都测试
- H5 亮色填实、暗色空心+glow
- 开关 editor-heading-hover toggle 测试

- [ ] **Step 9: Commit**

```bash
git add theme.css
git commit -m "refactor: 统一 H1-H6 hover 行为（亮暗合并规则）"
```

---

### Task 5: 行内格式 Hover 统一

**Files:**
- Modify: `theme.css` — 粗体/斜体/高亮/删除线 hover 规则区（约 L3196-3455）

- [ ] **Step 1: 统一粗体 hover**

删除 `.theme-light` 和 `.theme-dark` 分开的粗体 hover 规则，合并为：

```css
.markdown-preview-view strong:hover,
.markdown-source-view.mod-cm6 .cm-strong:hover,
.markdown-source-view.mod-cm6 strong:hover {
  /* 不变色 */
  text-shadow: var(--glow-shadow-text);
  border-bottom: 1px solid color-mix(in srgb, var(--seed-primary), transparent 70%);
}
```

- [ ] **Step 2: 统一斜体 hover**

合并为：

```css
.markdown-preview-view em:hover,
.markdown-source-view.mod-cm6 .cm-em:hover,
.markdown-source-view.mod-cm6 em:hover {
  /* 不变色 */
  text-shadow: var(--glow-shadow-text);
  -webkit-text-stroke: 0.5px var(--accent-italic);
}
```

保留波浪纹动画 `animation: stitchFlow` 不变。

- [ ] **Step 3: 统一高亮 hover**

合并为：

```css
.markdown-preview-view mark:not([style*="background"]):hover,
.markdown-source-view.mod-cm6 mark:not([style*="background"]):hover,
.markdown-source-view.mod-cm6 .cm-highlight:not([style*="background"]):hover {
  /* 不变色 */
  background-size: 100% 100%;
  background-image: linear-gradient(
    to top,
    color-mix(in srgb, var(--accent-highlight), transparent 20%),
    color-mix(in srgb, var(--accent-highlight), transparent 80%)
  ) !important;
  text-shadow: var(--glow-shadow-text);
  box-shadow: var(--glow-shadow-box);
}
```

- [ ] **Step 4: 统一删除线 hover**

合并为：

```css
.markdown-preview-view s:hover,
.markdown-preview-view del:hover,
.markdown-source-view.mod-cm6 .cm-strikethrough:hover {
  /* 不变色 */
  text-shadow: var(--glow-shadow-text);
}
```

- [ ] **Step 5: 统一行内代码 hover**

行内代码 hover 已经亮暗一致（反色效果），确认无需改动。

- [ ] **Step 6: 删除旧的分散 hover 规则**

搜索残留的 `.theme-light ... strong:hover`、`.theme-dark ... em:hover` 等，全部删除。

- [ ] **Step 7: 在 Obsidian 中验证**

- hover 粗体：不变色，出现下划线 + 暗色辉光
- hover 斜体：不变色，波浪纹动画 + 暗色辉光
- hover 高亮：不变色，渐变展开 + 暗色辉光
- hover 删除线：不变色，暗色辉光
- 以上在亮暗模式各测试一遍

- [ ] **Step 8: Commit**

```bash
git add theme.css
git commit -m "refactor: 统一行内格式 hover（不变色，只加特效）"
```

---

### Task 6: 代码清理

**Files:**
- Modify: `theme.css:649-694` — CSS nesting 展开
- Modify: `theme.css:4278` — `*/` 语法修复
- Modify: `theme.css` — 重复定义清理

- [ ] **Step 1: 展开 CSS nesting（L649-694）**

将嵌套的 `code { .token.selector { ... } }` 展开为标准平铺写法：

```css
code .token.selector { color: var(--code-string); }
code .token.class-name { color: var(--code-function); }
/* ... 逐个展开 ... */
```

- [ ] **Step 2: 修复 L4278 的 `*/` 语法污染**

删除行首多余的 `*/`，使 `.theme-dark .callout[data-callout="bug"]` 选择器恢复正常。

- [ ] **Step 3: 清理重复的 `--code-normal` 定义**

搜索 CSS 规则区中残留的 `--code-normal` 重新定义，删除重复（保留预设中的定义即可）。

- [ ] **Step 4: 为所有 `var()` 添加 fallback**

检查 CSS 规则区的 `var()` 调用，确保关键变量有 fallback。至少为根种子变量添加：
- `var(--seed-primary, #ff7096)`
- `var(--seed-secondary, #bd93f9)`
- `var(--seed-bg, #fff7fa)`

派生变量（如 `--accent-bold`）已经在 body 层定义了 fallback（Task 1），CSS 规则中使用时可以不加。

- [ ] **Step 5: 在 Obsidian 中验证**

- 暗色模式 bug callout 样式恢复正常
- 代码块语法高亮在 Prism 和 CM6 中都正常
- 无 CSS 解析错误

- [ ] **Step 6: Commit**

```bash
git add theme.css
git commit -m "fix: 修复 CSS nesting、语法污染和重复定义"
```

---

### Task 7: Style Settings 面板重写

**Files:**
- Modify: `theme.css:1-580` — 替换所有 @settings 块

- [ ] **Step 1: 重写配色方案选择面板**

保留 `phycat-colors` 面板中的 `class-select`（预设选择器），class 名不变。

- [ ] **Step 2: 重写语法标记设置面板**

将旧的分亮暗 4 个颜色选择器替换为统一的 3 个：

```css
/* @settings
name: ✏️ Phycat syntax mark setting
name.zh: ✏️ Phycat 语法标记设置
id: phycat-syntax
settings:
    -
        id: user-bold
        title: Bold text color
        title.zh: 粗体文字颜色
        description: Override bold/strong text color. Leave default to follow theme preset.
        description.zh: 覆盖粗体颜色。保持默认则跟随主题预设。
        type: variable-color
        format: hex
        default: '#d94868'
    -
        id: user-italic
        title: Italic text color
        title.zh: 斜体文字颜色
        type: variable-color
        format: hex
        default: '#a07dd4'
    -
        id: user-highlight
        title: Highlight color
        title.zh: 高亮标记颜色
        type: variable-color
        format: hex
        default: '#d94868'
*/
```

- [ ] **Step 3: 添加种子色覆盖面板**

新增面板允许用户覆盖种子色：

```css
/* @settings
name: 🎨 Phycat color override
name.zh: 🎨 Phycat 颜色覆盖
id: phycat-color-override
settings:
    -
        id: user-primary
        title: Theme color
        title.zh: 主题色
        description: Override primary theme color for all presets.
        description.zh: 覆盖所有预设的主题主色。
        type: variable-color
        format: hex
        default: '#ff7096'
    -
        id: user-secondary
        title: Accent color
        title.zh: 对比强调色
        type: variable-color
        format: hex
        default: '#bd93f9'
    -
        id: user-bg
        title: Background color
        title.zh: 背景色
        type: variable-color
        format: hex
        default: '#fff7fa'
*/
```

- [ ] **Step 4: 更新派生层支持用户覆盖**

在 Task 1 的 body 派生层中，将种子色引用改为支持用户覆盖的 fallback 链：

```css
body {
  --accent-bold: color-mix(in srgb, var(--user-primary, var(--seed-primary, #ff7096)), black 15%);
  /* 类似地更新所有引用 seed-primary 的派生变量 */
}
```

用户覆盖 `--user-bold`/`--user-italic`/`--user-highlight` 直接覆盖对应的 `--accent-*` 变量：

```css
body {
  --accent-bold: var(--user-bold, color-mix(in srgb, var(--user-primary, var(--seed-primary)), black 15%));
  --accent-italic: var(--user-italic, color-mix(in srgb, var(--user-secondary, var(--seed-secondary)), black 15%));
  --accent-highlight: var(--user-highlight, var(--accent-bold));
}
```

**注意：** `var()` 嵌套 `color-mix()` 的行为需要在 Obsidian 中实测确认。如果不支持，改为两层变量间接实现：

```css
/* Plan B: 两层间接方案 */
body {
  --_primary-resolved: var(--user-primary, var(--seed-primary, #ff7096));
  --_secondary-resolved: var(--user-secondary, var(--seed-secondary, #bd93f9));
  --accent-bold: var(--user-bold, color-mix(in srgb, var(--_primary-resolved), black 15%));
  --accent-italic: var(--user-italic, color-mix(in srgb, var(--_secondary-resolved), black 15%));
  --accent-highlight: var(--user-highlight, var(--accent-bold));
}
```

- [ ] **Step 5: 保留现有 toggle**

确认以下 class-toggle 仍然正常工作：
- `editor-heading-hover`
- `editor-wikilink-style`
- `editor-blockquote-fade`
- 其他在 phycat-layout / phycat-links 中的 toggle

- [ ] **Step 6: 在 Obsidian 中验证**

- Style Settings 面板显示正确的选项
- 修改颜色后即时生效
- 不修改时使用预设默认值
- 所有 toggle 正常

- [ ] **Step 7: Commit**

```bash
git add theme.css
git commit -m "refactor: 重写 Style Settings 面板（6 覆盖项，亮暗共用）"
```

---

### Task 8: 最终验证与清理

- [ ] **Step 1: 全量测试**

逐个切换 11 个预设（8 亮 + 3 暗），在每个预设下检查：
- [ ] 正文/粗体/斜体/高亮/删除线颜色正确
- [ ] 标题 H1-H6 装饰和 hover 效果正确
- [ ] 链接/标签颜色和 hover 正确
- [ ] 表格/代码块/引用块样式正确
- [ ] Callout 样式不受影响
- [ ] 编辑模式和阅读模式一致
- [ ] Style Settings 颜色覆盖生效

- [ ] **Step 2: 清理临时文件**

删除不再需要的 mockup 文件：
- `phycat-syntax-preview.html`
- `seed-color-mockup.html`
- `neutral-text-mockup.html`

- [ ] **Step 3: 最终 commit**

```bash
git add -A
git commit -m "refactor: Phycat 颜色系统重构完成——3 种子色 + 统一派生架构"
```
