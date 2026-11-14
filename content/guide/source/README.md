# Workbook sources

The four shop workbooks are built from these HTML files and printed to PDF with headless Chrome.

- `vision-board.html` is hand-written; `style.py`, `declutter.py` and `color.py` generate their HTML (helpers in `wb.py`).
- Shared look: `workbook.css` (DM Serif Display headings, Inter body, brand colors). Each workbook sets its own `--accent`.
- To rebuild one: `python3 style.py`, then print `style.html` to PDF at 8.5 x 11 in with backgrounds on.
- Output goes to `content/guide/pdfs/*-Workbook-AH.pdf`, which the shop delivers (see `lib/shop.ts`).
