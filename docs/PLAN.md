# Phycat 主题定制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改善 Phycat Obsidian 主题的浅色模式语法标记可读性，并将编辑模式的标题 hover 特效和 wikilink 特效暴露为可选功能。

**Architecture:** 所有修改集中在 `theme.css` 一个文件中。分三个独立功能分支依次实现：(1) 浅色模式语法标记配色重新设计 + Style Settings 面板 (2) 编辑模式标题 hover toggle (3) 编辑模式 wikilink 样式 toggle。每个功能完成后提交到 git。

**Tech Stack:** CSS (Obsidian theme) + Style Settings plugin `@settings` YAML 注释块

---

## File Structure

- **Modify:** `theme.css` — 唯一需要修改的文件
  - 行 1~481: `@settings` 注释块（Style Settings 配置面板）
  - 行 482+: 实际 CSS 规则

## 注意事项

- Style Settings 的不同功能要放在**独立的 `@settings` 块**中，不要堆在一起
- 修改颜色变量时，`--secondary-color` 被链接、装饰等多处引用，**不能直接改**。需要引入新的 `--text-italic` 变量专用于斜体
- `--text-bold` 仅被粗体规则引用（line 2861），可以安全修改默认值。`--light-deep` 仍被 h4/h5/h6 hover 引用，不受影响
- Style Settings `variable-color` 必须有有效的颜色默认值（不能为空）。使用默认主题 Sakura 的颜色作为 default，各主题通过 `var(--xxx, fallback)` 模式确保独立默认值
- 编辑模式已有一条无条件标题 hover 规则（line 2172），Task 2 需处理
- 每个 Task 完成后 git commit

---

### Task 1: 浅色模式语法标记配色 + Style Settings 面板

**Files:**
- Modify: `theme.css` @settings 区域（行 ~130 之前，在现有面板之间插入新面板）
- Modify: `theme.css` 各浅色主题变量块（行 700~1005）
- Modify: `theme.css` 斜体 CSS 规则（行 2905~2916）
- Modify: `theme.css:1007-1084` body.theme-light 通用变量块

**1.1 核心变量设计**

引入两个新 CSS 变量：
- `--text-bold`: 已存在，改默认值
- `--text-italic`: 新增，用于斜体文字色和波浪底纹色

每个浅色主题的新默认值：

| 主题 | `--text-bold` 新默认 | `--text-italic` 新默认 |
|------|---------------------|----------------------|
| Sakura | `#e91e63` (不变) | `#0277bd` |
| Sky | `#1a5276` (不变) | `#c56200` |
| Forest | `#8e24aa` | `#bf6c00` |
| Mint | `#c2185b` | `#e65100` |
| Mauve | `#00838f` | `#c56200` |
| Golden Hour | `#4527a0` | `#00796b` |
| Cheery | `#00695c` | `#4527a0` |
| Prussian | `#c62828` | `#bf6c00` |

- [ ] **Step 1: 添加 @settings 面板 "✏️ Phycat syntax mark setting"**

在 `theme.css` 的 `@settings` 区域（行 ~130，在 spacing 面板之前）插入新的 `@settings` 块：

```css
/* @settings
name: ✏️ Phycat syntax mark setting
name.zh: ✏️ Phycat 语法标记设置
id: phycat-syntax
settings:
    -
        id: bold-light-color
        title: Bold text color (Light Mode)
        title.zh: 粗体文字颜色（亮色模式）
        description: Override bold text color for all light themes. Leave empty to use each theme's default.
        description.zh: 覆盖所有亮色主题的粗体颜色。留空则使用各主题默认值。
        type: variable-color
        format: hex
        default: '#e91e63'
    -
        id: italic-light-color
        title: Italic text color (Light Mode)
        title.zh: 斜体文字颜色（亮色模式）
        description: Override italic text color for all light themes.
        description.zh: 覆盖所有亮色主题的斜体颜色。
        type: variable-color
        format: hex
        default: '#0277bd'
    -
        id: bold-dark-color
        title: Bold text color (Dark Mode)
        title.zh: 粗体文字颜色（暗色模式）
        description: Override bold text color for all dark themes.
        description.zh: 覆盖所有暗色主题的粗体颜色。
        type: variable-color
        format: hex
        default: '#ff5555'
    -
        id: italic-dark-color
        title: Italic text color (Dark Mode)
        title.zh: 斜体文字颜色（暗色模式）
        description: Override italic text color for all dark themes.
        description.zh: 覆盖所有暗色主题的斜体颜色。
        type: variable-color
        format: hex
        default: '#bd93f9'
*/
```

