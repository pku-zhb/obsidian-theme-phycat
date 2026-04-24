# Phycat 主题：完整着色对象清单

> 用于设计颜色变量映射表的基础文档。
> 每个元素标注：当前 Phycat 是否已着色、用了什么变量/硬编码值、哪些属性需要纳入变量系统。

状态标记：
- ✅ 已着色（变量化）
- ⚠️ 已着色（硬编码，需变量化）
- ❌ 未着色（继承默认或未覆盖）
- 🔶 部分着色

---

## 一、内容区 —— 行内格式化

| 元素 | 状态 | 颜色属性 | Phycat 当前实现 | 备注 |
|------|------|---------|----------------|------|
| **粗体** | ✅ | text | `--text-bold`（亮），`--bold-dark-color` fallback `--primary-color`（暗） | hover 用 `--primary-color` |
| **斜体** | ✅ | text, background-image（波浪纹） | `--text-italic`（亮），`--italic-dark-color` fallback `--secondary-color`（暗） | 波浪纹用 color-mix 派生 |
| **粗斜体** | 🔶 | text | 组合 bold + italic，无独立控制 | 可能需要优先级规则 |
| **删除线** | ✅ | text, text-decoration-color | 亮：color-mix(primary, transparent 40%)；暗：`--primary-color` | hover 有动画 |
| **高亮 ==mark==** | ✅ | background-image（渐变）, box-shadow | `--text-highlight`（亮暗各一套） | 亮暗模式都有 hover 展开效果 |
| **行内代码** | ✅ | text, background, border | color-mix(primary, transparent 90%) | hover 变色+缩放 |
| **上标/下标** | ❌ | text | 继承正文色 | 通常不需要独立着色 |

## 二、内容区 —— 标题 H1–H6

每级标题有 3 层着色：文字色 + 装饰元素(::before/::after) + hover 动画

| 元素 | 状态 | Phycat 实现 | 装饰 | hover |
|------|------|------------|------|-------|
| **H1（居中）** | ✅ | `--h1-color`（亮/暗各一） | ::after 下划线渐变 | 变色+上移+下划线展开 |
| **H1（左对齐）** | ✅ | `--h1-color` | ::before+::after 双色柱（secondary+primary） | 柱体 glow |
| **H2（胶囊）** | ✅ | #fff 文字 | 渐变背景 `--h2-bg-gradient` | 渐变位移+缩放+阴影 |
| **H2（双子塔）** | ✅ | 继承 | ::before primary 5px + ::after secondary 2px | 双柱动画 |
| **H3** | ✅ | 继承 | ::before `--primary-color` 竖条 5px | 竖条增长+glow |
| **H4** | ✅ | 继承 | ::before `--primary-color` 实心圆 | 圆点放大 |
| **H5** | ✅ | 继承 | ::before 空心圆（border primary） | 空心填充 |
| **H6** | ✅ | 继承 | ::before "-" 字符 `--primary-color` | 破折号拉伸 |
| **H3-H6 hover 色** | ⚠️ | 用 `--light-deep`（语义不清） | — | 需改为语义变量 |

**装饰颜色依赖：**
- primary-color → H3/H4/H5/H6 装饰、H1 下划线、H2 双子塔左柱
- secondary-color → H1 左对齐左柱、H2 双子塔右柱
- light-deep → H3-H6 hover 色（仅亮色模式）
- light-light → H2 渐变中段
- light-lighter → H3 hover 外环阴影
- glow-color → 暗色模式所有标题 hover 辉光

## 三、内容区 —— 链接

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **内部链接（阅读模式）** | ✅ | 亮：`--text-italic`；暗：`--secondary-color`；::before/::after 方括号装饰 |
| **内部链接 hover** | ✅ | 背景 color-mix(primary, 90% transparent)，文字 `--primary-color`，括号弹开动画 |
| **Wikilink（编辑模式）** | ✅ | 同上（class-toggle 控制） |
| **Wikilink 别名** | ✅ | 光标进入时隐藏装饰括号 |
| **外部链接** | 🔶 | 继承内部链接样式，无独立区分 |
| **未解析链接** | ❌ | 未覆盖（用 Obsidian 默认） |
| **链接 hover 预览** | ❌ | 未覆盖 |

