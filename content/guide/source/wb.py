"""Tiny helpers for building Abundant Home workbooks as HTML pages."""

ARCHES = ('<svg viewBox="0 0 460 560" width="100%" height="100%" style="position:absolute;inset:0" fill="none" '
          'stroke="currentColor" stroke-opacity="0.55" stroke-width="1.2">'
          '<path d="M65 435 V230 A165 165 0 0 1 395 230 V435"/><path d="M130 435 V255 A100 100 0 0 1 330 255 V435"/></svg>')


def doc(title, accent, on_accent, pages):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title} · Abundant Home</title>
<link rel="stylesheet" href="workbook.css">
<style>:root {{ --accent: {accent}; --on-accent: {on_accent}; }}</style>
</head>
<body>
{"".join(pages)}
<script>
document.querySelectorAll('.lines').forEach(el => {{
  const n = Math.floor(el.getBoundingClientRect().height / 30);
  el.innerHTML = '<b></b>'.repeat(n);
}});
</script>
</body>
</html>
'''


def cover(title, sub, line):
    return f'''<section class="page cover">
  <div class="art arch" style="color:var(--on-accent)">{ARCHES}<p>{line}</p></div>
  <div class="title"><h1>{title}</h1><div class="sub">{sub}</div></div>
  <div class="brand"><img src="ah-monogram-water.png" alt=""><div>Nancy Swanton &nbsp;·&nbsp; Abundant Home</div></div>
</section>
'''


def page(n, short, inner, cls="page"):
    return f'''<section class="{cls}">
{inner}
  <div class="foot"><span>Abundant Home</span><span>{short} · {n}</span></div>
</section>
'''


def part(n, eyebrow, h):
    return (f'<div class="part-head"><div class="badge arch">{n}</div>'
            f'<div class="t"><div class="eyebrow">{eyebrow}</div><h2>{h}</h2></div></div>')


def label(t, top=0):
    style = f' style="margin-top:{top}px"' if top else ""
    return f'<div class="step-label"{style}>{t}</div>'


def ul(items):
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def ol(items):
    return "<ol>" + "".join(f"<li>{i}</li>" for i in items) + "</ol>"


def note(title, body):
    return f'<div class="note"><div class="title">{title}</div>{body}</div>'


def box(lab, h=90):
    return f'<div class="box"><div class="lab">{lab}</div><div class="lines" style="height:{h}px"></div></div>'


def grid_table(cols, rows, widths=None):
    widths = widths or [None] * len(cols)
    th = "".join(f'<th{f" style=width:{w}" if w else ""}>{c}</th>' for c, w in zip(cols, widths))
    tr = "".join("<tr>" + "<td></td>" * len(cols) + "</tr>" for _ in range(rows))
    return f'<table class="grid"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>'
