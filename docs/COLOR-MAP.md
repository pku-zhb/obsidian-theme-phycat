# Phycat 颜色映射表（重构用）

> 基于决策：3 种子色 + 中性正文 + 统一亮暗派生规则
> 最后更新：2026-03-23

---

## 一、种子色定义

每个预设只定义这 3 个值（+ 代码语法色独立子系统）：

| 种子 | 语义 | Sakura | Sky | Forest | Mint | Mauve | Golden | Cheery | Prussian | Vampire | Abyss | Radiation |
|------|------|--------|-----|--------|------|-------|--------|--------|----------|---------|-------|-----------|
| `--seed-primary` | 主题主色 | #ff7096 | #3498db | #11aa63 | #3db8bf | #a06eb4 | #f59e0b | #aa1141 | #1d4e89 | #ff5555 | #00b7c0 | #4cd964 |
| `--seed-secondary` | 对比强调 | #bd93f9 | #c56200 | #8e24aa | #c2185b | #00838f | #4527a0 | #00695c | #c62828 | #bd93f9 | #2e8bd6 | #ffc107 |
| `--seed-bg` | 背景基调 | #fff7fa | #f4faff | #f2f9f5 | #f4fdff | #fafafc | #fffbeb | #fffbfb | #f0f6fa | #282a36 | #0f111a | #1b1d1b |

---

## 二、派生变量（自动计算）

**设计原则：除「必须分开」清单中的项目外，所有派生公式亮暗完全相同，零分支。**

### 2.1 正文色系（必须分开）

| 派生变量 | 亮色模式 | 暗色模式 | 用途 |
|---------|---------|---------|------|
| `--text-color` | #2d2d2d（固定中性黑） | 各预设定义（近白） | 正文 |
| `--text-muted` | #6b6b6b（固定中性灰） | 各预设定义（浅灰） | 次要文字、引用、删除线 |
| `--text-faint` | #999 | #555 | 格式标记、极弱文字 |

### 2.2 强调色系（亮暗同一公式）

| 派生变量 | 公式（亮暗相同） | 用途 |
|---------|-----------------|------|
| `--accent-bold` | `color-mix(in srgb, var(--seed-primary), black 15%)` | 粗体文字、标签文字 |
| `--accent-italic` | `color-mix(in srgb, var(--seed-secondary), black 15%)` | 斜体文字、链接文字 |
| `--accent-highlight` | `var(--accent-bold)` | 高亮标记色 |

### 2.3 装饰色系（亮暗同一公式，用 transparent 自适应）

| 派生变量 | 公式（亮暗相同） | 用途 |
|---------|-----------------|------|
| `--deco-border` | `color-mix(primary, transparent 60%)` | 通用边框 |
| `--deco-glow` | `color-mix(primary, transparent 50%)` | 辉光底色 |
| `--deco-hover-bg` | `color-mix(primary, transparent 90%)` | hover 背景淡色 |
| `--deco-selection` | `color-mix(primary, transparent 70%)` | 文字选区 |
| `--deco-primary-subtle` | `color-mix(primary, transparent 90%)` | 表头、代码头等淡色背景 |
| `--deco-primary-light` | `color-mix(primary, transparent 80%)` | hover 加强背景 |
| `--deco-primary-wash` | `color-mix(primary, transparent 95%)` | 引用块背景等极淡色 |

### 2.4 标题装饰色系（亮暗同一公式）

| 派生变量 | 公式（亮暗相同） | 替代旧变量 |
|---------|-----------------|-----------|
| `--heading-deep` | `color-mix(primary, black 25%)` | --light-deep |
| `--heading-light` | `color-mix(primary, transparent 50%)` | --light-light |

### 2.5 背景色系（必须分开）

| 派生变量 | 亮色模式 | 暗色模式 | 用途 |
|---------|---------|---------|------|
| `--bg-primary` | color-mix(bg, white 2%) | = bg | 主编辑区 |
| `--bg-secondary` | color-mix(bg, white 5%) | color-mix(bg, black 15%) | 侧栏 |
| `--bg-hover` | rgba(0,0,0,0.05) | rgba(255,255,255,0.05) | hover 背景 |