- [ ] **Step 2: 修改各浅色主题变量块的 `--text-bold` 默认值**

在每个浅色主题块（`body.theme-light.theme-light-xxx`）中修改 `--text-bold` 行，使用 `var(--bold-light-color, <new-default>)` 模式。同时新增 `--text-italic` 行：

Sakura (行 ~727):
```css
  --text-bold: var(--bold-light-color, #e91e63);
  --text-italic: var(--italic-light-color, #0277bd);
```

Sky (行 ~768):
```css
  --text-bold: var(--bold-light-color, #1a5276);
  --text-italic: var(--italic-light-color, #c56200);
```

Forest (行 ~808):
```css
  --text-bold: var(--bold-light-color, #8e24aa);
  --text-italic: var(--italic-light-color, #bf6c00);
```

Mint (行 ~845):
```css
  --text-bold: var(--bold-light-color, #c2185b);
  --text-italic: var(--italic-light-color, #e65100);
```

Mauve (行 ~880):
```css
  --text-bold: var(--bold-light-color, #00838f);
  --text-italic: var(--italic-light-color, #c56200);
```

Golden Hour (行 ~916):
```css
  --text-bold: var(--bold-light-color, #4527a0);
  --text-italic: var(--italic-light-color, #00796b);
```

Cheery (行 ~952):
```css
  --text-bold: var(--bold-light-color, #00695c);
  --text-italic: var(--italic-light-color, #4527a0);
```

Prussian (行 ~988):
```css
  --text-bold: var(--bold-light-color, #c62828);
  --text-italic: var(--italic-light-color, #bf6c00);
```

- [ ] **Step 3: 修改暗色模式粗体和斜体 CSS 规则**

暗色模式粗体（行 ~2849）从直接用 `--primary-color` 改为支持覆盖：
```css
body.theme-dark .markdown-preview-view strong,
body.theme-dark .markdown-source-view.mod-cm6 .cm-strong,
body.theme-dark .markdown-source-view.mod-cm6 strong {
  color: var(--bold-dark-color, var(--primary-color));
}
```

暗色模式斜体（行 ~2935）从直接用 `--secondary-color` 改为支持覆盖：
```css
body.theme-dark .markdown-preview-view em,
body.theme-dark .markdown-source-view.mod-cm6 .cm-em,
body.theme-dark .markdown-source-view.mod-cm6 em {
  color: var(--italic-dark-color, var(--secondary-color));
  /* background-image 中的 secondary-color 也要对应替换为 var(--italic-dark-color, var(--secondary-color)) */
}
```

- [ ] **Step 4: 修改浅色模式斜体规则使用 `--text-italic`**

行 2905~2916，把 `var(--secondary-color)` 替换为 `var(--text-italic)`：
```css
body.theme-light .markdown-preview-view em,
body.theme-light .markdown-source-view.mod-cm6 .cm-em,
body.theme-light .markdown-source-view.mod-cm6 em {
  color: var(--text-italic);
  background-image: linear-gradient(
    -45deg,
    transparent 35%,
    color-mix(in srgb, var(--text-italic), transparent 60%) 35%,
    color-mix(in srgb, var(--text-italic), transparent 60%) 65%,
    transparent 65%
  );
}
```

浅色 hover 规则（行 2917~2931）保持用 `--primary-color`，不需要改（hover 回归主色是原设计意图）。

- [ ] **Step 5: 在 Obsidian 中验证**

打开 Obsidian，切换各浅色主题，检查：
- 粗体、斜体、高亮、删除线是否视觉上可区分
- Style Settings 面板中颜色选择器是否工作
- 覆盖颜色后是否正确应用
- 暗色模式是否不受影响

- [ ] **Step 6: Git commit**

```bash
git add theme.css
git commit -m "feat: 重新设计浅色模式语法标记配色，添加 Style Settings 颜色自定义"
```

---

### Task 2: 编辑模式标题 hover 特效 toggle

