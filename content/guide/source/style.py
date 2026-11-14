from wb import *

T = "The Define Your Style Workbook"
S = "Define Your Style"
pages = [cover(T, "Remember it &nbsp;·&nbsp; Name it &nbsp;·&nbsp; Use it", "Your style is how your new life feels.")]

pages.append(page(1, S, f'''
<div class="eyebrow">Start here</div>
<h2>Hello, my darling co&#8209;creator!</h2>
<p class="lede">By the end of this workbook you will have one Style Word: a word you make up that describes how your home should feel. Then you will use it to make every choice, from paint to pillows.</p>
<p>I’m not about pretty pictures or this year’s trends. A home copied from a showroom tells someone else’s story. Your home should tell the story of the life you are calling in, and your style is how that life looks and feels.</p>
<p><strong>You do not need to own a home for this to work.</strong> Renting, in a dorm, living out of a suitcase: the way you dress your space is always yours to choose, and it doesn’t take a big budget.</p>
<div class="facts">
  <div class="fact"><div class="k">Part 1 · Remember it</div><div class="v">20 minutes</div></div>
  <div class="fact"><div class="k">Part 2 · Name it</div><div class="v">20 minutes</div></div>
  <div class="fact"><div class="k">Part 3 · Use it</div><div class="v">Every choice from now on</div></div>
</div>
<h3>What you need</h3>
{ul(["Your vision board, or the page you wrote in the Vision Board Workbook", "This workbook and a pen", "Your closet, and a mirror", "The music you picture playing in your new life"])}
<div class="rule">If it isn’t your Style Word,<br>it doesn’t come home with you.</div>
'''))

pages.append(page(2, S, f'''
{part(1, "Part 1 · 20 minutes", "Remember it")}
{label("Places that gave you thrill bumps")}
<h3 style="margin-top:0">Think of spaces that stayed with you</h3>
<p>Put the music on. Now remember places that left a mark: a hotel lobby with a fantastic vintage sofa, a restaurant with beautiful china, a music venue with an atmosphere you still feel, even a car with sleek lines and a leather interior.</p>
<p>Someone thought hard about every detail of those places so they would make you feel a certain way. Your job is to name that feeling: warm, soothing, exciting, spacious, cozy, glamorous.</p>
<p class="pointer">Write three of them on <b>Places I remember</b>, page 5.</p>
{label("Take cues from your closet", 22)}
<p>When I first meet a client, I ask them to wear an outfit they feel fabulous in. It tells me more about their style than any photo. Do you reach for all black? Structured suits? Flowy neutrals? Big bold prints? Jeans and soft sweaters?</p>
<p>If you open your closet and hate what you see, picture your ideal wardrobe instead. Dress like your boss, and your boss is the new you.</p>
{note("When the closet and the wish list disagree", '<p style="margin:0">A client told me she loved sleek, modern grays and open spaces. She arrived wearing colorful country florals. We looked at what she loved about both, and blended them. Her Style Word became <em>boldnaturallystructuredsoftspaciousness</em>.</p>')}
'''))

pages.append(page(3, S, f'''
{part(2, "Part 2 · 20 minutes", "Name it")}
{label("Choose up to five words")}
<h3 style="margin-top:0">How does your vision board make you feel?</h3>
<p>Look at your board and the places you remembered. Choose up to five words for the feelings they share. Use your own words, or circle them in the word bank on page 6.</p>
{label("Make them one word", 20)}
<p>Now run your words together into one made-up word. Mine is <span class="serif" style="font-size:14pt;font-style:italic">Bohowarmelegantsensualsoothing</span>. It sounds silly, and that is the point: you will never forget it, and you will know exactly what it means.</p>
{label("Check it against your board", 20)}
<p>Your Style Word and your vision board should agree. If they don’t, you have probably grown while doing this, which is wonderful. Change one of them now, before you buy anything.</p>
{ul(["<strong>Eclectic is fine.</strong> Pieces don’t have to match. Balance, harmony and a little contrast tie them together.",
     "<strong>Skip the trends.</strong> Copying a trend won’t fool the Universe, or you. A Style Word comes from your vision, not a magazine.",
     "<strong>Your walls don’t decide.</strong> A Spanish bungalow or a glass condo can hold any style. Define yours first, then fit it to the space."])}
<p class="pointer">Write your Style Word on <b>My Style Word</b>, page 6.</p>
'''))

