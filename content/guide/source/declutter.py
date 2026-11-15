from wb import *

T = "The Declutter Workbook"
S = "Declutter"
pages = [cover(T, "Look &nbsp;·&nbsp; Clear &nbsp;·&nbsp; Keep", "Clear what holds you back. Keep what inspires you.")]

pages.append(page(1, S, f'''
<div class="eyebrow">Start here</div>
<h2>Hello, beautiful you!</h2>
<p class="lede">By the end of this workbook you will know what your home is telling you, you will have cleared what is in your way, and everything you keep will have a home of its own.</p>
<p>I must confess: I love my stuff. My desk is covered in fabric, rocks, photos and feathers, and they inspire me. So this is not about owning as little as possible. Not all clutter is created equal. It is about letting go of the things that block you, and making room for what you are manifesting.</p>
<p>Work at your own pace. Fifteen minutes is enough to start, and one cleared drawer can change how you feel about a whole room.</p>
<div class="facts">
  <div class="fact"><div class="k">Part 1 · Look</div><div class="v">One walk through your home</div></div>
  <div class="fact"><div class="k">Part 2 · Clear</div><div class="v">15 minutes at a time</div></div>
  <div class="fact"><div class="k">Part 3 · Keep</div><div class="v">One zone at a time</div></div>
</div>
<h3>What you need</h3>
{ul(["This workbook and a pen", "Seven bags or boxes, and a marker to label them", "A timer, and music you love", "A tape measure and your phone camera, for Part 3", "A kind friend, if you want company"])}
'''))

pages.append(page(2, S, f'''
{part(1, "Part 1 · One walk through your home", "Look")}
{label("A heart-centered reality check")}
<h3 style="margin-top:0">See your home the way it makes you feel</h3>
<p>Everything in your home sends a message, about you and to you. Before you change anything, find out what it is saying. Hold the picture of your new life gently in your heart, then walk through your home the way you do when you arrive.</p>
<p><strong>Start at the way in.</strong> The driveway, the hallway, the front door. If the energy can’t get past the front door, it won’t reach your bedroom. In each area, ask:</p>
{ol(["How do I feel as I walk into this space?", "Is anything blocking my way, like a bookcase, a pile or a chair?", "Is there anything here that bothers me?", "Do I feel supported and safe here?", "What do I smell and hear?", "Does this look like the life I am manifesting?"])}
<p class="pointer">Write your answers on <b>My reality check</b>, page 6. Don’t be surprised if feelings come up. Be gentle with yourself.</p>
{note("Art in the garage", '<p style="margin:0">I have a $25 thrift store painting hanging in my garage, where I can see it from the driver’s seat. Every time I pull in, I think: I have art in my garage, that’s what wealthy people do! A small thing at the way in sets the tone for everything after it.</p>')}
'''))

bags = [("Trash &amp; recycle", "Start here, it’s the fastest. Dead plants, broken things, stained clothes. Don’t overthink it."),
        ("Return", "Put it in the car today, where you can see it."),
        ("Maybe", "Can’t decide? In it goes. Look again in 30 days."),
        ("Home shop", "Things you love that are in the wrong place. Move them to where they shine."),
        ("Donate", "Good, clean, working things for someone who needs them."),
        ("Sell", "Consignment, a garage sale, or online. Only if it feels good."),
        ("Keep", "What you love, use or need. Part 3 gives it a home.")]
pages.append(page(3, S, f'''
{part(2, "Part 2 · 15 minutes at a time", "Clear")}
{label("Purge with a purpose")}
<p style="margin-top:0">Label seven bags or boxes. Set a timer for 15 minutes, turn up the music and go. When the timer rings, stop or reset it. You decide.</p>
<div class="bags">{"".join(f'<div class="bag"><div class="serif">{n}</div><p>{d}</p></div>' for n, d in bags)}</div>
{label("Where to start", 6)}
<p>Use your reality check. Start at the way in, then clear your <strong>line of sight</strong>: the floors, walls and surfaces you see as you move through a room. The junk drawer can wait, unless it is the thing bothering you most. Then start there.</p>
{label("Let go of the right things", 14)}
{ul(["<strong>If you feel guilty about letting something go, don’t.</strong> You can always come back to it. Let go for the right reasons, at your own pace.",
     "<strong>Do let go of things with bad feelings attached:</strong> photos of exes, gifts you feel guilty about hating, reminders of your lowest times.",
     "<strong>Keep a Maybe bag and a Donate bag in your closet,</strong> so letting go becomes a habit, not a project."])}
'''))