**Files:**
- Modify: `theme.css` @settings 区域（在 `phycat-headings` 面板中添加 toggle）
- Modify: `theme.css` CSS 规则区域（在标题 hover 规则附近添加新规则）

**设计：** 添加 `class-toggle` 名为 `editor-heading-hover`，开启后为 `.markdown-source-view.mod-cm6 .HyperMD-header-N` 添加与阅读模式对应的 hover 效果。

**需要复制的 hover 规则清单：**

亮色模式（`.theme-light`）:
- h1:hover — 变色 + translateY（居中模式）
- h1:hover::after — 下划线展开
- h1-align-left h1:hover — 变色
- h1-align-left h1:hover::before, ::after — 装饰条动画
- h2-style-capsule h2:hover — 渐变位移 + 缩放
- h2-style-twin h2:hover, ::before, ::after — 双子塔动画
- h3:hover, ::before — 色条增长
- h4:hover, ::before — 圆点放大
- h5:hover, ::before — 空心填充
- h6:hover, ::before — 破折号拉伸

暗色模式（`.theme-dark`）:
- 同上对应的暗色版本（带 glow 效果）

**注意：** H3~H6 编辑模式的 `::before` 已有前缀图标装饰（与阅读模式不同），hover 效果需要适配编辑模式自身的装饰结构，而非照搬阅读模式。

- [ ] **Step 1: 在 phycat-headings @settings 中添加 toggle**

在 `phycat-headings` 的 `settings:` 列表开头（行 ~193 之后）插入：
```yaml
    -
        id: editor-heading-hover
        title: Enable heading hover effects in Editor
        title.zh: 编辑模式标题 hover 特效
        description: Enable the same heading hover animations in editing/live-preview mode as in reading mode.
        description.zh: 在编辑/实时预览模式中启用与阅读模式相同的标题悬停动画效果。
        type: class-toggle
```

- [ ] **Step 2: 添加亮色模式 H1 编辑器 hover 规则**

在现有 H1 hover 规则之后（行 ~1462 附近），添加 `body.editor-heading-hover` 作用域的规则：

```css
/* === Editor heading hover (light, h1 centered) === */
body.editor-heading-hover.theme-light .markdown-source-view.mod-cm6 .HyperMD-header-1:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
}
body.editor-heading-hover.theme-light .markdown-source-view.mod-cm6 .HyperMD-header-1:hover::after {
  width: 100%;
}
```

对 h1-align-left 变体同理。

- [ ] **Step 3: 添加亮色模式 H2 编辑器 hover 规则**

对 capsule 和 twin 两种风格分别添加。

capsule 示例：
```css
body.editor-heading-hover.theme-light.h2-style-capsule .markdown-source-view.mod-cm6 .HyperMD-header-2:hover {
  background-position: 100% center;
  transform: scale(1.01);
  box-shadow: 0 8px 20px var(--h2-shadow-hover);
}
```

twin 的 ::before 和 ::after hover 效果同理。

- [ ] **Step 4: 添加亮色模式 H3~H6 编辑器 hover 规则**

H3~H6 编辑模式用 `.HyperMD-header-N` 选择器，hover 效果适配编辑模式自身的 `::before` 装饰结构。

主要是变色 + 基础变换：
```css
body.editor-heading-hover.theme-light .markdown-source-view.mod-cm6 .HyperMD-header-3:hover {
  color: var(--primary-color);
  padding-left: 20px;
}
/* 编辑模式 ::before 已有图标，hover 时增强 opacity 和颜色即可 */
body.editor-heading-hover.theme-light .markdown-source-view.mod-cm6 .HyperMD-header-3:hover::before {
  opacity: 1;
  color: var(--primary-color);
}
```

H4~H6 同理，逐个添加。

- [ ] **Step 5: 添加暗色模式全部标题编辑器 hover 规则**

与 Step 2~4 相同模式，使用 `.theme-dark` 前缀，hover 效果包含 `text-shadow: var(--glow-shadow-text)` 等暗色特有的 glow 效果。

- [ ] **Step 6: 在 Obsidian 中验证**

在编辑模式下：
- 开启 toggle，hover 各级标题确认动画生效
- 关闭 toggle，确认完全无 hover 效果
- 切换亮暗模式确认
- 检查 H2 的 capsule/twin 两种风格

