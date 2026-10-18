# Deploy: oriela-mail Worker

One-time setup in the Cloudflare dashboard. Takes about five minutes.

## Steps

1. Go to https://dash.cloudflare.com and sign in (Google sign-in, spencerhorton28@gmail.com).
2. In the left sidebar, open **Workers & Pages**, then click **Create**, then **Create Worker**. Name it exactly `oriela-mail` and click **Deploy**. (You will replace the starter code next.)
3. Click **Edit code** on the worker. Delete everything in the editor, paste the full contents of `worker.js` from this folder, then click **Save and deploy**.
4. Create the KV namespace: go back to **Workers & Pages** in the sidebar, open the **KV** section, click **Create a namespace**, name it exactly `oriela-mail`, and create it.
5. Bind KV to the worker: open the `oriela-mail` worker, go to **Settings**, then **Variables and Secrets**. Under **KV Namespace Bindings**, click **Add binding**. Set **Variable name** to exactly `MAIL_KV` and pick the `oriela-mail` namespace you just created. Click **Save**.
6. Add the admin password: on the same **Variables and Secrets** page, under **Secrets and variables**, click **Add**. Choose type **Secret**. Name: `ADMIN_PASSWORD`. Value: a strong password **the user chooses** (placeholder `CHANGEME` is not a real password, do not deploy with it). Click **Save**. You must redeploy the worker after adding a secret: go to **Deployments** and redeploy, or just click **Save and deploy** in the editor again.

## Verify

- `curl -X POST https://oriela-mail.workers.dev/api/join -H "Content-Type: application/json" -d '{"site":"test","email":"you@example.com"}'` should return `{"ok":true}`.
- `curl "https://oriela-mail.workers.dev/api/admin/signups?password=YOUR_PASSWORD"` should return JSON (empty object `{}` if nothing signed up yet). A wrong password returns 403.
- The admin panel lives at https://orielaco.com/admin/ once this repo is pushed. Unlock it with the same password.

## Notes

- Worker URL assumption: `https://oriela-mail.workers.dev`. If the account uses a custom workers.dev subdomain, update the `WORKER` constant at the top of `oriela-co-site/admin/index.html` to match.
- Public endpoints (`/api/join`, `/api/view`) accept POST from any origin. Admin endpoints only accept the password and only answer cross-origin requests from `https://orielaco.com` / `https://www.orielaco.com`.
- Daily view counters expire after 45 days. Signup keys never expire.