## 四、内容区 —— 列表

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **无序列表标记** | ✅ | `--primary-color` 圆点（::after 替换） |
| **无序列表 hover** | ✅ | 圆点放大 + glow |
| **有序列表数字** | ✅ | `--primary-color`，Cascadia Code 字体 |
| **任务列表 unchecked** | ✅ | `--checkbox-bg-unchecked`（color-mix 派生） |
| **任务列表 checked** | ✅ | `--checkbox-bg-checked` + glow shadow |
| **任务 "/" 半选** | ✅ | 特殊颜色 |
| **任务 "-" 取消** | ✅ | 灰化 + 删除线 |
| **缩进引导线** | ✅ | color-mix(primary, white 50%) |
| **活动缩进** | ✅ | box-shadow: `--primary-color` |

## 五、内容区 —— 引用

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **引用块（亮色）** | ✅ | 背景 `--blockquote-background-color`，边框 color-mix(primary, 80% transparent) |
| **引用块（暗色）** | ✅ | 背景 rgba(0,0,0,0.2)，边框 color-mix(secondary, 70% transparent) |
| **引用块 hover** | ✅ | 亮：缩放+阴影；暗：边框变 primary + glow |
| **嵌套引用** | ❌ | 无层级区分 |

## 六、内容区 —— 代码

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **行内代码** | ✅ | 见上方行内格式化 |
| **代码块背景** | ✅ | `--code-background` |
| **代码块边框** | ✅ | color-mix(border, 50% transparent) |
| **代码块头部（语言标签）** | ✅ | color-mix(primary, 94-96% transparent) |
| **代码块 hover** | ✅ | 边框变 `--primary-color` + shadow |
| **语法高亮 - keyword** | ✅ | `--code-keyword`（每个预设独立定义） |
| **语法高亮 - function** | ✅ | `--code-function` |
| **语法高亮 - string** | ✅ | `--code-string` |
| **语法高亮 - comment** | ✅ | `--code-comment` |
| **语法高亮 - value/number** | ✅ | `--code-value` |
| **语法高亮 - operator** | ✅ | `--code-operator` |
| **语法高亮 - property** | ✅ | `--code-property` |
| **语法高亮 - punctuation** | ✅ | `--code-punctuation` |
| **语法高亮 - tag** | ✅ | `--code-tag` |
| **语法高亮 - normal** | ✅ | `--code-normal` |
| **CSS nesting 问题** | ⚠️ | L649-694 用了 CSS nesting，需展开 |

## 七、内容区 —— 表格

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **表格容器** | ✅ | 边框 `--border-color`，背景 `--table-bg`，圆角 |
| **表头** | ✅ | 背景 `--table-th-bg`（color-mix），文字 `--primary-color` |
| **表体单元格** | ✅ | 边框 `--table-border-inner` |
| **行 hover** | ✅ | 背景 `--table-row-hover-bg` |
| **单元格 hover** | ✅ | inset shadow `--primary-color`，暗色模式 text-shadow glow |
| **拖拽手柄** | ✅ | color-mix(border, 70% transparent) |
| **斑马纹** | ❌ | 未实现 |

## 八、内容区 —— 其他块元素

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **水平线 HR** | ✅ | 渐变 transparent→primary→transparent + ::after 菱形装饰 |
| **HR hover** | ✅ | 菱形填充 primary + glow |
| **脚注** | ❌ | 未覆盖 |
| **数学公式 $...$** | ❌ | 未覆盖（继承默认） |
| **数学公式块 $$** | ❌ | 未覆盖 |

## 九、内容区 —— 标签

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **标签文字（亮色）** | ✅ | `--text-bold` |
| **标签背景（亮色）** | ✅ | color-mix(text-bold, white 85%) |
| **标签边框（亮色）** | ✅ | color-mix(text-bold, white 50%) |
| **标签（暗色）** | ✅ | color-mix(primary, transparent 85%) |
| **标签 hover** | ✅ | 加深 |

