# OPEN feature tips (React)

The OPEN dashboard with Driver.js feature tips. When a user has unseen tips, a popover opens on its own with an arrow pointing at the feature, then **Next** or **Dismiss**.

## Run it

Needs Node 20.19 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## How it works

Each tip has one of three statuses for a user:

| Status | Meaning | Shows? |
|---|---|---|
| none | new to this user | yes |
| `seen` | the tip appeared on screen | no |
| `dismissed` | the user clicked Dismiss before reaching it | no |

One rule: **show the tips with no status, in list order.**

- **First-time user:** has no statuses, so they walk through every tip (Create RFQ → Supplier List → Buy Bunk Coins). Labelled **Feature tip**.
- **Returning user:** the older tips already have a status, so only newly added ones show. Labelled **New in OPEN**.

| User action | What's saved | What happens |
|---|---|---|
| a tip appears | that tip as `seen` | — |
| **Next →** | nothing more | the next tip opens; the last one says **Got it** |
| **Got it** | nothing more | tips close |
| **Dismiss** | the tips left in this run as `dismissed` | tips close, and none of them come back |
| **? → Replay all tips** | nothing | every tip from the start; **Close** ends it |

Once a tip has a status it keeps it, so each tip counts once in analytics: `seen` means the user was shown the feature, `dismissed` means they skipped it unseen.

Clicking the dimmed page or pressing Esc does nothing, so a run only ends through Dismiss, Next or Got it. That keeps the record accurate.

## Try it

1. Load the page: the first tip opens. Click **Next** through to **Got it**, then reload. Nothing shows.
2. **? → Replay all tips** walks through them again.
3. To act as a returning user getting a new feature, open DevTools → Application → Local Storage, edit `openknots.tips.u-1042` and delete `"buy-coins"` from `seen` (or `dismissed`). Reload: only Buy Bunk Coins opens, labelled **New in OPEN**.
4. To start over as a first-time user, delete the `openknots.tips.u-1042` key and reload.

## Adding a tip for a new feature

Add an entry to `src/tips/tips.js`, usually at the end:

```js
{
  id: 'invoice-upload',          // never reuse or rename an id
  element: '#upload-invoice-btn', // CSS selector of the feature
  title: 'Upload invoices',
  description: 'Attach supplier invoices to an RFQ for faster settlement.',
  side: 'bottom', align: 'start',
}
```

Give the element that ID in its component. Returning users see it once at their next login; new users get it as part of the full walk.

Remove a tip only when the feature itself goes away, because first-time users still need it.

## Files

```
src/
  App.jsx                    page, calls useFeatureTips
  components/
    Header.jsx               top bar and nav
    HelpMenu.jsx             ? menu with Replay all tips
    Hero.jsx                 Create RFQ, Supplier List, Bunk Coin card (tip targets)
    RfqList.jsx              sample RFQ table
  tips/
    tips.js                  the tip list, in walk order
    tipStore.js              which tips a user has seen or dismissed (localStorage for now)
    useFeatureTips.js        React hook that runs the Driver.js tour
    tips-theme.css           129Knots popover theme
```

## Moving to the database

`tipStore.js` reads and writes the record through `loadRecord`, `markSeen`, `markDismissed` and `resetRecord`. Replace their bodies with API calls. The table and endpoints are described at the bottom of that file:

```sql
CREATE TABLE user_tip (
  user_id  text NOT NULL,
  tip_id   text NOT NULL,
  status   text NOT NULL CHECK (status IN ('seen', 'dismissed')),
  at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tip_id)   -- first status wins; don't overwrite
);
```

Once `loadRecord` is async, await it at the start of `start()` in `useFeatureTips.js`. Take the user ID from the session on the server, never from the request body.

## Styling

Colours are CSS variables at the top of `src/tips/tips-theme.css`. The button uses `--k-primary`, OPEN's standard primary blue. Change it there if the design system changes.
