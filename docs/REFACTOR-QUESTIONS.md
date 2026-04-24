# Phycat 重构：待决设计问题

新 session brainstorm 前需要想清楚的问题。

---

## 一、颜色系统架构

### 1. 亮暗模式用一套变量还是两套？
- **方案 A：一套变量，两套值** — `--color-primary` 在亮色预设里是 `#ff7096`，在暗色预设里是 `#ff5555`。用户切换模式时变量值自动跟着换。Style Settings 只需一组颜色选择器。
- **方案 B：两套变量** — `--color-primary-light` 和 `--color-primary-dark` 分开定义。用户可以精确控制亮暗模式的每个颜色。但 Settings 面板复杂度翻倍。
- **方案 C：一套变量 + 亮暗模式各一个预设选择器** — 当前主题的做法。亮色选 Sakura，暗色选 Vampire，各自独立。变量名相同但值不同。
- **需要决定：** 用户是否需要独立控制亮暗模式的颜色？还是说选一个亮色预设 + 一个暗色预设就够了？

### 2. "种子色"定几个？
用户需要手动选的颜色越少越好，但太少会限制灵活性。候选：
- **最少 3 个**：primary（主强调）、secondary（次强调）、bg（背景）→ 其他全派生
- **推荐 5 个**：primary、secondary、bg、text、accent → 覆盖 90% 场景
- **完整 8 个**：加上 link、tag、highlight → 100% 控制
- **需要决定：** 默认暴露几个？高级用户可以展开更多？

### 3. 派生色的算法用什么？
- `color-mix(in srgb, ...)` — 当前主题用的，兼容性好
- `color-mix(in oklch, ...)` — 感知均匀色彩空间，混色结果更自然，但旧版 Obsidian 可能不支持
- `hsl()` / `hwb()` 手动计算 — 更精确但更复杂
- **需要决定：** 兼容性优先还是色彩质量优先？

### 4. 派生关系需要穷举定义
每个 UI 元素的每个状态用哪个颜色、怎么派生，需要一张完整的映射表。例如：

```
H3 竖条
  ├── 正常：primary, opacity 0.8
  ├── hover：primary, opacity 1, height +
  └── hover 光环：primary + 85% white (box-shadow)

链接
  ├── 正常：secondary
  ├── hover 文字：primary
  ├── hover 背景：primary + 90% transparent
  ├── 装饰括号：text-muted
  └── hover 括号：primary, bold

高亮
  ├── 正常背景：highlight + 60% transparent (gradient)
  ├── hover 背景：highlight + 40% transparent (gradient 100%)
  └── 暗色文字：highlight + 20% white
```

这张表很大，但不列清楚，实现时一定会乱。

---

## 二、预设系统

### 5. 预设的粒度？
- **方案 A：完整预设** — 每个预设定义所有种子色（当前做法）
- **方案 B：分层预设** — "色调预设"（只定义 primary hue）+ "风格预设"（只定义亮暗度/饱和度）可以组合
- **方案 C：只提供种子色预设** — 预设只设 3-5 个种子色，其他全派生
- **需要决定：** 代码预设（code syntax colors）是否跟随主预设，还是独立选择？

### 6. 预设是否包含非颜色属性？
当前的"预设"里混了一些非颜色的东西（比如 H2 的 `text-shadow`、border-radius）。重构后是否严格分离"颜色预设"和"布局/效果预设"？

### 7. 预设 class 名要不要改？
- 当前：`theme-light-sakura`、`theme-dark-vampire`
- 审查建议：**不要改**，否则所有现有用户的 Style Settings 配置失效
- **需要决定：** 是否接受这个限制？还是愿意在 changelog 里说明一次性迁移？

---

## 三、迁移与兼容

### 8. 旧变量名怎么处理？
- **方案 A：别名过渡** — 保留 `--primary-color: var(--color-primary)` 至少一个版本
- **方案 B：一刀切** — 直接替换，发 changelog
- **方案 C：永久保留旧名** — 旧名作为别名永远存在
- **需要决定：** 这个主题的用户群有多大？有多少人写了自定义 CSS snippet 引用这些变量？

### 9. Callout 颜色纳入还是延后？
- 当前有 22 种 callout，每种有独立的边框、背景、标题颜色（共 ~130 行）
- 全部纳入变量系统 → 工作量大但完整
- 延后 → 保持现有硬编码，以后再说
- **需要决定：** 是否在这次重构范围内？

### 10. !important 清理的时机？
- 审查建议延后，作为独立项目
- 但如果颜色系统重构后选择器设计更合理，可能自然消除一部分
- **需要决定：** Phase 1/2 做完后评估残留的 !important 数量，再决定是否继续？

---

## 四、用户体验

### 11. Style Settings 面板结构？
建议分层：
```
🎨 颜色设置
  ├── 配色方案选择（亮色/暗色各一个 class-select）
  ├── 🔑 核心颜色（3-5 个，默认展开）
  │     primary / secondary / bg / text / accent
  ├── 📝 语法标记颜色（折叠）
  │     bold / italic / highlight / link / tag
  ├── 💻 代码颜色（折叠）
  │     keyword / function / string / ...
  └── 🎯 高级 / 派生色覆盖（折叠）
        border / glow / shadow / selection / ...
```
- **需要决定：** 这个层级结构合理吗？

### 12. 颜色选择器的默认值策略？
- Style Settings `variable-color` 总会有一个默认值
- 如果用户不改，是用默认值还是用预设值？
- `var(--user-override, var(--preset-value))` 这种嵌套 fallback 在 Style Settings 里能正确工作吗？
- **需要验证：** 小规模测试 Style Settings 的变量优先级行为

---

## 五、技术边界

### 13. color-mix() 兼容性？
- Obsidian desktop 用 Electron（Chromium 内核），`color-mix()` 从 Chrome 111 开始支持
- Obsidian mobile 的 WebView 版本取决于设备系统
- 当前主题已经大量使用 `color-mix()`，说明作者认为兼容性 OK
- **需要确认：** 是否需要为不支持 `color-mix()` 的环境提供 fallback？

### 14. CSS 自定义属性的性能？
- 重构后可能有 50+ CSS 变量在 `:root` / `body` 上
- 每次变量变化会触发大范围重绘
- **需要评估：** 实际使用中是否有性能问题？（可能需要在低配设备上测试）

### 15. Style Settings 的能力边界？
- `variable-color` 能否支持 `color-mix()` 输出？（应该不能，它只输出 hex）
- `class-select` 最多能有多少选项？
- 嵌套 `var()` fallback 在 Style Settings 里是否正常工作？
- **需要验证：** 写一个最小测试用例确认行为

---

## 行动建议

新 session 的 brainstorm 顺序：
1. 先定 **Q1**（一套还是两套）和 **Q2**（几个种子色）— 这决定了整个架构
2. 然后定 **Q4**（派生关系映射表）— 这是工作量最大的设计工作
3. 再定 **Q5-Q7**（预设系统）
4. 最后处理 **Q8-Q12**（迁移和 UX）
5. **Q13-Q15** 可以边做边验证
