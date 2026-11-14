from wb import *

T = "The Color Workbook"
S = "Color"


def dots(*cs):
    return "".join(f'<i class="sw" style="background:{c}"></i>' for c in cs)


pages = [cover(T, "Learn it &nbsp;·&nbsp; Choose it &nbsp;·&nbsp; Use it", "Every color sends a message. Choose yours.")]

pages.append(page(1, S, f'''
<div class="eyebrow">Start here</div>
<h2>You’re a rainbow, my darling!</h2>
<p class="lede">By the end of this workbook you will have a palette of four colors for one room, chosen for what you want in your life, and a plan for where each color goes.</p>
<p>Color is the fastest way to change how a room feels, and the easiest place to go wrong. It is not only about what looks pretty. Every color carries a feeling, and when you choose with intention, your room sends a clear message about who you are becoming.</p>
<div class="facts">
  <div class="fact"><div class="k">Part 1 · Learn it</div><div class="v">15 minutes</div></div>
  <div class="fact"><div class="k">Part 2 · Choose it</div><div class="v">30 minutes</div></div>
  <div class="fact"><div class="k">Part 3 · Use it</div><div class="v">One room, one weekend</div></div>
</div>
<h3>What you need</h3>
{ul(["Your vision board and your Style Word, if you have them", "This workbook: my color wheel and sensory chart are on pages 8 and 9", "Paint chips, fabric scraps, anything with color you love", "A box or tray to collect it all in"])}
<div class="rule">Choose colors for how you want to feel,<br>not for what is in style.</div>
'''))

pages.append(page(2, S, f'''
{part(1, "Part 1 · 15 minutes", "Learn it")}
{label("Warm and cool")}
<h3 style="margin-top:0">Every color leans one way or the other</h3>
<div class="two">
<div class="box"><div class="serif" style="font-size:14pt">{dots("#c0392b", "#e67e22", "#f1c40f")} Warm</div><p style="margin:6px 0 0">Reds, oranges and yellows. They feel energetic and cozy, and they seem to come toward you. Lovely where people gather: dining rooms, kitchens, entries.</p></div>
<div class="box"><div class="serif" style="font-size:14pt">{dots("#2e86c1", "#28b463", "#7d3c98")} Cool</div><p style="margin:6px 0 0">Blues, greens and purples. They feel calm and open, and they seem to step back. Lovely where you rest or focus: bedrooms, bathrooms, offices.</p></div>
</div>
<p>Warm and cool are relative. A green can look warm next to blue and cool next to yellow. It’s all about the company a color keeps.</p>
{label("Six words that make color easy", 16)}
<table class="ref"><tbody>
<tr><td style="width:22%"><strong>Hue</strong></td><td>The color itself: red, blue, yellow.</td></tr>
<tr><td><strong>Value</strong></td><td>How light or dark it is.</td></tr>
<tr><td><strong>Saturation</strong></td><td>How intense it is. Vivid, or soft and muted.</td></tr>
<tr><td><strong>Tint</strong></td><td>A color with white added. Lighter, airier, more cheerful.</td></tr>
<tr><td><strong>Shade</strong></td><td>A color with black added. Deeper, richer, more serious.</td></tr>
<tr><td><strong>Tone</strong></td><td>A color with gray added. Calmer and easier to live with.</td></tr>
</tbody></table>
<p>You will rarely paint a wall the pure color you see on a color wheel. The magic is in the tints, shades and tones.</p>
'''))

pages.append(page(3, S, f'''
{label("How colors work together")}
<table class="ref"><tbody>
<tr><td style="width:28%"><strong>Monochromatic</strong><br>{dots("#d6eaf8", "#85c1e9", "#2e86c1", "#1b4f72")}</td><td>One color in light and dark versions. Calm and elegant.</td></tr>
<tr><td><strong>Analogous</strong><br>{dots("#f1c40f", "#a9cc35", "#28b463")}</td><td>Neighbors on the wheel. Harmonious and easy, good for growth and peace.</td></tr>
<tr><td><strong>Complementary</strong><br>{dots("#c0392b", "#28b463")}</td><td>Opposites on the wheel. Lively, each makes the other stronger.</td></tr>
<tr><td><strong>Triadic</strong><br>{dots("#c0392b", "#f1c40f", "#2e86c1")}</td><td>Three colors evenly spaced. Vibrant and balanced.</td></tr>
</tbody></table>
{label("What colors feel like", 16)}
<table class="ref"><tbody>
<tr><td style="width:28%">{dots("#c0392b")}<strong>Red</strong></td><td>Energy, strength, passion</td></tr>
<tr><td>{dots("#2e86c1")}<strong>Blue</strong></td><td>Trust, compassion, recovery</td></tr>
<tr><td>{dots("#28b463")}<strong>Green</strong></td><td>Growth, health, safety</td></tr>
<tr><td>{dots("#f1c40f")}<strong>Yellow</strong></td><td>Enlightenment, decisiveness, clarity</td></tr>
<tr><td>{dots("#95a5a6")}<strong>Gray</strong></td><td>Calm, sophisticated, formal</td></tr>
<tr><td>{dots("#1c1c1c")}<strong>Black</strong></td><td>Elegance, strength, groundedness</td></tr>
<tr><td>{dots("#ffffff")}<strong>White</strong></td><td>Freshness, purity, simplicity</td></tr>
<tr><td>{dots("#8b5e3c")}<strong>Brown</strong></td><td>Warmth, comfort, stability</td></tr>
</tbody></table>
<p>These are starting points, not rules. Culture and memory change what a color means to each of us. What matters most is how a color feels to <em>you</em>.</p>
'''))

