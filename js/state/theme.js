/* Theme Manager - Light & Dark Mode with Smooth Motion Transition */

let currentTheme = localStorage.getItem('meathouse_theme') || 'dark';

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('meathouse_theme', theme);

  document.documentElement.classList.add('theme-transitioning');
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 550);
}

export function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initial setup
document.documentElement.setAttribute('data-theme', currentTheme);
