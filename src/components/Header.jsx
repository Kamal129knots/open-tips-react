import HelpMenu from './HelpMenu.jsx';

function Logo() {
  return (
    <div className="logo">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" strokeWidth="4" aria-hidden="true">
        <circle cx="11" cy="17" r="7" stroke="#e5484d" />
        <circle cx="23" cy="17" r="7" stroke="#30a46c" />
        <circle cx="17" cy="11" r="7" stroke="#5b6cf0" />
        <circle cx="17" cy="23" r="7" stroke="#7c3aed" />
      </svg>
      <span>129<br />KNOTS</span>
    </div>
  );
}

export default function Header({ user, onReplayTips }) {
  return (
    <>
      <header className="topbar">
        <button className="icon-btn" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
        </button>
        <Logo />
        <span className="company">{user.company}</span>
        <span className="spacer" />
        <HelpMenu onReplayTips={onReplayTips} />
        <button className="icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21h4" /></svg>
          <span className="badge">134</span>
        </button>
        <button className="icon-btn" aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18a6 6 0 0 1 11 0" /></svg>
        </button>
      </header>

      <nav className="nav">
        <div className="tabs">
          <button className="tab">BAAS</button>
          <button className="tab">Trade Support Program</button>
          <button className="tab" aria-current="page">OPEN</button>
        </div>
      </nav>
    </>
  );
}