## 十、Callouts（标注框）

**22 种类型，亮暗各一套，全部硬编码 ⚠️**

| 类型 | 亮色边框/背景 | 亮色标题色 | 暗色边框/背景 | 暗色标题色 |
|------|-------------|-----------|-------------|-----------|
| note | rgba(48,107,214,0.1) | #6c5ce7 | rgba(189,147,249,0.1) | #bd93f9 |
| tip/hint | rgba(0,184,148,0.1) | #00b894 | rgba(139,233,253,0.1) | #8be9fd |
| info | rgba(48,107,214,0.1) | #6c5ce7 | rgba(116,192,252,0.1) | #74c0fc |
| warning/caution | rgba(253,203,110,0.15) | #e17055 | rgba(255,184,108,0.1) | #ffb86c |
| important | rgba(255,118,117,0.12) | #ff7675 | rgba(255,85,85,0.1) | #ff5555 |
| danger/error | rgba(214,48,49,0.15) | #d63031 | rgba(255,85,85,0.1) | #ff5555 |
| bug | rgba(214,48,49,0.08) | #d63031 | rgba(255,85,85,0.1)⚠️被*/截断 | #ff5555 |
| success/done | rgba(85,239,196,0.15) | #00b894 | rgba(85,239,196,0.1) | #55efc4 |
| example | rgba(162,155,254,0.15) | #6c5ce7 | rgba(255,121,198,0.1) | #ff79c6 |
| quote/cite | rgba(178,190,195,0.15) | #636e72 | rgba(223,230,233,0.05) | #dfe6e9 |
| failure/missing | rgba(45,52,54,0.05) | #c0392b | rgba(179,57,57,0.3) | #fab1a0 |
| question/faq/help | rgba(253,203,110,0.15) | #f39c12 | rgba(241,250,140,0.1) | #f1fa8c |
| abstract/summary/tldr | rgba(129,236,236,0.2) | #00cec9 | rgba(129,236,236,0.1) | #81ecec |
| todo | rgba(48,107,214,0.1) | #6c5ce7 | rgba(80,250,123,0.1) | #50fa7b |

> **约 130 行硬编码颜色**，不跟随主题预设。REFACTOR-SPEC 建议延后处理。

## 十一、Mermaid 图表

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **节点填充** | ✅ | color-mix(primary, transparent 90%) |
| **节点描边** | ✅ | `--primary-color` |
| **多边形填充** | ✅ | color-mix(secondary, transparent 85%) |
| **标签文字** | ✅ | `--mermaid-text-color` |
| **连线** | ⚠️ | 硬编码 #999 |
| **边标签背景** | ⚠️ | 硬编码 #2e2e2e |
| **滚动条** | ✅ | track: rgba; thumb: primary; hover: secondary |

## 十二、UI 外壳

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **模态框** | ✅ | `--background-primary` + `--border-color`，圆角 16px |
| **代码复制按钮** | ✅ | hover: `--primary-color` 背景 + 白色文字 |
| **编辑器活动行** | ✅ | 亮：color-mix(primary, 94% transparent)；暗：rgba(255,255,255,0.05) |
| **侧栏** | ❌ | 未覆盖（继承 Obsidian 默认） |
| **标签栏/Tabs** | ❌ | 未覆盖 |
| **文件管理器** | 🔶 | 仅彩虹文件夹功能（Style Settings toggle） |
| **搜索面板** | ❌ | 未覆盖 |
| **状态栏** | ❌ | 未覆盖 |
| **Ribbon** | ❌ | 未覆盖 |
| **标题栏** | ❌ | 未覆盖 |
| **滚动条** | ❌ | 未覆盖（Mermaid 区域除外） |
| **右键菜单** | ❌ | 未覆盖 |
| **命令面板** | ❌ | 未覆盖 |
| **工具提示** | ❌ | 未覆盖 |

