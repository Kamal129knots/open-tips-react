// Feature tips, in the order a first-time user walks through them.
//
// The one rule: each user sees the tips they haven't seen yet, in this order.
//   - First-time user: has seen nothing, so they get every tip.
//   - Returning user: has seen the older ones, so only newly added tips show.
//     That's "what's new". No tags or dates needed.
//
// To announce a new feature: add an entry (usually at the end).
// To retire one: remove it only when the feature itself goes away,
// because first-time users still need it.
//
// `element` is a CSS selector for the feature on the page. Keep those IDs
// stable in the components.

export const TIPS = [
  {
    id: 'create-rfq',
    element: '#create-rfq-btn',
    title: 'Create an RFQ',
    description: 'Post your bunker requirement with product, port, volume and vessel. Suppliers on OPEN send bids against it.',
    side: 'bottom',
    align: 'start',
  },
  {
    id: 'supplier-list',
    element: '#supplier-btn',
    title: 'Your suppliers',
    description: 'See the suppliers you trade with and invite new ones to bid on your RFQs.',
    side: 'bottom',
    align: 'start',
  },
  {
    id: 'buy-coins',
    element: '#buy-coin-btn',
    title: 'Buy Bunk Coins',
    description: 'Top up your balance by card. Coins are credited to your account once payment clears.',
    side: 'bottom',
    align: 'end',
  },
];
