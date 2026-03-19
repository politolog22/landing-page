/* ============================================================
   MAIN JavaScript — Artem Dubovik Portfolio
   ============================================================ */

'use strict';

// ── Greeting based on time of day ──────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return 'Доброе утро';
  if (h >= 12 && h < 17) return 'Добрый день';
  if (h >= 17 && h < 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

function initGreeting() {
  const el = document.getElementById('greeting-text');
  if (el) el.textContent = getGreeting();
}

// ── Mobile sidebar toggle ───────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');

  if (!hamburger || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // Close on nav link click (mobile) — but not for anchor links (handled by initAnchorScroll)
  sidebar.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) {
      link.addEventListener('click', closeSidebar);
    }
  });
}

// ── Active nav link ─────────────────────────────────────────────
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === current || (current === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

// ── Animate elements on scroll ─────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.card, .update-card, .post-card, .project-card, .timeline-item, .stat-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

// ── Skill bar animation ─────────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width') || '0';
        target.style.width = width + '%';
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
}

// ── Current year in footer ──────────────────────────────────────
function initYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ── Reading time estimate ────────────────────────────────────────
function calcReadTime() {
  const content = document.querySelector('.post-content');
  const badge   = document.getElementById('read-time');
  if (!content || !badge) return;
  const words = content.textContent.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  badge.textContent = mins + ' мин читать';
}

// ── Smooth page transitions ─────────────────────────────────────
function initPageTransition() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (link.hasAttribute('download')) return;

    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s ease';
    setTimeout(() => { window.location.href = href; }, 200);
  });
}

// ── Resume download placeholder ─────────────────────────────────
function initResumeDownload() {
  document.querySelectorAll('.btn-download-resume').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Резюме скоро будет доступно для скачивания!');
    });
  });
}

// ── Toast notification ──────────────────────────────────────────
function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#e8e8e8',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateY(8px)',
    transition: 'all 0.3s ease',
    maxWidth: '320px',
    lineHeight: '1.4'
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Init page fade-in ───────────────────────────────────────────
function initFadeIn() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
}

// ── Copy code blocks ────────────────────────────────────────────
function initCopyCode() {
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = 'Копировать';
    Object.assign(btn.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      color: 'var(--text-muted)',
      padding: '4px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = '✓ Скопировано';
        setTimeout(() => { btn.textContent = 'Копировать'; }, 2000);
      });
    });
  });
}

// ── Smooth anchor scroll with offset ───────────────────────────
function scrollToAnchor(href) {
  const target = document.querySelector(href);
  if (!target) return;
  const offset = 32;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // Если открыт мобильный сайдбар — сначала закрываем, потом скроллим
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('overlay');
      const hamburger = document.getElementById('hamburger');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => scrollToAnchor(href), 350);
      } else {
        scrollToAnchor(href);
      }
    });
  });
}

// ── Remove white background from logo via Canvas ────────────────
function removeWhiteBg(imgEl, threshold) {
  threshold = threshold || 240;
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');

  imgEl.crossOrigin = 'anonymous';

  function process() {
    canvas.width  = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.drawImage(imgEl, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d    = data.data;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2];
      // убираем только почти-белые пиксели (все три канала высокие)
      if (r > threshold && g > threshold && b > threshold) {
        d[i+3] = 0;
      }
    }

    ctx.putImageData(data, 0, 0);
    imgEl.src = canvas.toDataURL('image/png');
  }

  if (imgEl.complete && imgEl.naturalWidth) {
    process();
  } else {
    imgEl.addEventListener('load', process);
  }
}

function initRemoveWhiteBg() {
  // отключено — используем CSS-подход для логотипов с белым фоном
}

// ── Career interactive tabs ─────────────────────────────────────
function initCareerTabs() {
  const items  = document.querySelectorAll('.career-item');
  const panels = document.querySelectorAll('.career-panel');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = item.getAttribute('data-index');

      items.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const panel = document.querySelector(`.career-panel[data-panel="${idx}"]`);
      if (panel) {
        panel.classList.add('active');

        // На мобильных — скроллим к панели с небольшой задержкой (ждём раскрытия)
        if (window.innerWidth <= 900) {
          setTimeout(() => {
            const headerH = 44; // высота верхнего мобильного хедера
            const panelTop = panel.getBoundingClientRect().top + window.scrollY - headerH - 12;
            window.scrollTo({ top: panelTop, behavior: 'smooth' });
          }, 50);
        }
      }
    });
  });
}

// ── Theme toggle ────────────────────────────────────────────────
function initThemeToggle() {
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (!btn) return;

  const html  = document.documentElement;

  // Синхронизируем иконку с текущим состоянием (атрибут уже мог быть выставлен инлайн-скриптом)
  function applyUI(isLight) {
    if (isLight) {
      icon.className    = 'fa-solid fa-sun';
      label.textContent = 'Тёмная тема';
    } else {
      icon.className    = 'fa-solid fa-moon';
      label.textContent = 'Светлая тема';
    }
  }

  applyUI(html.getAttribute('data-theme') === 'light');

  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      applyUI(false);
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      applyUI(true);
    }
  });
}

// ── More Panel (bottom nav «Ещё») ────────────────────────────────
function toggleMorePanel() {
  const panel = document.getElementById('morePanel');
  if (!panel) return;
  panel.classList.contains('open') ? closeMorePanel() : openMorePanel();
}

