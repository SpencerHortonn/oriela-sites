# READY TO PUSH — morning steps (about 5 minutes)

The repo is fully committed locally. GitHub login is the only missing piece (the `gh` CLI is installed but not logged in on this machine).

## Step 1: Log in to GitHub (on this machine, in the terminal)

```
gh auth login
```

Pick: GitHub.com > HTTPS > Yes (authenticate Git operations) > **Login with a web browser**. It gives you a one-time code; open the URL it shows, paste the code, authorize.

## Step 2: Create the repo and push

```
cd ~/workspace/oriela-sites
gh repo create oriela-sites --public --source=. --push
```

This creates `github.com/<your-username>/oriela-sites` and pushes everything.

## Step 3: Connect Netlify (per site, ~1 min each, 4 sites)

For each of the 4 folders below, in the Netlify dashboard (logged in as spencerhorton28@gmail.com):

1. Open the existing site (listed below) > **Site settings > Build & deploy > Link repository** (or Site overview > "Link a repository")
2. Choose GitHub > select `oriela-sites`
3. Set **Base directory** to the folder name, **Publish directory** to the same folder name, leave build command empty
4. Save. Netlify will do one deploy from the repo to confirm the link.

| Netlify site | Folder (base + publish directory) |
|---|---|
| `delightful-concha-983b9b` (podcast) | `podcast-repurposing` |
| `fancy-tarsier-90aec5` (challenge) | `proving-ground-challenge` |
| `chipper-jelly-7857dd` (unplugged) | `lantern-club-kit` |
| `magical-griffin-9c9224` (studio) | `oriela-studio` |

After this: any push to `main` auto-deploys the changed site(s). Claude Code can edit any `index.html`, commit, push, and the site goes live in ~1 minute.
