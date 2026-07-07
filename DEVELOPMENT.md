# Phycat Development Notes

## Source of Truth

Do not edit `theme.css` or `dist/theme.css` directly.

Those files are generated artifacts. All CSS changes must start from the
segmented source files under:

```text
src/sections/
```

The build order is defined by:

```text
src/manifest.txt
```

If a later agent needs to change Phycat, the correct workflow is:

1. Locate the relevant segment in `src/sections/`.
2. Edit only that segment file.
3. If a new segment is needed, add it to `src/manifest.txt` in the intended order.
4. Rebuild the generated CSS files.
5. Compare or deploy the generated files only after the section build is correct.

## Build

Run these commands from the package root:

```sh
bun scripts/build-theme.mjs --out theme.css
bun scripts/build-theme.mjs --out dist/theme.css
```

Then validate the generated theme:

```sh
bun scripts/check-theme.mjs theme.css
git diff --check
```

## Deployment Boundary

Development source lives in this package. Installed Obsidian theme folders should
receive generated output only:

```text
theme.css
manifest.json
```

For the local dev vault, it is acceptable to sync `src/` and `scripts/` as a
working copy, but the production vault should not be treated as the source of
truth.

## Recovery Only

`scripts/split-theme.mjs` is a recovery tool for intentionally splitting a known
good monolithic `theme.css` back into sections. Do not use it as the normal
editing path.

If `theme.css` and `src/sections/` diverge, inspect the section source first.
Only make the monolithic file the source of truth when the user explicitly says
the installed visual state should override the package source.
