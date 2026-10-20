import { useState } from 'react';

const capitalise = (s) => s[0].toUpperCase() + s.slice(1);

export default function RfqList({ rfqs, onScroll }) {
  const [view, setView] = useState('board');

  return (
    <section className="rfq">
      <div className="rfq-head">
        <h2>RFQ</h2>
        <div className="views">
          <button className="view-btn" id="view-list" aria-label="List view"
            aria-pressed={view === 'list'} onClick={() => setView('list')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
          </button>
          <button className="view-btn" id="view-board" aria-label="Board view"
            aria-pressed={view === 'board'} onClick={() => setView('board')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="4" height="12" /><path d="M9 4h5M9 8h5M9 12h5" /></svg>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filters" id="filter-bar">
          <label htmlFor="f-status">Filter By:</label>
          <select id="f-status" defaultValue="">
            <option value="">Status</option><option>Open</option><option>Closed</option><option>Expired</option>
          </select>
          <select id="f-port" aria-label="Port" defaultValue="">
            <option value="">Port</option><option>Singapore</option><option>Fujairah</option><option>Rotterdam</option>
          </select>
          <input id="f-from" aria-label="From date" placeholder="From Date" size="10" />
          <input id="f-to" aria-label="To date" placeholder="To Date" size="10" />
          <div className="search" id="rfq-search">
            <input id="f-search" aria-label="Search RFQ ID or Supplier Name" placeholder="Search RFQ ID or Supplier Name" />
            <button aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            </button>
          </div>
        </div>

        <div className="table-wrap" onScroll={onScroll}>
          <table>
            <thead>
              <tr><th>RFQ Details</th><th>Product(s)</th><th>Volume Range</th><th>Vessel</th><th>Bids Received</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rfqs.map((r) => (
                <tr key={r.id}>
                  <td><b>RFQ: {r.id}</b><br /><span className="sub">{r.port}<br />{r.at}</span></td>
                  <td>{r.products.map((p) => <div key={p}>{p}</div>)}</td>
                  <td>{r.volumes.map((v) => <div key={v}>{v}</div>)}</td>
                  <td>{r.vessel}</td>
                  <td>{r.bids}</td>
                  <td><span className={`pill ${r.status}`}>{capitalise(r.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
