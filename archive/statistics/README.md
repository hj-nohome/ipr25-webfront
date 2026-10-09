# Statistics page (archived)

The standalone Statistics page (a searchable grid of every report figure,
opening each as a chart or table in a slide-in modal) is no longer linked from
the site or included in `vite build`. It's kept here, still working, for
reference and for reusing its charts in chapter.html's Key Highlights 2025.

## Viewing it

`npm run dev`, then open `/archive/statistics/statistics.html`. It reuses the
site's `src/main.js` and `src/style.css`, so it looks as it did live.

## What's here

| File | Contents |
| --- | --- |
| `statistics.html` | Page markup: nav, filters, search, figure grid, modal |
| `statistics.js` | Grid, filters, search, modal, and the Chart.js setup: entrance animations (bar stagger, line reveal), axis-break plugin, tables, multi-panel figures |
| `value-labels.js` | Chart.js plugin for always-on value labels |
| `statistics.css` | Figure grid, modal, panel and table styles, moved out of `src/style.css` |
| `data/figures.generated.js` | Every figure's chart/table data and the chapter palettes |
| `data-extraction/` | Source of that data: `figures-data.json`, the Excel workbook, and `build.py` |

## Reusing a chart elsewhere

Most of `statistics.js` is page-specific (grid, filters, modal). The parts a
chapter page would need are `createChart`, `playEntrance`, `revealPlugin`,
`barBreakPlugin` and `tableHtml`. They read `activeCharts` and the
`Chart.defaults` set at the top of the file, and they need `value-labels.js`
plus `.figure-panel*` / `.figure-table*` from `statistics.css`. Move those
into `src/` and import them where needed. `chart.js` is still a dependency.

## Updating the data

Edit `data-extraction/figures-data.json`, then run
`python archive/statistics/data-extraction/build.py` (needs `openpyxl`). It
rewrites the workbook and `data/figures.generated.js`.