### 2.6 辉光系统（必须分开——亮色=柔影，暗色=霓虹）

| 派生变量 | 亮色模式 | 暗色模式 | 用途 |
|---------|---------|---------|------|
| `--glow-shadow-text` | none | 0 0 8px var(--deco-glow) | hover 文字辉光 |
| `--glow-shadow-box` | 0 2px 10px color-mix(primary, transparent 60%) | 0 0 8px var(--deco-glow) | 装饰元素 hover 辉光 |

> 虽然值不同，但 CSS 规则只写 `text-shadow: var(--glow-shadow-text)` 一次，不需要 .theme-light/.theme-dark 分支。

---

## 三、UI 元素映射表

### 3.1 行内格式化

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **粗体** normal | color | `--accent-bold` | ✅ |
| **粗体** hover | color | 不变色（保持 accent-bold） | ✅ |
| **粗体** hover | border-bottom | color-mix(primary, transparent 70%) | ✅ |
| **粗体** hover | text-shadow | `--glow-shadow-text` | ✅ |
| **斜体** normal | color | `--accent-italic` | ✅ |
| **斜体** normal | background-image | wave(color-mix(accent-italic, transparent 60%)) | ✅ |
| **斜体** hover | color | 不变色（保持 accent-italic） | ✅ |
| **斜体** hover | text-shadow | `--glow-shadow-text` | ✅ |
| **删除线** normal | text-decoration-color | color-mix(primary, transparent 40%) | ✅ |
| **删除线** normal | color | `--text-muted` | ✅ |
| **删除线** hover | color | 不变色（保持 text-muted） | ✅ |
| **删除线** hover | text-shadow | `--glow-shadow-text` | ✅ |
| **高亮** normal | background-image | gradient(accent-highlight, transparent 60%) | ✅ |
| **高亮** normal | color | `--text-color` | ✅ |
| **高亮** hover | background-image | gradient(accent-highlight, transparent 20%) | ✅ |
| **高亮** hover | text-shadow | `--glow-shadow-text` | ✅ |
| **高亮** hover | box-shadow | `--glow-shadow-box` | ✅ |
| **行内代码** normal | color | `--seed-primary` | ✅ |
| **行内代码** normal | background | color-mix(primary, transparent 90%) | ✅ |
| **行内代码** normal | border | 1px solid color-mix(primary, transparent 85%) | ✅ |
| **行内代码** hover | background | `--seed-primary` | ✅ |
| **行内代码** hover | color | #fff | ✅ |
| **行内代码** hover | box-shadow | color-mix(primary, transparent 60%) | ✅ |
| **KBD** | 全部 | 亮暗各自风格 | 分开 |

### 3.2 标题 H1–H6

#### 通用 Hover 规则（亮暗统一）

| 原则 | 规则 |
|------|------|
| 文字变色 | `color: var(--heading-deep)` |
| 文字辉光 | `text-shadow: var(--glow-shadow-text)` |
| 文字位移 | `transform: translateX(5px)`（H1 居中、H2 胶囊除外：不位移） |
| 文字缩放 | 无 |

#### 逐级 Hover 规则

**H1 居中**（不位移——居中文字偏移不合适）
```css
/* 亮暗统一，一套规则 */
h1:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
}
h1:hover::after {
  width: 100%;
  box-shadow: var(--glow-shadow-box);
}
```

**H1 左对齐**
```css
/* 亮暗统一 */
h1:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
/* ::before/::after 双柱——统一 */
h1:hover::before {
  height: 32px; margin-top: 0; left: 4px;
  width: 6px; opacity: 0.4; border-radius: 3px;
}
h1:hover::after {
  height: 26px; margin-top: 0; left: 12px;
  width: 6px; border-radius: 3px;
  box-shadow: var(--glow-shadow-box);
}
```

**H2 胶囊**（不位移——全宽块元素偏移不合适）
```css
/* 亮暗统一文字行为 */
h2:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
}
/* 装饰特效——亮暗各有完全不同设计，分开保留 */
/* 亮：background-position shift + box-shadow 加深 */
/* 暗：::after 光晕显现 + box-shadow */
```

