/* ============================================================
   CareerStack – Theme Toggle (shared across all pages)
   ============================================================ */
(function () {
  const STORAGE_KEY = 'cs_theme';
  const root = document.documentElement;

  // Apply saved or system preference
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  // Initialise on load
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  // Listen for the toggle button (added to every navbar)
  document.addEventListener('click', function (e) {
    if (e.target.id === 'themeToggle' || e.target.closest('#themeToggle')) {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    }
  });
})();
