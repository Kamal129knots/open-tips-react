// create-rfq-btn, supplier-btn and buy-coin-btn are feature-tip targets
// (see src/tips/tips.js). Keep those IDs stable.

export default function Hero({ user, coins }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <section className="hero">
      <div className="hello">
        <h1>Hello, {user.name}</h1>
        <div className="date">{today}</div>
        <div className="hero-actions">
          <button className="btn btn-primary" id="create-rfq-btn">Create RFQ</button>
          <button className="btn btn-light" id="supplier-btn">Supplier List</button>
        </div>
      </div>

      <div className="open-tile" aria-hidden="true">OPEN</div>

      <div className="coin-card" id="coin-card">
        <div className="coin-head">
          <div className="coin-title">Bunk Coin <span className="coin-dot" /></div>
          <button className="coin-plus" id="buy-coin-btn" aria-label="Buy Bunk Coins">+</button>
        </div>
        <div className="coin-stats">
          <div><span>Available</span><strong>{coins.available}</strong></div>
          <div><span>Utilised coins</span><strong>{coins.utilised}</strong></div>
        </div>
      </div>
    </section>
  );
}
