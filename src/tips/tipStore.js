// Which tips each user has seen or dismissed.
//
// Record shape:
//   {
//     seen:      { [tipId]: "2026-10-20T03:12:00.000Z" },  // clicked Next / Got it
//     dismissed: { [tipId]: "2026-10-20T03:12:00.000Z" },  // closed with Dismiss
//   }
//
// A tip in either map is done and won't show again. They're kept apart so
// analytics can tell "read it" from "skipped it".
//
// This version uses localStorage, so it is per browser: a new device or an
// incognito window starts again from the first tip. For production, replace
// these three functions with API calls (see the bottom of this file).

const key = (userId) => `openknots.tips.${userId}`;
let memory = {}; // fallback when storage is blocked

export function loadRecord(userId) {
  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) memory[userId] = JSON.parse(raw);
  } catch {
    /* storage blocked; use memory */
  }
  return { seen: {}, dismissed: {}, ...memory[userId] };
}

export function isDone(record, tipId) {
  return Boolean(record.seen[tipId] || record.dismissed[tipId]);
}

export const markSeen = (userId, tipIds) => mark(userId, 'seen', tipIds);
export const markDismissed = (userId, tipIds) => mark(userId, 'dismissed', tipIds);

function mark(userId, field, tipIds) {
  const record = loadRecord(userId);
  const now = new Date().toISOString();
  [].concat(tipIds).forEach((id) => {
    if (!isDone(record, id)) record[field][id] = now;
  });
  memory[userId] = record;
  try {
    localStorage.setItem(key(userId), JSON.stringify(record));
  } catch {
    /* ignore */
  }
}

export function resetRecord(userId) {
  delete memory[userId];
  try {
    localStorage.removeItem(key(userId));
  } catch {
    /* ignore */
  }
}

/* ---------------------------------------------------------------------
   Moving to the database later

   Table:
     user_tip (user_id, tip_id, status, at, PRIMARY KEY (user_id, tip_id))
       status: 'seen' | 'dismissed'   (first one wins; don't overwrite)

   Endpoints (take the user from the session, never from the request body):
     GET  /api/me/tips           -> { seen: { "create-rfq": "2026-…" }, dismissed: { … } }
     POST /api/me/tips/seen      { tipIds: ["create-rfq"] }
     POST /api/me/tips/dismissed { tipIds: ["supplier-list", "buy-coins"] }

   Then:
     loadRecord    -> await fetch('/api/me/tips').then(r => r.json())
     markSeen      -> fetch('/api/me/tips/seen', { method: 'POST', body: JSON.stringify({ tipIds }) })
     markDismissed -> fetch('/api/me/tips/dismissed', { method: 'POST', body: JSON.stringify({ tipIds }) })
   and make useFeatureTips await loadRecord before starting.
   --------------------------------------------------------------------- */
