// What’s Friday — Coming Soon
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'hello@whatsfriday.com';
      try {
        await navigator.clipboard.writeText(email);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Email copied ✔';
        setTimeout(() => (copyBtn.textContent = original), 2000);
      } catch {
        // Fallback: open mailto if copy fails
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // Early access modal
  const modal = document.getElementById('early-modal');
  const openBtn = document.getElementById('open-early-access');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-modal');
  const form = document.getElementById('early-form');
  const overlay = modal ? modal.querySelector('.modal-overlay') : null;
  let lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const first = document.getElementById('ea-name');
    if (first) first.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') trapFocus(e);
  }

  function trapFocus(e) {
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const nodes = Array.prototype.slice.call(focusables).filter(el => !el.hasAttribute('disabled'));
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = 'hello@whatsfriday.com';
      const name = (document.getElementById('ea-name').value || '').trim();
      const uni = (document.getElementById('ea-uni').value || '').trim();
      const course = (document.getElementById('ea-course').value || '').trim();
      const year = (document.getElementById('ea-year').value || '').trim();
      const platform = (document.getElementById('ea-platform').value || '').trim();
      const notes = (document.getElementById('ea-notes').value || '').trim();

      const subject = "Early access for What's Friday";
      const lines = [
        "Hey What's Friday team,",
        '',
        "I'd love early access. Here are my details:",
        `- Name: ${name || 'N/A'}`,
        `- University: ${uni || 'N/A'}`,
        `- Course: ${course || 'N/A'}`,
        `- Starting Year: ${year || 'N/A'}`,
        `- Platform: ${platform || 'N/A'}`
      ];
      if (notes) {
        lines.push('', `Notes: ${notes}`);
      }
      const body = lines.join('\n');
      const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      closeModal();
    });
  }
})();
