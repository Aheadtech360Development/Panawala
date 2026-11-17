# Form backend setup (Google Sheet + email + Calendar)

One Google Apps Script handles both website forms:

| Form | What happens |
|---|---|
| Contact (`/contact/`) | Row added to the **Contact** tab, notification email sent |
| Book a consultation (`/book/`) | Open times read live from Google Calendar, event created with a Google Meet link, invite emailed to the client, row added to the **Bookings** tab, notification email sent |

Everything runs under the Google account that deploys the script. Testing account for now: `development.aheadtech360@gmail.com`.

## 1. Create the Sheet and script

1. Sign in to the Google account above and create a new Google Sheet, for example "Panawala Website Leads".
2. In the Sheet: **Extensions > Apps Script**.
3. Delete the sample code in `Code.gs` and paste the contents of [`Code.gs`](Code.gs).
4. Click the gear icon (**Project Settings**) and tick **Show "appsscript.json" manifest file in editor**.
5. Open `appsscript.json` in the editor and replace it with [`appsscript.json`](appsscript.json). This turns on the Advanced Calendar service (needed for Meet links and live availability).
6. Save.

## 2. Check the settings at the top of `Code.gs`

| Setting | Default | Notes |
|---|---|---|
| `NOTIFY_EMAILS` | `development.aheadtech360@gmail.com` | Change to the client address at handover. Comma separate several. |
| `CALENDAR_ID` | `primary` | The deploying account's main calendar. |
| `TIME_ZONE` | `America/Chicago` | Office hours are Central per the wireframe. |
| `SLOT_TIMES` | 9:00, 10:30, 12:00, 1:30, 3:00, 4:30 | Same as the wireframe. |
| `MEETING_MINUTES` | `30` | **Not in the wireframe. Confirm with the client.** |
| `MIN_NOTICE_HOURS` | `12` | Slots closer than this are hidden. |
| `BLOCKED_DATES` | `[]` | Holidays, e.g. `['2026-12-25']`. |

Anything already on the calendar (meetings, blocked time) automatically hides the overlapping slots.

## 3. Authorize

1. In the editor, pick the `setup` function in the toolbar and click **Run**.
2. Approve the permissions (Sheets, Calendar, send email). On a personal Gmail you will see "Google hasn't verified this app": click **Advanced > Go to project (unsafe)**. This is your own script.
3. The Sheet now has **Contact** and **Bookings** tabs.
4. Optional: run `testNotification` to confirm the email arrives.

## 4. Deploy as a web app

1. **Deploy > New deployment**, type **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy** and copy the **Web app URL** (ends with `/exec`).
4. Paste it into [`src/assets/js/config.js`](../src/assets/js/config.js):
   ```js
   window.PW_CONFIG = {
     endpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
     ...
   };
   ```
5. Rebuild and redeploy the site (`npm run build`, or push to Netlify/Vercel).

Quick check: open `<web app URL>?action=availability` in a browser. You should see JSON with `"ok":true` and a list of days.

## Updating the script later

After editing `Code.gs`: **Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy**. The URL stays the same. If you create a *new* deployment instead, the URL changes and `config.js` must be updated.

## Moving to the client's account

Repeat steps 1 to 4 while signed in to the client's Google account, set `NOTIFY_EMAILS` to their address, and put the new `/exec` URL in `config.js`. Invites will then come from their calendar.

## Limits

- Email: about 100 notifications per day on a free Gmail account, 1,500 on Google Workspace. Calendar invites do not count against this.
- Every booking is checked again on the server under a lock, so two people cannot take the same slot.
- Spam: hidden honeypot field, server side validation, a 30 second repeat block per email on the contact form, and values starting with `=`, `+`, `-` or `@` are stored as plain text in the Sheet.
