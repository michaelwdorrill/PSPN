// Apply before styles paint; a blocked storage API must not prevent reading.
(() => {
  const key = 'pspn-appearance';
  const valid = value => ['system', 'light', 'dark'].includes(value);
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch {}
  function apply() {
    document.documentElement.dataset.theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    const control = document.getElementById('appearance');
    if (control) control.value = preference;
  }
  apply();
  system.addEventListener('change', apply);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const control = document.getElementById('appearance');
    if (!control) return;
    apply();
    control.addEventListener('change', () => {
      preference = valid(control.value) ? control.value : 'system';
      try { localStorage.setItem(key, preference); } catch {}
      apply();
    });
  });
})();