- [ ] **Step 7: Git commit**

```bash
git add theme.css
git commit -m "feat: 添加编辑模式标题 hover 特效 toggle"
```

---

### Task 3: 编辑模式 wikilink 样式 toggle

**Files:**
- Modify: `theme.css` @settings 区域（添加新面板或在 layout 中添加）
- Modify: `theme.css` CSS 规则区域（行 ~2653 链接规则附近）

**背景：** 当前链接样式（括号渲染 + hover 动画）的源码选择器用的是 `.cm-link .cm-underline`，匹配标准 markdown 链接 `[text](url)`。Wikilink `[[text]]` 在编辑模式使用 `cm-hmd-internal-link` class，没有被覆盖。

**设计：** 添加 `class-toggle` 名为 `editor-wikilink-style`，开启后为 `cm-hmd-internal-link` 添加与阅读模式 `a.internal-link` 相同的括号装饰和 hover 动画。

- [ ] **Step 1: 添加 @settings toggle**

在 @settings 区域添加新面板：
```css
/* @settings
name: 🔗 Phycat link setting
name.zh: 🔗 Phycat 链接设置
id: phycat-links
settings:
    -
        id: editor-wikilink-style
        title: Wikilink bracket & hover effects in Editor
        title.zh: 编辑模式 Wikilink 括号装饰与 hover 特效
        description: Show single bracket decoration and hover animation for [[wikilinks]] in editing/live-preview mode, matching reading mode style.
        description.zh: 在编辑/实时预览模式中为 [[内部链接]] 显示单括号装饰和悬停动画效果，与阅读模式一致。
        type: class-toggle
*/
```

- [ ] **Step 2: 添加 wikilink 编辑器基础样式**

```css
/* === Editor wikilink style === */
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link {
  color: var(--secondary-color) !important;
  text-decoration: none !important;
  font-weight: 500;
  padding: 0 2px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

- [ ] **Step 3: 添加括号 ::before / ::after 装饰**

```css
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link::before {
  content: "[";
  display: inline-block;
  color: var(--text-muted);
  margin-right: 1px;
  opacity: 0.7;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.3s,
    opacity 0.3s;
}
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link::after {
  content: "]";
  display: inline-block;
  color: var(--text-muted);
  margin-left: 1px;
  opacity: 0.7;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    color 0.3s,
    opacity 0.3s;
}
```

- [ ] **Step 4: 添加 hover 动画**

```css
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link:hover {
  background-color: color-mix(in srgb, var(--primary-color), transparent 90%);
  color: var(--primary-color) !important;
  text-decoration: none !important;
}
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link:hover::before {
  transform: translateX(-4px);
  color: var(--primary-color);
  font-weight: bold;
  opacity: 1;
}
body.editor-wikilink-style .markdown-source-view.mod-cm6 .cm-hmd-internal-link:hover::after {
  transform: translateX(4px);
  color: var(--primary-color);
  font-weight: bold;
  opacity: 1;
}
```

- [ ] **Step 5: 处理 wikilink 原始 `[[` `]]` 标记的隐藏/显示**

需要在 Obsidian 中 inspect 实际 DOM 确认：
- `cm-formatting-link` 等 class 的标记元素是否需要特殊处理
- Live preview 模式 vs 源码模式下 wikilink 的 DOM 差异
- 如果 `[[` `]]` 标记仍然可见，需要隐藏原始标记以避免重复括号

这一步可能需要根据实测结果调整选择器。

- [ ] **Step 6: 在 Obsidian 中验证**

- 开启 toggle，编辑模式中 `[[wikilink]]` 是否显示单括号 + hover 动画
- 关闭 toggle，确认恢复默认外观
- 检查 live preview 和 source mode 两种编辑模式
- 检查带别名的 wikilink `[[page|alias]]`
- 确认标准 markdown 链接 `[text](url)` 不受影响

- [ ] **Step 7: Git commit**

```bash
git add theme.css
git commit -m "feat: 添加编辑模式 wikilink 括号装饰与 hover 特效 toggle"
```

---

### Task 4: 最终验证与清理

- [ ] **Step 1:** 逐个主题完整测试所有功能
- [ ] **Step 2:** 清理 PLAN.md（如不需要保留）
- [ ] **Step 3:** 最终 commit