pages.append(page(4, S, f'''
{part(3, "Part 3 · One zone at a time", "Keep")}
{label("Give everything a home")}
<p style="margin-top:0">Storage isn’t about pretty bins. It’s about making your home easy to live in, so it stays clear without you fighting it. For each space, decide three things first:</p>
{ol(["<strong>How do I want to feel here?</strong> Calm, focused, uplifted.",
     "<strong>What is real here?</strong> The square footage, the furniture, what is in the way.",
     "<strong>What would make it easy?</strong> A hook by the door, a tray for keys, a shelf at the right height."])}
{label("Active and passive zones", 12)}
<p><strong>Active zones</strong> are the places you use all day: the entry, the kitchen counter, your desk, the bathroom vanity. Keep only daily things there, within reach. <strong>Passive zones</strong> hold what you rarely need: the top shelf, under the bed, the garage. As my client Nourit says, “Let’s hide the misery.”</p>
{label("Simple rules that work everywhere", 12)}
{ul(["<strong>Less is more.</strong> The easiest storage is buying less. Skip the warehouse-size packs you don’t need.",
     "<strong>Everything gets a place,</strong> and leave room for more. You want space for the new things your new life brings.",
     "<strong>Measure before you shop.</strong> Buy containers for the space you have, not the space you wish you had.",
     "<strong>Group by task,</strong> heavy things low, everyday things at eye level.",
     "<strong>Keep it simple.</strong> If you live with others, choose a system the whole household will actually use."])}
'''))

pages.append(page(5, S, f'''
{note("Not a race", '<p style="margin:0">A friend of mine read a famous tidying book and cleared out her whole house in a rush, family heirlooms included. She still spends weekends at yard sales trying to find them. Go all in if you want to, but do it with intention. You are clearing to feel better, not to purge for the sake of it.</p>')}
{note("Feeling better is the goal", '<p>You don’t have to become a perfectly organized person for this to work. I live alone, and some days I don’t make my bed. Do the least you can to feel real relief, then let the rest come.</p><p style="margin:0">If a doubtful voice says “nobody in this house cares,” answer it: “That’s how I used to think, and now I’m working on a new way of thinking.”</p>')}
{label("Make it a rhythm", 12)}
<p>Stuff loves to pile up again. Do a purge twice a year, or with each change of season, and look at your Maybe box every 30 days.</p>
<div class="note"><p class="sign" style="margin:0 0 4px">Look at you, doing amazing things.</p><p style="margin:0 0 4px">Next, make what is left beautiful with the <strong>Define Your Style</strong> and <strong>Color</strong> workbooks.</p><p class="mantra" style="margin:0">There is nothing you can’t do, be or have.</p></div>
'''))

area = '''<div class="box" style="padding-bottom:6px"><div class="lab">Area: <span style="display:inline-block;width:2.6in;border-bottom:1px solid var(--line)"></span></div>
<table class="ref tall" style="margin:4px 0 0"><tbody>
<tr><td style="width:46%">How do I feel walking in?</td><td></td></tr>
<tr><td>What is blocking my way?</td><td></td></tr>
<tr><td>What bothers me here?</td><td></td></tr>
<tr><td>Do I feel supported and safe?</td><td></td></tr>
<tr><td>What do I smell and hear?</td><td></td></tr>
<tr><td>Does it look like my new life?</td><td></td></tr>
</tbody></table></div>'''
pages.append(page(6, S, f'''
<div class="eyebrow">Fill-in page · Part 1</div>
<h2>My reality check</h2>
<p>Copy this page for more areas. Start at the way in.</p>
{area}{area}
''', "page fill"))

pages.append(page(7, S, f'''
<div class="eyebrow">Fill-in page · Part 2</div>
<h2>My Maybe box</h2>
<p>Write the date it went in. On the decide-by date: if you haven’t needed it, let it go.</p>
{grid_table(["Item", "Went in", "Decide by", "Kept / let go"], 7, ["46%", "16%", "16%", None])}
<h2 style="margin-top:22px">Home shop</h2>
<p>Things I love that belong somewhere else.</p>
{grid_table(["Item", "From", "To"], 5, ["44%", "28%", None])}
''', "page fill"))

pages.append(page(8, S, f'''
<div class="eyebrow">Fill-in page · Part 3</div>
<h2>My zones</h2>
<div class="two">
<div>{grid_table(["Active zones · daily things only"], 8)}</div>
<div>{grid_table(["Passive zones · stored away"], 8)}</div>
</div>
<h3>One space, three questions</h3>
<div class="box"><div class="lab">Space</div><div class="lines" style="height:30px"></div></div>
<div class="two">{box("How I want to feel here", 90)}{box("What is real here", 90)}</div>
{box("What would make it easy", 90)}
''', "page fill"))

open("declutter.html", "w").write(doc(T, "#a8452f", "#f6f2ea", pages))
print("ok")
