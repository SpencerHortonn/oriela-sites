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
| Podcast | `51e549b` | https://podcast.orielaco.com | pushed, deploy queued |
| Hearth Key | `af00689` | https://hearth.orielaco.com | pushed, deploy queued |
| Half Frame | `4c189e8` | https://halfframe.orielaco.com | pushed, deploy queued |
| Oriela Co (polish) | `291a7ae` | https://orielaco.com | pushed, deploy queued |

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

## Deploy queue note

Every push rebuilds all eight Cloudflare Pages projects, and they build one at a time. The proof-lab build for commit `67649c5` started at 01:00:56 UTC and hung. Everything behind it is waiting, so the last four sites were still serving their previous version when this was written.

- All eight sites were checked at that time: HTTP 200, beacon present.
- To clear it: in Cloudflare Pages, open **proof-lab** > Deployments and cancel the stuck deployment. The queued builds then run on their own.

## Flagged, not changed

- **Proving Ground price on the hub.** orielaco.com still lists Proving Ground as "$99 entry", while the Proving Ground site itself now shows no prices. This is copy on the hub, which was polish-only, so it was left as is.
- **Studio contact.** The contact section says "Coming 2027" above its notify form, which reads oddly on a services site. Unchanged.
- **Podcast prices.** The page says $397 / $497 / $597 while the old README says $297 / $347 / $447. The page was left as is; the README is stale.
- **Stale README.** It still describes Netlify; deploys are Cloudflare Pages.