function openMorePanel() {
  const panel   = document.getElementById('morePanel');
  const overlay = document.getElementById('morePanelOverlay');
  const moreBtn = document.getElementById('moreBtn');
  if (!panel) return;

  overlay.style.display = 'block';
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    panel.classList.add('open');
  });

  if (moreBtn) moreBtn.classList.add('active');
  syncMorePanelTheme();
  document.body.style.overflow = 'hidden';

  // Инициализируем жесты при первом открытии
  initMorePanelGestures(panel);
}

function closeMorePanel() {
  const panel   = document.getElementById('morePanel');
  const overlay = document.getElementById('morePanelOverlay');
  const moreBtn = document.getElementById('moreBtn');
  if (!panel) return;

  // Сбрасываем inline-transform если был свайп
  panel.style.transition = '';
  panel.style.transform  = '';

  panel.classList.remove('open');
  overlay.classList.remove('visible');
  if (moreBtn) moreBtn.classList.remove('active');

  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

function initMorePanelGestures(panel) {
  // Не вешать повторно
  if (panel._gesturesInited) return;
  panel._gesturesInited = true;

  // ── Свайп вниз ──────────────────────────────────────────────────
  let startY   = 0;
  let currentY = 0;
  let dragging = false;
  let startedOnTopZone = false;

  panel.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    startY   = touch.clientY;
    currentY = touch.clientY;
    dragging = false;

    // Разрешаем тянуть за верхнюю зону (первые 56px панели)
    const panelTop = panel.getBoundingClientRect().top;
    startedOnTopZone = (touch.clientY - panelTop) <= 56;
  }, { passive: true });

  panel.addEventListener('touchmove', function(e) {
    if (!startedOnTopZone) return;
    const touch = e.touches[0];
    const dy    = touch.clientY - startY;
    if (dy < 0) return; // вверх — не двигаем

    dragging = true;
    currentY = touch.clientY;

    // Двигаем панель за пальцем
    panel.style.transition = 'none';
    panel.style.transform  = `translateY(${dy}px)`;
  }, { passive: true });

  panel.addEventListener('touchend', function() {
    if (!dragging) return;
    const dy = currentY - startY;

    if (dy > 80) {
      // Достаточно — закрываем с анимацией
      panel.style.transition = 'transform 0.25s ease';
      panel.style.transform  = 'translateY(100%)';
      setTimeout(() => closeMorePanel(), 250);
    } else {
      // Возвращаем на место
      panel.style.transition = 'transform 0.25s cubic-bezier(0.32,0.72,0,1)';
      panel.style.transform  = 'translateY(0)';
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.transform  = '';
      }, 260);
    }
    dragging = false;
  }, { passive: true });
}

function syncMorePanelTheme() {
  const icon   = document.getElementById('morePanelThemeIcon');
  const label  = document.getElementById('morePanelThemeLabel');
  const track  = document.getElementById('morePanelToggleTrack');
  if (!icon) return;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    icon.className    = 'fa-solid fa-sun';
    label.textContent = 'Тёмная тема';
    track.classList.add('on');
  } else {
    icon.className    = 'fa-solid fa-moon';
    label.textContent = 'Светлая тема';
    track.classList.remove('on');
  }
}

function toggleThemeFromPanel() {
  const html  = document.documentElement;
  // Иконки в сайдбаре (десктоп)
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  // Иконка в мобильном хедере
  const mobileIcon = document.getElementById('mobileThemeIcon');

  const isLight = html.getAttribute('data-theme') === 'light';
  if (isLight) {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    if (icon)       icon.className       = 'fa-solid fa-moon';
    if (label)      label.textContent    = 'Светлая тема';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-moon';
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (icon)       icon.className       = 'fa-solid fa-sun';
    if (label)      label.textContent    = 'Тёмная тема';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-sun';
  }
}

// ── Avatar press zoom ────────────────────────────────────────────
function initAvatarZoom() {
  const avatar = document.querySelector('.mobile-header-avatar');
  if (!avatar) return;

  function press()   { avatar.classList.add('pressed');    }
  function release() { avatar.classList.remove('pressed'); }

  // Touch
  avatar.addEventListener('touchstart',  press,   { passive: true });
  avatar.addEventListener('touchend',    release, { passive: true });
  avatar.addEventListener('touchcancel', release, { passive: true });

  // Mouse (десктоп / эмулятор)
  avatar.addEventListener('mousedown', press);
  avatar.addEventListener('mouseup',   release);
  avatar.addEventListener('mouseleave',release);
}

// ── DOMContentLoaded ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAvatarZoom();

  // Синхронизируем иконку в мобильном хедере с текущей темой
  const mobileIcon = document.getElementById('mobileThemeIcon');
  if (mobileIcon && document.documentElement.getAttribute('data-theme') === 'light') {
    mobileIcon.className = 'fa-solid fa-sun';
  }

  initFadeIn();
  initGreeting();
  initMobileNav();
  initActiveNav();
  initScrollAnimations();
  initSkillBars();
  initYear();
  calcReadTime();
  initResumeDownload();
  initCopyCode();
  initPageTransition();
  initCareerTabs();
  initRemoveWhiteBg();
  initAnchorScroll();
});