## 十三、编辑器元素（CodeMirror 6）

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **光标** | ❌ | 未覆盖 |
| **选区背景** | ✅ | `--select-text-bg-color`（每个预设定义） |
| **行号** | ❌ | 未覆盖 |
| **折叠标记** | ❌ | 未覆盖 |
| **括号匹配** | ❌ | 未覆盖 |
| **搜索高亮** | ❌ | 未覆盖 |
| **格式化标记** | 🔶 | 部分覆盖（代码 backtick 的 opacity） |
| **缩进引导线** | ✅ | `--indentation-guide-color`（color-mix 派生） |

## 十四、图片/嵌入

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **图片圆角** | ✅ | 8px/12px，box-shadow |
| **嵌入块** | ❌ | 未覆盖 |

## 十五、Properties / Frontmatter

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **属性面板** | ❌ | 未覆盖 |

## 十六、图谱视图

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **图谱节点/连线** | ❌ | 未覆盖 |

## 十七、Canvas

| 元素 | 状态 | Phycat 实现 |
|------|------|------------|
| **画布背景/卡片** | ❌ | 未覆盖 |

---

## 关键发现

### 1. 颜色系统的"根"变量

Phycat 当前所有颜色都从这几个根变量派生：

| 根变量 | 语义 | 派生范围 |
|--------|------|---------|
| `--primary-color` | 主题主色 | 标题装饰、列表标记、行内代码、表头、边框、hover 效果、glow、checkbox、缩进线… |
| `--secondary-color` | 次要强调 | H1 左柱、H2 右柱、暗色链接/斜体、Mermaid 多边形 |
| `--bg-color` | 背景 | background-primary 派生 |
| `--text-color` | 正文 | text-normal 派生 |
| `--text-color-secondary` | 次要文字 | text-muted 派生 |
| `--light-deep` | 深强调（仅亮色） | H3-H6 hover、标签 |
| `--light-light` | 浅强调（仅亮色） | H2 渐变中段 |
| `--light-lighter` | 更浅强调（仅亮色） | H3 hover 外环 |
| `--light-pale` | 极浅（仅亮色） | 未见引用 |
| `--glow-color` | 辉光（仅暗色） | 所有 hover glow 效果 |
| `--link-hover-color` | 链接 hover | 部分 hover 规则 |
| `--text-bold` | 粗体色 | 粗体文字、标签 |
| `--text-italic` | 斜体色 | 斜体文字、亮色链接 |
| `--text-highlight` | 高亮色 | 高亮标记 |

### 2. 命名问题

- `--light-deep` / `--light-light` / `--light-lighter` / `--light-pale` 语义不清，需要重命名
- `--secondary-color` 承担了太多角色（链接、斜体、H2装饰），需要拆分
- `--text-bold` / `--text-italic` 是本轮新增的，命名清晰，可保留

### 3. 亮暗不对称

| 变量 | 亮色模式 | 暗色模式 |
|------|---------|---------|
| `--text-bold` | ✅ 每个预设定义 | ❌ 缺失 |
| `--text-italic` | ✅ 每个预设定义 | ❌ 缺失 |
| `--light-deep/light/lighter/pale` | ✅ 4 级 | ❌ 无对应 |
| 引用块 hover | ✅ 缩放+阴影 | ✅ 边框+glow（不同效果） |
| H2 capsule | ✅ 渐变背景 | ✅ 半透明+边框（不同效果） |

### 4. 需要变量化的硬编码颜色（按优先级）

1. **Callout 颜色**（~130 行，22 种 × 亮暗）— 最大的硬编码块
2. **Mermaid 连线/标签**（#999, #2e2e2e）
3. **暗色 H1 下划线 glow**（rgba(255, 85, 85, 0.4)）
4. **删除线 hover 色**（#ff5555 亮色模式）
5. **任务列表颜色**（部分 hardcoded #888, #ffffff）

### 5. 重构范围建议

**Phase 1 必须做（颜色系统核心）：**
- 重新定义根变量（~15 个种子色）
- 定义派生规则（~20 个派生色）
- 重写 11 个预设
- 修复亮暗不对称

**Phase 1 可以延后：**
- Callout 颜色变量化（独立子系统，工作量大）
- UI 外壳着色（侧栏、标签栏等 — 目前用 Obsidian 默认也 OK）
- 图谱/Canvas/Properties（使用频率低）