pages.append(page(4, S, f'''
{part(2, "Part 2 · 30 minutes", "Choose it")}
{label("Step 1 · Set your intention")}
<p style="margin-top:0">Pick one room. How do you want to feel in it, and what do you want it to bring into your life? A calm bedroom? An energized office? Warm, or cool?</p>
{label("Step 2 · Find your colors", 12)}
<p>Find your desire on my color wheel (page 8) and sensory chart (page 9). Most people I work with want more of one of these four:</p>
<table class="ref"><tbody>
<tr><td style="width:24%"><strong>Money</strong></td><td>{dots("#1e8449", "#c9a46a", "#6c3483")} Green, gold, purple</td></tr>
<tr><td><strong>Love</strong></td><td>{dots("#f5b7b1", "#c39bd3", "#5dade2")} Pink, lavender, blue</td></tr>
<tr><td><strong>Serenity</strong></td><td>{dots("#aed6f1", "#a9dfbf", "#fadbd8")} Pale blue, green, pink</td></tr>
<tr><td><strong>Creativity</strong></td><td>{dots("#e67e22", "#4a235a", "#f4d03f")} Orange, deep purple, yellow</td></tr>
</tbody></table>
{label("Step 3 · Build your palette", 12)}
{ul(["<strong>One lead color.</strong> It has main character energy and sets the tone for the room.",
     "<strong>Two supporting colors</strong> that harmonize with it. Complementary for passion and prosperity, analogous for calm and growth.",
     "<strong>One neutral:</strong> white, cream, gray or beige. The eye always needs a place to rest."])}
<p>Wanting more than one thing? Give each desire its own room: green for money in your office, pink and red for love in your bedroom. Keep it simple, superstar.</p>
'''))

pages.append(page(5, S, f'''
{label("One desire, three palettes")}
<h2>Same goal, different colors</h2>
<p>Three of my clients, Molly, Debbie and Ann, all wanted more money. One wanted security and to take care of her family. One wanted independence and the finer things. One wanted the freedom to open her own flower shop. Same desire, different reasons, so each palette came out different.</p>
<p>Here is how one money palette of green, gold and purple can shift, just by changing tint and shade:</p>
<div class="palettes">
<div class="palette"><div class="chips"><i style="background:#d5e8d4"></i><i style="background:#efe2c4"></i><i style="background:#e3d7ea"></i><i style="background:#faf7f0"></i></div><div class="name">Soft, like Molly’s</div><div class="d">Tints: the same hues with white added</div></div>
<div class="palette"><div class="chips"><i style="background:#7fa98a"></i><i style="background:#c9a46a"></i><i style="background:#9c84ac"></i><i style="background:#e8e2d6"></i></div><div class="name">Mid-tone, like Debbie’s</div><div class="d">Muted, grayed tones</div></div>
<div class="palette"><div class="chips"><i style="background:#14532d"></i><i style="background:#b8860b"></i><i style="background:#4a235a"></i><i style="background:#f6f2ea"></i></div><div class="name">Bold, like Ann’s</div><div class="d">Deep, saturated shades</div></div>
</div>
<p class="pointer">These are examples to show the idea. Your palette will be your own.</p>
{note("Free tools that help", '<p style="margin:0">Once you know your colors, the free apps Coolors and Canva’s color palette generator make it easy to try combinations before you buy anything.</p>')}
'''))

pages.append(page(6, S, f'''
{part(3, "Part 3 · One room, one weekend", "Use it")}
{label("Your sofa doesn’t have to be purple")}
<p style="margin-top:0">Your palette guides every choice in the room, but your lead color doesn’t have to be on the biggest thing. A throw pillow, lilacs in a vase, a painted door or one wall can be the reminder you need that you are the queen of your world.</p>
{label("Collect it in one place", 12)}
<p>Put your palette, your paint chips and your fabric scraps in a box or on a tray. Every new piece for the room gets held up against it, and against your Style Word, before it comes home.</p>
{label("Test before you paint", 12)}
{ul(["Paint a large sample, or tape up a big swatch, on two different walls.", "Look at it in the morning, the afternoon and at night, with your lamps on.", "Live with it for a couple of days. If it still feels like your new life, paint."])}
{label("Write the plan", 12)}
<p>Fill in your palette on page 7 and your room plan on page 10. Then start with one small change this weekend.</p>
<div class="note"><p class="sign" style="margin:0 0 4px">Bask in the beauty and power of color.</p><p style="margin:0 0 4px">Want a designer’s eye on your room? Book a <strong>virtual room review</strong> with me at abundanthomedesign.com.</p><p class="mantra" style="margin:0">There is nothing you can’t do, be or have.</p></div>
'''))