pages.append(page(4, S, f'''
{part(3, "Part 3 · Every choice from now on", "Use it")}
{label("The one-question test")}
<div class="rule" style="margin-top:6px">“Is this <span style="border-bottom:1px solid var(--earth);padding:0 40px"></span>, or not?”</div>
<p>Ask it about every paint chip, pillow, lamp and frame, in the store and at home. When the answer is yes, bring it in. When it is no, it doesn’t matter how good the sale is.</p>
{label("Start with what you already have", 20)}
<p>Walk through one room and ask the question about each thing in it. Mark what passes and what doesn’t on page 7. The things that pass are the start of your new room. The rest can move, go, or wait (the Declutter Workbook helps with that).</p>
{note("A clear word sends a clear signal", '<p>A friend had been hunting for an office for months, on Zillow and Craigslist almost every day, with no luck. She knew she wanted a new space, but not what it should feel like. We worked out her Style Word: <em>Spacious-Sunny-Open-Flowy-Safe</em>.</p><p style="margin:0">Within a week, a listing appeared: large, with floor-to-ceiling windows, in a safe neighborhood. When she stood in it, the energy just flowed.</p>')}
{label("Let it grow with you", 18)}
<p>Your style has changed many times, and it will again. Thank the person who chose that old sofa (and that haircut). Then make room for who you are becoming.</p>
<div class="note"><p class="sign" style="margin:0 0 4px">Dream big, and be fearless.</p><p style="margin:0 0 4px">Next, turn your Style Word into colors with the <strong>Color Workbook</strong>.</p><p class="mantra" style="margin:0">There is nothing you can’t do, be or have.</p></div>
'''))

pages.append(page(5, S, f'''
<div class="eyebrow">Fill-in page · Part 1</div>
<h2>Places I remember</h2>
{box("Place 1 · What I loved, and how it felt", 100)}
{box("Place 2 · What I loved, and how it felt", 100)}
{box("Place 3 · What I loved, and how it felt", 100)}
<h3>My closet cues</h3>
{box("The outfit I feel fabulous in, and what it says about me", 100)}
''', "page fill"))

words = ["Warm", "Creative", "Classy", "Artsy", "Hip", "Charming", "Colorful", "Casual", "Clever", "Soothing", "Subtle", "Beachy",
         "Well traveled", "Cutting edge", "Soft", "Comfortable", "Elegant", "Simple", "Minimal", "Inspiring", "Jazzy", "Sleek",
         "Traditional", "Eclectic", "Spicy", "Sensual", "Boho", "Earthy", "Urban", "Contemporary", "Wild", "Mid-century",
         "Uptown", "Country", "Chic", "Rustic", "Rugged", "Tropical", "Spanish", "French", "English", "Italian", "Funky",
         "Fresh", "Exotic", "Hollywood", "Glam", "Silky", "Plush", "Cozy"]
pages.append(page(6, S, f'''
<div class="eyebrow">Fill-in page · Part 2</div>
<h2>My Style Word</h2>
<p>Circle up to five, or write your own.</p>
<div class="wordbank">{"".join(f"<span>{w}</span>" for w in words)}</div>
<div class="two">{box("My five words", 120)}{box("Words of my own", 120)}</div>
<div class="bigword">My Style Word</div>
<div class="checks"><div><i></i>My Style Word and my vision board agree</div></div>
''', "page fill"))

pages.append(page(7, S, f'''
<div class="eyebrow">Fill-in page · Part 3</div>
<h2>The style test</h2>
<p>One room at a time, or every time you shop. Yes, it stays or comes home. No, it moves, goes, or waits.</p>
{grid_table(["Item", "Yes / No", "Why, or where it goes instead"], 15, ["40%", "14%", None])}
''', "page fill"))

open("style.html", "w").write(doc(T, "#23313f", "#c9a46a", pages))
print("ok")
