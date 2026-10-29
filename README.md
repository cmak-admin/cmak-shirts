# CMAK Shirts – PWA on GitHub Pages

Front end lives on GitHub Pages (free). Data stays in the Google Sheet through the Apps Script web app.

## 1. Update the Apps Script project (one time)
1. Add a new file **Api.gs** and paste `apps-script/Api.gs`.
2. Replace **Config.gs** with `apps-script/Config.gs`, then put back your `SPREADSHEET_ID` and set `REPORT_PIN`.
3. Deploy > Manage deployments > pencil > Version: New version > Deploy. Copy the Web app URL (ends in `/exec`).
4. Test in the browser: `<URL>?action=eligible` should return JSON starting with `{"ok":true`.

## 2. Publish the PWA
1. GitHub > New repository > name `cmak-shirts` > Public > Create.
2. Edit `app.js`: paste the Web app URL into `API_URL`.
3. Upload every file in this folder (keep the `icons` folder) > Commit.
4. Settings > Pages > Source: Deploy from a branch > Branch: `main`, folder `/ (root)` > Save.
5. After ~1 minute the site is live at `https://<your-github-username>.github.io/cmak-shirts/`.

Members: open the link in Chrome, tap **Install** (or Share > Add to Home Screen on iPhone).
Officers: `https://<username>.github.io/cmak-shirts/report.html` – enter the PIN.

## Changing things later
- Register changes: edit the Google Sheet only. The app reads it live.
- Sizes, closing date, PIN: `Config.gs` in Apps Script, then deploy a new version.
- App text or design: edit the file on GitHub, commit, and bump `CACHE` in `sw.js` (v1 -> v2) so phones pick up the change.
