# Visual revamp, Oct 20 2026

Eight sites, one commit each, all pushed to `main`. Verified live means HTTP 200, view beacon present, and a marker unique to the new build being served.

## How to undo anything

The exact state before this job is tagged **`pre-revamp-oct20`** (commit `b64f53c`), on GitHub as well as locally.

- Undo one site, keep the rest: `git revert <commit>` (hashes below), then push.
- Put one site back exactly as it was: `git checkout pre-revamp-oct20 -- <folder>/` then commit and push.
- Undo the whole job: `git revert --no-edit pre-revamp-oct20..HEAD`, then push. Or reset `main` to the tag, but only if nothing else has landed since.

## Hard rules, and how they were checked

A guard script compared every page against the tag before each commit:

- **Form JS untouched.** Byte-identical on every site: the `MAIL_ENDPOINT` line, `initTurnstile()`, `turnstileToken()`, the full submit handler, every `<form>…</form>` and its success element.
- **View beacon untouched.** Byte-identical on all eight.
- **Lantern rope physics untouched.** The whole verlet block (22 segments, 12 iterations, lamp mass 2.6) and all three lantern elements are byte-identical.
- **No em-dashes** anywhere in the eight pages.
- **No scroll pinning or scroll hijacking.** Zero ScrollTrigger pins, and no `scroll-snap`. Two things that came close were removed: Half Frame's proximity scroll-snap, and Podcast's sticky-stacked exhibit cards. The only sticky elements left are navigation (Podcast's header and index spine).
- **Copy stays truthful.** The guard prints any new visible text for review. New strings are restatements of facts already on the page or decorative UI (REC, timecode, the evening clock).
- **Every new effect respects reduced motion.** With `prefers-reduced-motion` on, the new motion is skipped.
- **New motion lives in its own script.** It was added as a separate `<script>` where possible, so the original page script stays readable and diffable.

## Effects toolkit

These come from the six reference sites studied in this job (Awwwards Sites of the Day, inspected with REA and the browser) plus the earlier teardowns (Fitosauna, Rejouice, Locomotive, Louis Paquet, Unseen, Crosswalk).

**References in this job:**
- Tengile MalaMala: Next.js / Turbopack, PP Fragment serif with Inter, Lenis
- Butter: Next.js, Lenis
- Odyssée Clinic: Lenis
- Santioni Spirits: custom bundle, Lottie, WebGL particles, Web Audio
- FORMAT by Obys: single Vite bundle
- The Tie Break by Merci-Michel: Vue + Vite WebGL game

| Effect | Seen on | Used on |
|---|---|---|
| Lenis smooth scroll driving ScrollTrigger | Almost every winner | All (added to Hearth) |
| Multi-plane depth: background, light shafts, mid layer, blurred foreground, each with its own scroll and pointer speed | Fitosauna, Tengile | Proof hero |
| Stacked sheets: sections overlap with rounded tops and cast shadows | Fitosauna | Proof |
| Glass panels with real layered shadows | Butter (glossy tiles) | Proof, Studio, Lantern |
| Clip-path reveals, image drifting inside its frame | Fitosauna, Tengile | Proof, Studio |
| Masked line-by-line headline rises | Fitosauna, Locomotive | Proof |
| Read-along word fill | Tengile, Fitosauna | Studio About |
| Outline numerals that fill as you scroll | Rejouice, Locomotive | Studio services, Proving Ground |
| Scroll-velocity marquee | Butter, Rejouice | Studio clients, Proving Ground |
| Cursor-tilt cards (3D) | Butter | Studio work screen, Lantern kit, Hearth token, Half Frame prices, Oriela Co chapter cards |
| Pointer-reactive light (key light, sheen, swinging shadows) | Locomotive | Studio, Hearth, Proving Ground |
| Particles: dust in a beam, chalk puffs, embers | Santioni | Studio, Proving Ground, Lantern |
| Floating layered documents | FORMAT | Podcast deliverables stack |
| Scroll-scrubbed storytelling with no pin: things change as you pass, never hold you | Tengile | Lantern evening clock, Hearth phone goes to bed, Half Frame developing prints |
| Data made physical: grids, meters, bars | Rejouice-style restraint | Proving Ground 28-day grid and payout bars, Podcast 10% meter |
| Theme and atmosphere shifts on scroll | Fitosauna, Hearth (existing) | Lantern nightfall, Hearth sunrise |
| Grain, halation, vignette | Most | Half Frame halation, all |

## Per site

| Site | Commit | Live URL | Status |
|---|---|---|---|
| Proof | `dd8efef` | https://proof.orielaco.com | verified 19:51 |
| Oriela Studio | `6c0e893` | https://studio.orielaco.com | verified 19:55 |
| Lantern Club | `277e9c5` | https://lantern.orielaco.com | verified 19:58 |
| Proving Ground | `67649c5` | https://provingground.orielaco.com | verified 20:03 |
| Podcast | `51e549b` | https://podcast.orielaco.com | verified 20:19 |
| Hearth Key | `af00689` | https://hearth.orielaco.com | verified 20:19 |
| Half Frame | `4c189e8` | https://halfframe.orielaco.com | verified 20:19 |
| Oriela Co (polish) | `291a7ae` | https://orielaco.com | verified 20:19 |

### Proof: depth first

The flat background was the known weakness.
- **Hero:** five planes (canopy, light shafts, mid leaves, glass specimen label, blurred foreground leaves) with scroll and pointer parallax.
- **Stacked sheets:** every section now slides over the last with a cast shadow.
- **Problem:** an arched dew-leaf frame overlapped by a "label is the receipt" card, built only from facts already on the page (5 g, no fillers, no blends, every batch tested).
- **Standard:** three staggered glass cards at different speeds, with a cursor spotlight.
- **Product and launch:** the product panel opens from a slit, and 2027 is an extruded layered numeral that separates as you scroll.
- **Sign-up:** a glass card over blurred canopy.

### Oriela Studio: film set

- **Hero:** a camera viewfinder (REC, running timecode, frame corners), dust in the spotlight, and a cursor key light.
- **Clients:** the names become a scroll-reactive marquee.
- **Work:** the screen is letterboxed and tilts toward the cursor.
- **Services:** the numerals fill with amber as you read.
- **Podcast tiers:** lit slates.
- **Process:** a film strip.
- **About:** reads word by word.
- **Pricing made consistent:** all seven services now say "Custom quote" (previously only two did), matching the FAQ, which already promised a fixed written price per project.

### Lantern Club: the night unfolds

- **Evening clock:** a small clock runs from doors at 6:30 to 9:00 as you scroll, while the room edges darken like nightfall.
- **Hero:** embers at three depths.
- **The night:** the steps become a timeline with a burning wick.
- **Story:** the pull quote is a taped note.
- **Night One:** a perforated ticket.
- **Kit:** tilts toward the cursor.
- **Deck:** the cards are dealt onto the table as you scroll.
- **Ending:** a candle whose light grows.
- **Fix:** section reveals now trigger on scroll; they used to all fire during the intro.
- **Rope physics:** untouched.

### Proving Ground: scoreboard and chalk

- **Hero:** chalk dust claps off the cursor and drifts off the handprints (the handprints themselves are unchanged). GROUND floods lime as you scroll, and dark sections get scanlines.
- **Dividers and marquees:** the hazard stripes slide, and the marquees lean with scroll speed.
- **Shadows:** the hard offset shadows swing against the cursor.
- **28-day grid:** new, filling as you read. Weekdays are training, weekends rest, and Fridays in weeks 2 to 4 are scored, all from the program table.
- **Prize:** payout bars for 50/30/20.
- **Footer:** a big PROVING GROUND mark above the unchanged "PROVING GROUND BY PROOF" line.
- **Hard-rule fix:** the page still showed prices, so those were removed:
  - the ticker said "30% OF EVERY $99", now "30% OF EVERY ENTRY"
  - the refund FAQ said "your $99", now "your entry"
  - the og meta said "$99 entry"
  - the pool-math table showed "$9,900 / $2,970", now the 30% share

  CTAs remain email capture only.

### Podcast repurposing: the desk

- **Brief:** a paper-clipped stack of the four deliverables deals in and drifts with the cursor.
- **Problem:** a 10% recording vs 90% grind meter.
- **Evidence:** the exhibits are no longer sticky-stacked. They sit fanned on the desk and straighten as you read.
- **Rates:** the hovered plan column lights up.
- **Contact:** a "First episode free" stamp slams on.
- **Two pre-existing bugs fixed** (both confirmed on the live site before this job):
  1. All six section headlines (Problem, System, Evidence, Pricing, Questions, Contact) never appeared. A fully clip-pathed element never reports an intersection, so the reveal never fired.
  2. On phones the page was about 700px wide and scrolled sideways.

### Hearth Key: one object, lit

- **Hero:** the key is a real 3D token that tilts toward the cursor, with a tracking sheen and a table shadow, inside a flickering hearth glow.
- **Problem:** a phone on a nightstand dims as you scroll while the moon rises.
- **Uses:** the token flips like a coin through the three uses, which become warm glass cards.
- **Pricing:** becomes paper cards.
- **The ritual:** gets a key-taps-phone NFC loop.
- **Sign-up:** the sun rises behind it.
- **Smooth scroll:** Lenis added.

### Half Frame: darkroom

- **Hero:** the headline develops from a faint negative into the print, with red-orange halation.
- **Sprocket rails:** advance with the scroll.
- **Contact sheet:** grease-pencil circles on hover.
- **Darkroom:** prints hang on a line, sway, and develop as they arrive.
- **Pricing:** price cards tilt like prints held to the light.
- **Hard rule:** removed scroll-snap.

### Oriela Co: light polish

Structure and copy unchanged.
- **Chapter cards:** each carries its venture's own light and texture, and tilts toward the cursor.
- **Hero:** the rings drift on scroll.
- **Right now:** the counts tick up.
- **Fix:** below-the-fold content used to fade in all at once during the intro; it now reveals on scroll.

## Round 2: full rebuilds (after Spencer's feedback), all verified live 21:01

Round 1 layered effects onto the existing layouts. Spencer wanted real revamps with the brand vibes kept:
- **Lantern:** cozy cottage.
- **Proof:** nature and cinematic, the best site of the set.
- **Studio:** keeps its vibe.
- **Proving Ground:** better scrolling only.
- **Podcast, Hearth, Half Frame:** stay as they are.

Each rebuilt page is a new template. A build script injects the protected code byte-for-byte from `pre-revamp-oct20`: form markup, form JS, `turnstileToken()`, the beacon, and for Lantern the rope physics and lantern markup. The guard verifies all of it before every commit.

| Site | Commit | What it is now |
|---|---|---|
| Proof | `1f01c30`, then `23ed4d0` | **A film in chapters, with subtitle-style chapter captions.** Dawn-in-the-canopy hero (Ken Burns push, moving god rays, drifting mist, sunlit pollen motes that glow in the beams, blurred foreground leaves, letterbox bars, title resolving from blur). Then: the dew-leaf macro racking into focus behind the manifesto, a canopy card opening to full bleed, a sideways-sliding glass track of Test / Result / Batch over the blurred canopy, an outlined 1 flooding green with the facts orbiting it, a printing receipt, expanding Athletes/Everyone lanes, 2027 with a sunrise, dappled leaf shadows on the paper sections, and cursor torchlight in the dark scenes. |
| Oriela Studio | `c918639` | **Premiere.** A letterboxed 2.39:1 projection-screen hero with dust in the beam, a Now Showing marquee, Starring credits, big counters, and the six projects as film frames on a sideways reel. The seven services are rolling-credit rows (all Custom quote) with a cursor preview card. Podcast tiers are ticket stubs, process has a playhead timeline, and contact ends under a cursor spotlight. |
| Lantern Club | `bc42e73` | **The cottage.** A dusk cottage with glowing windows, smoke, fireflies and stars under the lanterns. Scrolling walks you to the door until its light fills the screen. Inside: a taped linen letter and framed quote, recipe cards on a wooden mantel with a burning wick, a chalkboard holding the Night One form, an unboxing where the lid opens and the four items rise out, the deck dealt on a checkered tablecloth, FAQ as taped notes, and a hearth with embers. |
| Proving Ground | `748f70b` | **Scroll feel only.** A longer Lenis glide, the hero words part as you leave, headlines drift sideways, and rows slide in with momentum. |

**Kept from round 1:** Podcast `51e549b`, Hearth `af00689`, Half Frame `4c189e8` and Oriela Co `291a7ae` stay as they were.

**Rollback** works the same way. `pre-revamp-oct20` is the original state, and each commit above can be reverted on its own.

## Round 3: flagship pass, overlaps and timing (after Spencer's second round of feedback)

Spencer's notes: Lantern's cottage looked bad and the lanterns overlapped everything, Studio overlapped and its hero should go back to what it was, Hearth and Podcast get full rebuilds, scroll animations should finish while you are looking at them (not as they leave the screen), and every site gets three proof passes.

**Timing rule applied everywhere:** a scrubbed reveal or fill now ends when its element is around the middle of the screen (`center 50%` to `center 55%`, or `top 40%` to `top 72%` for short rows). Sideways tracks end at `bottom bottom` or `center 42%`. Parallax on the way out of a hero is the only thing still running to `bottom top`.

**Overlap fixes everywhere:** every fixed header now becomes a solid glass bar once you scroll, so no content reads through the nav. CSS hover transitions that fought GSAP on the same `transform` were moved to the separate `translate`, `rotate` and `scale` properties. That clash was what left Studio's podcast cards stuck tilted over their button.

| Site | Commits | What changed |
|---|---|---|
| Lantern Club | `37425f9`, `a599a1e` | The drawn cottage is gone. The hero is now a lamplit room: a plank wall, warm light pools, and dust drifting in the lamplight. The lanterns now live inside the hero instead of floating over the whole page (a CSS position change only; the rope physics, segment count and lamp weights are byte-identical). The deck is dealt as a face-down pile and the faces turn up as the cards land, all settled by mid-screen. On phones the unbox spreads into a clean 2x2 and the lid stays out of the way. The FAQ hover no longer fights its entrance, the letter paper is warmer and easier to read, and the nav goes solid as soon as you scroll. |
| Oriela Studio | `10a7e3c` | The original hero is back: the spotlit ORIELA / STUDIO wordmark in the viewfinder with REC, timecode, dust and the pointer light. The words drift apart as you scroll away. The header is now a solid bar. The work reel finishes by mid-screen, and the frames are taller on phones so the frame numbers clear the titles. The podcast ticket stubs and work-frame hovers no longer fight GSAP. |
| Proving Ground | `604a3a7`, `f253ed9` | The rows were stuck partway because the reveal killed the slide (`overwrite:true` changed to `"auto"`). Section headings now slide in and settle mid-screen instead of drifting forever. The final headline breaks only between words (it used to split "WONDERI / NG"), with looser line spacing. No prices, no buy buttons, the footer and the handprints are untouched. |
| Hearth Key | `1abfed9`, `84acb4c` | **Full rebuild: night to dawn.** A starry night hero with a moon and a walnut Hearth Key that drops in, breathes and tilts toward the cursor, with NFC rings pulsing. At the bedside the key taps a glowing phone: the badges clear, the apps grey out and the screen turns to Rest, finished by mid-screen. Then the three objects, walnut pricing tickets ($39 and $99, Save $18), the ritual with the four Shortcuts steps, and the "Honest by design" quote lighting word by word as the sun rises. The FAQ and the waitlist sit in the morning light. Same copy and prices; the form is byte-identical. |
| Podcast | `abce867` | **Full rebuild: on air.** A walnut slat-wall studio with an ON AIR sign that flickers on, a live waveform that gets louder as you scroll, and an Input / Output / Turnaround / Cost readout. Next come a ticker, a 10% vs 90% bar for "the episode is 10% of the work", and one signal line that splits into the four deliverables. The three sample packs are podcast cover cards (same links), and the rates are channel strips whose meters fill to 4, 8 or 12 packs ($397 / $497 / $597). The FAQ and the free-episode contact follow. Same copy; the form is byte-identical. |
| Proof | `bc3b3c0` | Scrubbed scenes (manifesto words, canopy reveal, the green 1, the receipt, 2027 filling, the sunrise) all land mid-screen. The glass track finishes when the section is fully in view. The header becomes a solid bar after the hero, the giant 2027 is pulled in from the edge, the floating chapter chip is hidden on phones (it covered the FAQ), and the hover lifts no longer fight the intro. |
| Half Frame | `66eaf0d` | The dog-eared corner moved off the "overexposed, kept it anyway" caption. |
| Oriela Co | `af379dd` | A glass nav bar in the colour of the section under it. The nav had no side padding on phones (the wordmark touched the edge); that is fixed. The first-visit loader is about 1.5s shorter. Proving Ground is listed as "Coming 2027" instead of "$99 entry", to match the no-prices rule. |

**Proof passes (3).** Each pass ran the overlap checker on all 8 sites. The checker scrolls the page in half-screen steps, flags visible text sitting on other text and anything poking past the right edge, and skips decorative, fixed and clipped layers. Each pass ran at 1440x900 and at 375x812, with screenshots of every section.
- **Pass 1** found the PG hero (a stalled intro only), Studio's FAQ (closed answers, so a checker fix) and the Hearth and Lantern phone entrance states. Those were fixed.
- **Pass 2** found the Lantern nav and the PG headline spacing. Those were fixed.
- **Pass 3** was clean on all 8 desktop runs and on the phone runs of the sites changed since pass 2.

The only standing flag is the giant "2027" on Proof. Its invisible text box is taller than the glyphs; the screenshots show clear space above and below.

All eight verified live at 22:15 (HTTP 200, view beacon present, new-build marker present). **Guard** passed on every site: forms, `turnstileToken()`, the beacon and the rope physics are byte-identical, with no em-dashes and no pinning.

**Follow-up (Oct 21):** Spencer found that the sideways tracks only ever showed their last card. Both were replaced with grids that show every card at once. Each card rises in and is fully settled by mid-screen.
- Proof's three steps: commit `d9faea9`. Four cards across on desktop, two on tablet, stacked on phones.
- Studio's past work: commit `906a9eb`. Six frames, three across on desktop. Each frame "develops" in from a cropped, zoomed state.
- The copy that told people to scroll the track sideways was removed.
- Both sites were verified live.

## Deploy queue note

Every push rebuilds all eight Cloudflare Pages projects, one at a time, so each deploy waited behind the others. A proof-lab build looked hung for about 15 minutes, then the queue cleared on its own. All eight sites were verified live by 20:19.

## Flagged, not changed

- **Proving Ground price on the hub.** Fixed in round 3: orielaco.com now says "Coming 2027" for Proving Ground.
- **Studio contact.** The contact section says "Coming 2027" above its notify form, which reads oddly on a services site. Unchanged.
- **Podcast prices.** The page says $397 / $497 / $597 while the old README says $297 / $347 / $447. The page was left as is; the README is stale.
- **Stale README.** It still describes Netlify; deploys are Cloudflare Pages.