**H2 双子塔**
```css
/* 亮暗统一 */
h2:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
/* ::before/::after 结构相同，暗色多 glow */
h2:hover::after {
  background-color: var(--seed-primary);
  box-shadow: var(--glow-shadow-box);
}
```

**H3**
```css
/* 亮暗统一 */
h3:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
h3:hover::before {
  height: 24px;
  width: 7px;
  box-shadow: var(--glow-shadow-box);
}
```

**H4**
```css
/* 亮暗统一 */
h4:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
h4:hover::before {
  transform: translateY(-50%) scale(1.2);
  box-shadow: var(--glow-shadow-box);
}
```

**H5**
```css
/* 亮暗统一文字行为 */
h5:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
/* ::before 空心圆——亮暗各有独立装饰设计，分开保留 */
/* 亮：填实 + ring shadow */
/* 暗：保持空心 + glow */
```

**H6**
```css
/* 亮暗统一 */
h6:hover {
  color: var(--heading-deep);
  text-shadow: var(--glow-shadow-text);
  transform: translateX(5px);
}
h6:hover::before {
  transform: translateY(-50%) scaleX(1.5);
  text-shadow: var(--glow-shadow-text);
}
```

#### 标题静态样式（不变）

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| H1-H6 文字 | color | 亮: #000 / 暗: #fff | 分开 |
| H1 居中 ::after 下划线 | background | `--seed-primary` | ✅ |
| H1 左对齐 ::before | background | `--seed-secondary` | ✅ |
| H1 左对齐 ::after | background | `--seed-primary` | ✅ |
| H1 左对齐 blend | mix-blend-mode | 亮: multiply / 暗: screen | 分开 |
| H2 胶囊 | 整体设计 | 亮暗完全不同 | 分开 |
| H2 双柱 ::before | background | `--seed-primary` | ✅ |
| H2 双柱 ::after | background | `--seed-secondary` | ✅ |
| H3 ::before 竖条 | background | `--seed-primary` | ✅ |
| H4 ::before 圆点 | background | `--seed-primary` | ✅ |
| H5 ::before 空心圆 | border-color | `--seed-primary` | ✅ |
| H6 ::before "-" | color | `--seed-primary` | ✅ |
| H3-H6 ::after 图标 | background-color | `--seed-primary`（mask） | ✅ |
| H3-H6 ::after 底色 | background | `--heading-light` | ✅ |

### 3.3 链接

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **链接文字** | color | `--accent-italic` | ✅ |
| **链接括号** | color | `--text-muted`，opacity 0.7 | ✅ |
| **链接 hover** | background | `--deco-hover-bg` | ✅ |
| **链接 hover** | color | `--seed-primary` | ✅ |
| **链接 hover 括号** | color | `--seed-primary` | ✅ |
| **Wikilink（编辑器）** | 同上 | 同上 | ✅ |

### 3.4 列表

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **无序/有序标记** | color | `--seed-primary` | ✅ |
| **列表竖线** | border-left | 1px solid primary | ✅ |
| **bullet hover** | box-shadow | glow(primary) | ✅ |
| **缩进引导线** | color | `color-mix(primary, transparent 50%)` | ✅ |
| **活动缩进** | box-shadow | 0 0 8px primary | ✅ |

### 3.5 任务列表 / 复选框

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **未选中** bg | background | `color-mix(primary, transparent 90%)` | ✅ |
| **未选中** border | border | `color-mix(primary, transparent 50%)` | ✅ |
| **已选中** bg | background | `color-mix(primary, transparent 80%)` | ✅ 统一为半透明（fancy 版） |
| **已选中** shadow | box-shadow | `--glow-shadow-box` | ✅ |
| **勾号** | border-color | #fff | ✅ |
| **已完成文字** | color | `--text-muted` | ✅ |

### 3.6 引用块

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **背景** | background | `--deco-primary-wash` | ✅ |
| **边框** | border | 1px solid color-mix(primary, transparent 80%) | ✅ |
| **文字** | color | `--text-muted` | ✅ |
| **hover 边框** | border-color | `--seed-primary` | ✅ |
| **hover 背景** | background | `--deco-primary-subtle` | ✅ |
| **hover shadow** | box-shadow | `--glow-shadow-box` | ✅ |
| **::before emoji** | content | 亮: ✨ / 暗: 💡 | 分开 |

