import { useCallback, useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tips-theme.css';
import { isDone, loadRecord, markDismissed, markSeen } from './tipStore.js';

const KNOT_MARK = `
<svg class="ok-knot" width="18" height="18" viewBox="0 0 34 34" fill="none" stroke-width="4" aria-hidden="true">
  <circle cx="11" cy="17" r="7" stroke="#e5484d"/>
  <circle cx="23" cy="17" r="7" stroke="#30a46c"/>
  <circle cx="17" cy="11" r="7" stroke="#5b6cf0"/>
  <circle cx="17" cy="23" r="7" stroke="#7c3aed"/>
</svg>`;

/**
 * Shows the tips this user hasn't seen or dismissed, one after another, as soon as the
 * page loads. Returns `replay()` to walk through every tip again.
 *
 *   const { replay } = useFeatureTips({ tips: TIPS, userId: user.id });
 *
 * Shown   → the tip is marked seen as soon as it appears.
 * Next    → moves on ("Got it" on the last one closes).
 * Dismiss → closes; the tips left in this run that the user never got to
 *           are marked dismissed. Seen or dismissed, a tip won't show again.
 * Replay  → shows every tip; doesn't change the record.
 */
export function useFeatureTips({ tips, userId, startDelay = 400 }) {
  const tourRef = useRef(null);

  const start = useCallback(({ replay = false } = {}) => {
    const record = loadRecord(userId);
    const steps = replay ? tips : tips.filter((t) => !isDone(record, t.id));
    if (steps.length === 0) return false;

    // A user who has seen or dismissed tips before is a returning user, so these are new features.
    const isNew = !replay && tips.some((t) => isDone(record, t.id));

    const dismiss = (d) => {
      if (!replay) {
        const rest = steps.slice((d.getActiveIndex() ?? 0) + 1);
        if (rest.length) markDismissed(userId, rest.map((t) => t.id));
      }
      d.destroy();
    };

    // Marks the tip seen, then adds the brand header, Dismiss link and progress dots
    const decorate = (popover, { state, driver: d }) => {
      if (!replay) markSeen(userId, steps[state.activeIndex].id);
      popover.wrapper.classList.toggle('ok-tip-new', isNew);

      let eyebrow = popover.wrapper.querySelector('.ok-eyebrow');
      if (!eyebrow) {
        eyebrow = document.createElement('div');
        eyebrow.className = 'ok-eyebrow';
        popover.title.before(eyebrow);
      }
      eyebrow.innerHTML = `${KNOT_MARK}<span class="ok-eyebrow-label">${isNew ? 'New in OPEN' : 'Feature tip'}</span>`;

      const footer = popover.footer;
      footer.querySelectorAll('.ok-dismiss, .ok-progress').forEach((n) => n.remove());

      const dismissBtn = document.createElement('button');
      dismissBtn.type = 'button';
      dismissBtn.className = 'ok-dismiss';
      dismissBtn.textContent = replay ? 'Close' : 'Dismiss';
      dismissBtn.addEventListener('click', () => dismiss(d));
      footer.prepend(dismissBtn);

      if (steps.length > 1) {
        const dots = document.createElement('div');
        dots.className = 'ok-progress';
        dots.setAttribute('aria-label', `Tip ${state.activeIndex + 1} of ${steps.length}`);
        dots.innerHTML = steps
          .map((_, i) => `<i class="${i === state.activeIndex ? 'on' : i < state.activeIndex ? 'done' : ''}"></i>`)
          .join('');
        dismissBtn.after(dots);
      }

      // Keyboard focus on the main action rather than Dismiss
      requestAnimationFrame(() => popover.nextButton?.focus({ preventScroll: true }));
    };

    tourRef.current?.destroy();
    tourRef.current = driver({
      steps: steps.map((t) => ({
        element: t.element,
        popover: { title: t.title, description: t.description, side: t.side, align: t.align },
      })),
      popoverClass: 'ok-tip',
      popoverOffset: 14,
      overlayColor: '#050a1a',
      overlayOpacity: 0.45,
      stagePadding: 6,
      stageRadius: 10,
      allowClose: false, // only Dismiss or Next / Got it end the run
      overlayClickBehavior: 'none',
      showButtons: ['next'],
      showProgress: false,
      nextBtnText: 'Next →',
      doneBtnText: 'Got it',
      onPopoverRender: decorate,
      onNextClick: (_el, _step, { driver: d }) => {
        if (d.isLastStep()) d.destroy();
        else d.moveNext();
      },
    });
    tourRef.current.drive();
    return true;
  }, [tips, userId]);

  // On page load ("login"): show unseen tips, if any.
  useEffect(() => {
    const timer = setTimeout(() => start(), startDelay);
    return () => {
      clearTimeout(timer);
      tourRef.current?.destroy();
      tourRef.current = null;
    };
  }, [start, startDelay]);

  const replay = useCallback(() => start({ replay: true }), [start]);

  return { replay };
}
