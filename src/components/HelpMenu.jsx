import { useEffect, useRef, useState } from 'react';

export default function HelpMenu({ onReplayTips }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="menu-wrap" ref={wrapRef}>
      <button
        className="icon-btn"
        aria-label="Help"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
          <circle cx="12" cy="17" r=".6" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="menu" role="menu">
          <button
            className="menu-item"
            role="menuitem"
            onClick={() => { setOpen(false); onReplayTips(); }}
          >
            <span className="menu-item-text">
              <span>Replay all tips</span>
              <small>Walk through every tip from the start</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