### 3.7 代码块

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **容器背景** | background | `--code-block-bg`（各预设定义） | ✅ |
| **容器边框** | border | color-mix(border, transparent 50%) | ✅ |
| **容器 hover** | border-color | `--seed-primary` | ✅ |
| **容器 hover** | box-shadow | color-mix(primary, transparent 85%) | ✅ |
| **头部背景** | background | `--deco-primary-subtle` | ✅ |
| **头部边框** | border-bottom | color-mix(border, transparent 70%) | ✅ |
| **头部语言名** | color | `--seed-secondary` | ✅ 统一 |
| **正文** | color | `--code-normal` | ✅ |
| **语法高亮** (10 个) | color | `--code-*`（各预设独立定义） | ✅ |
| **活动行背景** | background | `--deco-primary-subtle` | ✅ |
| **复制按钮** | color → hover | `--code-comment` → primary + #fff | ✅ |

### 3.8 表格

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **容器背景** | background | 亮: rgba(255,255,255,0.4) / 暗: rgba(255,255,255,0.02) | 分开 |
| **容器边框** | border | `--deco-border` | ✅ |
| **表头背景** | background | `--deco-primary-subtle` | ✅ |
| **表头文字** | color | `--seed-primary` | ✅ |
| **表头边框** | border | color-mix(primary, transparent 80%) | ✅ |
| **行 hover** | background | 亮: rgba(0,0,0,0.03) / 暗: rgba(255,255,255,0.03) | 分开 |
| **单元格 hover** | background | `--deco-primary-light` | ✅ |
| **单元格 hover** | color | `--seed-primary` | ✅ |
| **单元格 hover** | box-shadow | inset 0 0 0 1px primary | ✅ |
| **单元格 hover** | text-shadow | `--glow-shadow-text` | ✅ |
| **拖拽手柄** | background | color-mix(border, transparent 70%) | ✅ |

### 3.9 水平线

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **线条** | background | gradient(transparent → primary → transparent) | ✅ |
| **菱形边框** | border | 2px solid primary | ✅ |
| **菱形背景** | background | `--seed-bg` | ✅ |
| **hover 菱形** | background + shadow | primary + `--glow-shadow-box` | ✅ |

### 3.10 标签

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **文字** | color | `--accent-bold` | ✅ |
| **背景** | background | color-mix(accent-bold, transparent 85%) | ✅ |
| **边框** | border | color-mix(accent-bold, transparent 50%) | ✅ |
| **hover 边框** | border-color | `--accent-bold` | ✅ |

### 3.11 选区 / 编辑器

| 元素 | 属性 | 值 | 统一？ |
|------|------|-----|--------|
| **文字选区** | background | `--deco-selection` | ✅ |

---

## 四、「必须分开」完整清单

仅以下项目保留亮暗分支，其余全部统一：

| # | 元素 | 亮色 | 暗色 | 原因 |
|---|------|------|------|------|
| 1 | 正文色 | #2d2d2d | 各预设近白 | 对比方向相反 |
| 2 | 次要文字色 | #6b6b6b | 各预设浅灰 | 对比方向相反 |
| 3 | 极弱文字色 | #999 | #555 | 对比方向相反 |
| 4 | 标题文字色 | #000 | #fff | 对比方向相反 |
| 5 | 辉光系统 | 柔影 | 霓虹 glow | 核心审美差异 |
| 6 | H1 左对齐 blend | multiply | screen | 混合模式天然相反 |
| 7 | H2 胶囊装饰特效 | 渐变实底 | 半透明径向光 | 两套不同设计语言 |
| 8 | H5 ::before hover | 填实 | 保持空心+glow | 亮暗各有独立设计 |
| 9 | bg-hover | rgba(0,0,0,0.05) | rgba(255,255,255,0.05) | 加深 vs 提亮 |
| 10 | 表格容器背景 | rgba 白 0.4 | rgba 白 0.02 | 磨砂 vs 浮层 |
| 11 | 表格行 hover | rgba(0,0,0,0.03) | rgba(255,255,255,0.03) | 加深 vs 提亮 |
| 12 | KBD 键帽 | 立体拟物 | 扁平 | 两套独立设计 |
| 13 | 引用 emoji | ✨ | 💡 | 审美选择 |
| 14 | bg-primary 派生 | mix(bg, white 2%) | = bg | 方向不同 |
| 15 | bg-secondary 派生 | mix(bg, white 5%) | mix(bg, black 15%) | 方向不同 |

