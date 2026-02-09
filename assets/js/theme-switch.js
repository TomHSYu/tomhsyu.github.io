document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeButtons = document.querySelectorAll('.theme-menu button');
  const themeStyle = document.getElementById('theme-style');

  if (!themeStyle) {
    console.warn("Theme stylesheet link not found with id 'theme-style'. Theme switching may not work.");
    return;
  }

  // Paths
  const currentHref = themeStyle.getAttribute('href');
  const basePath = currentHref.substring(0, currentHref.lastIndexOf('/css/') + 5);
  const lightCss = basePath + 'main.css';
  const darkCss = basePath + 'dark.css';

  // State
  let currentTheme = localStorage.getItem('theme') || 'system';

  // Function to apply theme
  function applyTheme(theme) {
    let useDark = false;

    if (theme === 'dark') {
      useDark = true;
    } else if (theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        useDark = true;
      }
    }

    if (useDark) {
      themeStyle.href = darkCss;
      // Add class to html/body if needed for specific overrides not covered by stylesheet swap
      document.documentElement.classList.add('dark');
    } else {
      themeStyle.href = lightCss;
      document.documentElement.classList.remove('dark');
    }

    // Update UI state
    themeButtons.forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Set initial theme
  applyTheme(currentTheme);

  // Event Listeners
  if (themeToggleBtn && themeMenu) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
      if (!themeMenu.contains(e.target) && !themeToggleBtn.contains(e.target)) {
        themeMenu.classList.remove('visible');
      }
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedTheme = e.target.dataset.theme;
      currentTheme = selectedTheme;
      localStorage.setItem('theme', currentTheme);
      applyTheme(currentTheme);
      themeMenu.classList.remove('visible');
    });
  });

  // System preference listener
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    });
  }
});
