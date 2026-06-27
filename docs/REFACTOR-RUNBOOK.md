# Phycat CSS Refactor Runbook

## Scope

Structural changes are staged in the Lab copy first, then promoted to this production theme directory after visual review.

## Phase Order

1. Phase 0: record the current `theme.css` baseline.
2. Phase 1: split `theme.css` into ordered source sections and prove the build is byte-identical.
3. Phase 2: clean the token and Obsidian bridge layer only where the fix is explicit and low risk.
4. Phase 3: remove local duplication and fix selector boundaries by module.

Do not start broad `!important` reduction until Phase 4.

## Lab Phase 3 Notes

- Kept the generated `theme.css` workflow: edit `src/sections/`, then rebuild.
- Fixed resolved-token bridge references from old `--primary-color` to `--_primary`.
- Removed unsafe `--text-muted` self references in the Obsidian bridge layer.
- Removed duplicate task-list and table-header rules.
- Scoped H2 reading hover selectors to `body` classes.
- Fixed the layout-cards left split selector so it targets `.workspace-split.mod-left-split`.
- Deferred `rainbow-folders` boundary cleanup because the active workflow uses Not Navigator instead of Obsidian's built-in File Explorer; built-in file explorer styling is not on the critical path.

## Commands

Run the splitter only when bootstrapping from the original single-file baseline. After Phase 1, treat `src/sections/` as the source of truth.

```bash
bun ./scripts/split-theme.mjs
bun ./scripts/build-theme.mjs --out /tmp/phycat-theme.css
bun ./scripts/check-theme.mjs /tmp/phycat-theme.css --against theme.css
```

When editing after Phase 1, update files under `src/sections/`, then rebuild:

```bash
bun ./scripts/build-theme.mjs --out theme.css
bun ./scripts/check-theme.mjs theme.css
```