---

## 五、变量消除清单

| 旧变量 | 替代为 | 原因 |
|--------|--------|------|
| `--light-deep` | `--heading-deep` | 语义不清，且已统一派生 |
| `--light-light` | `--heading-light` | 同上 |
| `--light-lighter` | 删除，用 `--glow-shadow-box` | 功能合并入辉光系统 |
| `--light-pale` | 删除 | 未使用 |
| `--text-bold` | `--accent-bold` | 统一亮暗 |
| `--text-italic` | `--accent-italic` | 统一亮暗 |
| `--text-highlight` | `--accent-highlight` | 统一亮暗 |
| `--text-color`（亮色色调版） | #2d2d2d | 中性正文 |
| `--text-color-secondary`（亮色色调版） | #6b6b6b | 中性灰 |
| `--glow-color` | `--deco-glow` | 从种子派生，不需预设单独定义 |
| `--select-text-bg-color` | `--deco-selection` | 从种子派生 |
| `--hover-background-color` | `--deco-hover-bg` | 从种子派生 |
| `--link-hover-color` | `--seed-primary` | 直接用种子 |
| `--bold-light/dark-color` | Style Settings 直接绑 `--accent-bold` | 简化 |
| `--italic-light/dark-color` | Style Settings 直接绑 `--accent-italic` | 简化 |
| `--highlight-light/dark-color` | Style Settings 直接绑 `--accent-highlight` | 简化 |
| `--h2-bg-gradient` | 从 primary + heading-light 派生 | 不需预设单独定义 |
| `--h1-underline-color` | `--seed-primary` | 直接用种子 |
| `--h2-shadow-color/hover` | 从 primary 派生 | 不需预设单独定义 |
| `--border-color`（各预设硬编码） | `--deco-border`（统一派生） | 消除预设冗余 |

---

## 六、预设精简

### 重构后预设结构

```css
/* 亮色预设示例 */
body.theme-light.theme-light-sakura {
  --seed-primary: #ff7096;
  --seed-secondary: #bd93f9;
  --seed-bg: #fff7fa;
  --code-block-bg: #faf0f3;
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

/* 暗色预设示例 */
body.theme-dark.theme-dark-vampire {
  --seed-primary: #ff5555;
  --seed-secondary: #bd93f9;
  --seed-bg: #282a36;
  --text-color: #f8f8f2;           /* 暗色需要单独定义 */
  --text-color-secondary: #d0d0d0;  /* 暗色需要单独定义 */
  --code-block-bg: #282a36;
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

亮色预设：3 种子 + 9 代码色 = **12 行**（旧 ~25 行）
暗色预设：3 种子 + 2 文字色 + 9 代码色 = **14 行**（旧 ~25 行）

---

## 七、Style Settings 用户自定义（6 个覆盖项）

| 设置项 | 覆盖目标 | 默认值 |
|--------|---------|--------|
| 主题色 | `--seed-primary` | 跟随预设 |
| 对比强调色 | `--seed-secondary` | 跟随预设 |
| 粗体色 | `--accent-bold` | 跟随派生 |
| 斜体色 | `--accent-italic` | 跟随派生 |
| 高亮色 | `--accent-highlight` | 跟随派生 |
| 背景色 | `--seed-bg` | 跟随预设 |

亮暗共用同一套设置（不分开），因为派生公式相同。

---

## 八、保持不变的部分

- **Callout 颜色**：保持硬编码，不纳入变量系统
- **代码语法色**：各预设独立定义，不从种子派生
- **UI 外壳**：侧栏、标签栏、状态栏等保持 Obsidian 默认
- **Mermaid、脚注、数学公式**：保持现状
