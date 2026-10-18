# oriela-sites

All of Spencer's static websites in one repo. Each folder is one self-contained site (a single `index.html`, no build step, no dependencies beyond Google Fonts CDN).

## The sites

| Folder | Site | Live URL |
|---|---|---|
| `podcast-repurposing/` | Podcast repurposing service landing page ($297/$347/$447 tiers) | https://delightful-concha-983b9b.netlify.app |
| `proving-ground-challenge/` | Proving Ground Challenge $49 fitness challenge landing page | https://fancy-tarsier-90aec5.netlify.app |
| `lantern-club-kit/` | "Unplugged by Lantern Club" $35 preorder page | https://chipper-jelly-7857dd.netlify.app |
| `oriela-studio/` | Oriela Studio services site (podcast repurposing, short-form video, websites/automations) | https://magical-griffin-9c9224.netlify.app |

## How to edit (for Claude Code or Muse)

Each site is ONE file: open the folder, edit `index.html`, save. That's it. There is no build, no npm, no framework. Styles are inline in `<style>`, fonts load from Google Fonts.

Brand rules that apply to every site:
- Palette: cream #f4ecdc, forest #1f3529, rust #b0532b, gold #c9a24b (Proving Ground uses a dark athletic variant)
- Fonts: Fraunces (headlines) + Inter (body); Proving Ground uses Archivo/Oswald for headlines
- No em-dashes in copy. Use colons, commas, or periods.
- Mobile-first: everything must look right on a phone.

## How deploy works

Each folder is connected to its own Netlify site as a **monorepo with a base directory**. Pushing to the `main` branch auto-deploys. Netlify watches this repo; when a commit touches e.g. `lantern-club-kit/`, only that Netlify site rebuilds (base directory = the folder, publish directory = the folder).

Netlify setup per site (already done once, recorded here so it can be redone):
1. Netlify dashboard > Add new site > Import an existing project > GitHub > select `oriela-sites`
2. Set **Base directory** to the site folder (e.g. `lantern-club-kit`), **Publish directory** to the same folder, build command empty
3. Deploy. Every future push to `main` redeploys automatically.

Current Netlify sites (created via Netlify Drop, to be switched to GitHub auto-deploy):
- podcast-repurposing: `delightful-concha-983b9b` (spencerhorton28's team)
- proving-ground-challenge: `fancy-tarsier-90aec5`
- lantern-club-kit: `chipper-jelly-7857dd`
- oriela-studio: `magical-griffin-9c9224`