pages.append(page(7, S, f'''
<div class="eyebrow">Fill-in page · Part 2</div>
<h2>My palette</h2>
<div class="box"><div class="lab">The room</div><div class="lines" style="height:30px"></div></div>
<div class="two">{box("How I want to feel here", 90)}{box("What I want this room to bring me", 90)}</div>
<div class="checks" style="display:flex;gap:30px"><div><i></i>Warm</div><div><i></i>Cool</div><div><i></i>A mix</div></div>
<h3>My four colors</h3>
<p>Color them in, or tape a paint chip in each. Write the color name or paint code underneath.</p>
<div class="swatchrow"><div><i></i>Lead color<b></b></div><div><i></i>Supporting<b></b></div><div><i></i>Supporting<b></b></div><div><i></i>Neutral<b></b></div></div>
''', "page fill"))

pages.append(page(8, S, f'''
<div class="eyebrow">Reference</div>
<h2>The Abundant Home color wheel</h2>
<p>Find the feeling you want, then look at the color around it. Opposite sides of the wheel are complements; neighbors are analogous.</p>
<div style="text-align:center"><img class="wheel" src="color-wheel.png" alt="The Abundant Home color wheel" style="display:inline-block;width:6in;height:6in"></div>
''', "page fill"))

chart = [
    ("Love &amp; relationships", [("Passion / Energy", "Red", "Bergamot / Patchouli", "Sacral / Root"), ("Trust / Wisdom", "Purple / Blue", "Jasmine / Douglas fir", "Third eye"), ("Growth / Discovery", "Blue / Green", "Wintergreen / Sage", "Heart / Throat"), ("Joy / Enthusiasm", "Orange", "Eucalyptus / Peppermint", "Solar plexus")]),
    ("Money &amp; confidence", [("Courage / Strength", "Red", "Clove / Cinnamon / Ginger", "Root / Sacral"), ("Growth / Prosperity", "Green", "Cumin / Dill", "Heart"), ("Maturity / Stability", "Deep purple", "Rosemary / Oregano", "Crown"), ("Luxury / Abundance", "Lavender / Red", "Tobacco / Leather", "Third eye")]),
    ("Serenity &amp; wisdom", [("Balance / Compassion", "Blue", "Vetiver / Magnolia", "Heart"), ("Intelligence / Honor", "Green / Yellow", "Fennel / Grapefruit", "Solar plexus"), ("Truth / Acceptance", "Deep blue purple", "Frankincense / Coriander", "Throat"), ("Fulfillment / Idealism", "Reddish purple", "Cardamom / Thyme", "Crown")]),
    ("Creativity &amp; freedom", [("Exuberance", "Orange", "Tangerine / Tea tree", "Sacral / Root"), ("Magic / Consciousness", "Purple / Yellow", "Vanilla / Sandalwood", "Third eye / Solar plexus"), ("Change / Courage", "Green / Blue", "Peppermint / Yarrow", "Heart"), ("Poetry / Insight", "Reddish purple", "Rose / Lemon", "Crown")]),
]
rows = ""
for g, items in chart:
    rows += f'<tr class="group"><td colspan="4">{g}</td></tr>'
    rows += "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a, b, c, d in items)
pages.append(page(9, S, f'''
<div class="eyebrow">Reference</div>
<h2>The sensory chart</h2>
<p>Color is one sense. Bring in the others: a scent, a texture, a sound that matches the feeling.</p>
<table class="ref"><thead><tr><th style="width:27%">Desire</th><th style="width:20%">Colors</th><th style="width:29%">Aromas</th><th>Chakras</th></tr></thead><tbody>{rows}</tbody></table>
''', "page fill"))

pages.append(page(10, S, f'''
<div class="eyebrow">Fill-in page · Part 3</div>
<h2>My room plan</h2>
<p>Where each color goes, plus a scent or texture from the sensory chart.</p>
{grid_table(["Room", "Desire", "Colors", "Where it goes", "Scent or texture"], 8, ["16%", "18%", "20%", "26%", None])}
<h3>My first small change</h3>
{box("This weekend I will", 90)}
''', "page fill"))

open("color.html", "w").write(doc(T, "#c9a46a", "#23313f", pages))
print("ok")
