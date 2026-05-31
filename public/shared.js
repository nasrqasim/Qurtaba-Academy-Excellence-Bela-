/* ========================================
   Qurtaba School of Excellence Bela - Shared JS
   Sidebar, Mobile Menu, Dark Mode, Nav, Auth & Theme
   ======================================== */

const API_BASE = '/api';

window.onPageLoad = function(initFn) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initFn);
  } else {
    initFn();
  }
};

// Helper for fetching data with auth
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('qurtaba_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('qurtaba_token');
    localStorage.removeItem('qurtaba_user');
    window.location.href = 'login.html';
    return null;
  }
  return res.json();
}

(function () {
  const PUBLIC_PAGES = [
    'index.html',
    'login.html',
    'signup.html',
    'about.html',
    'contact.html',
    'gallery.html',
    'verification.html',
    'student-admission.html',
    'activities.html',
    'programs.html',
    '' // Root path
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isPublicPage = PUBLIC_PAGES.some(page => currentPage.toLowerCase() === page.toLowerCase());

  // ---- Auth Security Validation ----
  const token = localStorage.getItem('qurtaba_token');
  const currentUser = localStorage.getItem('qurtaba_user') ? JSON.parse(localStorage.getItem('qurtaba_user')) : null;

  if (!isPublicPage) {
    if (!token || !currentUser) {
      window.location.href = 'login.html';
      return;
    }

    const role = currentUser.role;
    const pageName = currentPage.toLowerCase();

    // Enforce routing locks
    if (role === 'Student') {
      if (pageName !== 'student-dashboard.html') {
        window.location.href = 'student-dashboard.html';
        return;
      }
    } else if (role === 'Teacher') {
      if (pageName !== 'teacher-dashboard.html' && pageName !== 'timetable.html') {
        window.location.href = 'teacher-dashboard.html';
        return;
      }
    } else if (role === 'Staff') {
      if (pageName !== 'staff-dashboard.html') {
        window.location.href = 'staff-dashboard.html';
        return;
      }
    } else if (role === 'Admin') {
      // Hide Settings page from general Admins
      if (pageName === 'settings.html' || pageName === 'roles-permissions.html' || pageName === 'user-management.html' || pageName === 'system-settings.html' || pageName === 'security-settings.html') {
        window.location.href = 'dashboard.html';
        return;
      }
    } else if (role === 'Super Admin') {
      // Redirect legacy standalone settings pages to the single settings.html
      if (pageName === 'roles-permissions.html' || pageName === 'user-management.html' || pageName === 'system-settings.html' || pageName === 'security-settings.html') {
        window.location.href = 'settings.html';
        return;
      }
    }
  }

  // ---- Dynamic Configuration / Theme State ----
  let systemSettings = {
    schoolName: 'Qurtaba School of Excellence Bela',
    schoolLogo: 'logo.jpg',
    themeColor: '#3525cd'
  };

  // ---- Sidebar Data based on Role ----
  let NAV_ITEMS = [];
  let SETTINGS_ITEMS = [];

  const userRole = currentUser ? currentUser.role : null;

  if (userRole === 'Super Admin' || userRole === 'Admin') {
    NAV_ITEMS = [
      { icon: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
      {
        icon: 'group', label: 'Students', href: '#', hasChildren: true,
        children: [
          { icon: 'manage_search', label: 'Student List', href: 'students.html' },
          { icon: 'person_add', label: 'Admission', href: 'admission.html' },
          { icon: 'how_to_reg', label: 'Registration', href: 'student-registration.html' },
          { icon: 'verified', label: 'Verification System', href: 'verification-mgmt.html' },
        ]
      },
      {
        icon: 'how_to_reg', label: 'Attendance', href: '#', hasChildren: true,
        children: [
          { icon: 'list_alt', label: 'Attendance List', href: 'attendance.html' },
          { icon: 'fact_check', label: 'Mark Attendance', href: 'mark-attendance.html' },
        ]
      },
      {
        icon: 'payments', label: 'Fee Management', href: '#', hasChildren: true,
        children: [
          { icon: 'receipt_long', label: 'Fee List', href: 'fees.html' },
          { icon: 'add_card', label: 'Collect Fee', href: 'collect-fee.html' },
        ]
      },
      {
        icon: 'quiz', label: 'Exams & Results', href: '#', hasChildren: true,
        children: [
          { icon: 'assignment', label: 'Exam Management', href: 'exams.html' },
          { icon: 'grade', label: 'Results (Part 1)', href: 'results.html' },
          { icon: 'grade', label: 'Results (Part 2)', href: 'results2.html' },
        ]
      },
      { icon: 'calendar_month', label: 'Timetable', href: 'timetable.html' },
      {
        icon: 'badge', label: 'Staff & Payroll', href: '#', hasChildren: true,
        children: [
          { icon: 'people', label: 'Staff & Teachers', href: 'staff.html' },
          { icon: 'person_add', label: 'Staff Registration', href: 'staff-registration.html' },
          { icon: 'history', label: 'Payroll History', href: 'payroll-history.html' },
          { icon: 'account_balance', label: 'Process Month', href: 'process-month.html' },
          { icon: 'payments', label: 'Payments', href: 'payments.html' },
        ]
      },
      {
        icon: 'school', label: 'Programs Management', href: '#', hasChildren: true,
        children: [
          { icon: 'list_alt', label: 'Programs List', href: 'programs-list.html' },
          { icon: 'add_box', label: 'Add Program', href: 'add-program.html' },
        ]
      },
      {
        icon: 'account_balance_wallet', label: 'Accounting', href: '#', hasChildren: true,
        children: [
          { icon: 'account_balance_wallet', label: 'Accounting Home', href: 'accounting.html' },
          { icon: 'summarize', label: 'Monthly Report', href: 'monthly-report.html' },
          { icon: 'receipt', label: 'Record Expense', href: 'record-expense.html' },
        ]
      },
      {
        icon: 'gallery_thumbnail', label: 'Gallery Management', href: '#', hasChildren: true,
        children: [
          { icon: 'collections', label: 'Facilities List', href: 'facilities-list.html' },
          { icon: 'add_photo_alternate', label: 'Add Facility', href: 'add-facility.html' },
        ]
      },
      {
        icon: 'local_activity', label: 'Student Activities', href: '#', hasChildren: true,
        children: [
          { icon: 'list_alt', label: 'Activities List', href: 'admin-activities.html' },
          { icon: 'add_box', label: 'Add Activity', href: 'add-activity.html' },
        ]
      },
      {
        icon: 'notifications', label: 'Notifications', href: '#', hasChildren: true,
        children: [
          { icon: 'list_alt', label: 'Notifications List', href: 'notifications.html' },
          { icon: 'add_comment', label: 'Add Notification', href: 'add-notification.html' },
        ]
      },
      {
        icon: 'school', label: 'Academic Setup', href: '#', hasChildren: true,
        children: [
          { icon: 'settings_suggest', label: 'General Setup', href: 'academic-setup.html' },
          { icon: 'book', label: 'Subjects', href: 'subjects.html' },
          { icon: 'add_business', label: 'Add Class', href: 'add-class.html' },
        ]
      },
      { icon: 'trending_up', label: 'Performance', href: 'performance.html' },
    ];

    if (userRole === 'Super Admin') {
      SETTINGS_ITEMS = [
        { icon: 'settings', label: 'Settings', href: 'settings.html' }
      ];
    }
  } else if (userRole === 'Student') {
    NAV_ITEMS = [
      { icon: 'dashboard', label: 'Dashboard', href: 'student-dashboard.html' }
    ];
  } else if (userRole === 'Teacher') {
    NAV_ITEMS = [
      { icon: 'dashboard', label: 'Dashboard', href: 'teacher-dashboard.html' },
      { icon: 'calendar_month', label: 'Timetable', href: 'timetable.html' }
    ];
  } else if (userRole === 'Staff') {
    NAV_ITEMS = [
      { icon: 'dashboard', label: 'Dashboard', href: 'staff-dashboard.html' }
    ];
  }

  function isActive(href) {
    return href === currentPage || href.replace('.html', '') === currentPage.replace('.html', '');
  }

  function buildNavItem(item) {
    if (item.hasChildren) {
      const anyChildActive = item.children.some(c => isActive(c.href));
      return `
        <div class="nav-group">
          <button class="nav-link-parent w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/60 rounded-lg mx-0 transition-all duration-200 font-body text-sm ${anyChildActive ? 'open' : ''}" onclick="toggleSubmenu(this)">
            <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
            <span class="flex-1 text-left">${item.label}</span>
            <span class="material-symbols-outlined text-[18px] arrow">chevron_right</span>
          </button>
          <div class="submenu space-y-0.5 ${anyChildActive ? 'open' : ''}">
            ${item.children.map(child => `
              <a href="${child.href}" class="nav-link flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-variant/60 rounded-lg transition-all duration-200 font-body text-sm ${isActive(child.href) ? 'active' : ''}">
                <span class="material-symbols-outlined text-[16px]">${child.icon}</span>
                <span>${child.label}</span>
              </a>`).join('')}
          </div>
        </div>`;
    } else {
      return `
        <a href="${item.href}" class="nav-link flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/60 rounded-lg transition-all duration-200 font-body text-sm ${isActive(item.href) ? 'active' : ''}">
          <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
          <span>${item.label}</span>
        </a>`;
    }
  }

  // ---- Render Sidebar ----
  function renderSidebar() {
    const sidebarEl = document.getElementById('sidebar');
    if (!sidebarEl) return;

    let subText = 'Admin Portal';
    if (userRole === 'Student') subText = 'Student Portal';
    else if (userRole === 'Teacher') subText = 'Teacher Portal';
    else if (userRole === 'Staff') subText = 'Staff Portal';
    else if (userRole === 'Super Admin') subText = 'Super Admin';

    let settingsHtml = '';
    if (SETTINGS_ITEMS.length > 0) {
      settingsHtml = `
        <div class="px-3 pt-4 mt-4 border-t border-outline-variant/20 space-y-0.5 shrink-0">
          <p class="px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Configuration</p>
          ${SETTINGS_ITEMS.map(item => `
            <a href="${item.href}" class="nav-link flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/60 rounded-lg transition-all duration-200 font-body text-sm ${isActive(item.href) ? 'active' : ''}">
              <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
              <span>${item.label}</span>
            </a>`).join('')}
        </div>
      `;
    }

    sidebarEl.innerHTML = `
      <!-- Logo/Brand -->
      <div class="px-5 mb-6 flex items-center gap-3 shrink-0">
        <img src="${systemSettings.schoolLogo}" alt="Logo" class="w-10 h-10 object-contain shrink-0 rounded-lg"/>
        <div class="overflow-hidden">
          <h1 class="text-sm font-bold text-on-surface leading-tight school-name-lbl">${systemSettings.schoolName}</h1>
          <p class="text-xs text-on-surface-variant">${subText}</p>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="flex-1 px-3 space-y-0.5 overflow-y-auto">
        ${NAV_ITEMS.map(buildNavItem).join('')}
      </nav>

      <!-- Settings & Logout Divider -->
      ${settingsHtml}
      
      <div class="px-3 pb-4 space-y-0.5 shrink-0 ${SETTINGS_ITEMS.length === 0 ? 'pt-4 mt-4 border-t border-outline-variant/20' : ''}">
        <a href="#" onclick="doLogout(event)" class="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-all duration-200 font-body text-sm">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </a>
      </div>`;
  }

  // ---- Render Top Bar ----
  function renderTopBar() {
    const topbarEl = document.getElementById('topbar');
    if (!topbarEl) return;

    const initial = currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U';
    const fullName = currentUser ? currentUser.name : 'User';
    const displayRole = currentUser ? currentUser.role : 'Guest';

    topbarEl.innerHTML = `
      <div class="flex items-center gap-3">
        <button id="mobile-menu-btn" class="md:hidden text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-colors" onclick="toggleMobileSidebar()">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <span class="hidden md:block text-lg font-black text-primary font-headline tracking-tight school-name-lbl">${systemSettings.schoolName}</span>
        <div class="relative hidden lg:block ml-2">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-72"/>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" onclick="window.location='notifications.html'">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notif-dot"></span>
        </button>
        <button id="dark-mode-btn" class="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" onclick="toggleDarkMode()">
          <span class="material-symbols-outlined">dark_mode</span>
        </button>
        <div class="h-8 w-px bg-outline-variant/30 mx-1"></div>
        <div class="flex items-center gap-2 hover:bg-surface-container-high rounded-full pl-1 pr-3 py-1 transition-colors cursor-pointer" onclick="goToDashboardHome()">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold text-primary-important-inner">${initial}</div>
          <div class="flex flex-col items-start leading-none hidden sm:flex">
            <span class="text-sm font-semibold text-on-surface">${fullName}</span>
            <span class="text-[10px] text-on-surface-variant">${displayRole}</span>
          </div>
        </div>
      </div>`;
  }

  // ---- Navigation Helper ----
  window.goToDashboardHome = function() {
    if (!currentUser) return;
    const r = currentUser.role;
    if (r === 'Super Admin' || r === 'Admin') window.location.href = 'dashboard.html';
    else if (r === 'Student') window.location.href = 'student-dashboard.html';
    else if (r === 'Teacher') window.location.href = 'teacher-dashboard.html';
    else if (r === 'Staff') window.location.href = 'staff-dashboard.html';
  };

  // ---- Logout Handler ----
  window.doLogout = function(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('qurtaba_token');
    localStorage.removeItem('qurtaba_user');
    window.location.href = 'login.html';
  };

  // ---- Submenu Toggle ----
  window.toggleSubmenu = function (btn) {
    btn.classList.toggle('open');
    const submenu = btn.nextElementSibling;
    if (submenu) submenu.classList.toggle('open');
  };

  // ---- Mobile Sidebar ----
  window.toggleMobileSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  };

  // ---- Dark Mode ----
  function applyDarkMode() {
    const isDark = localStorage.getItem('qurtaba-dark') === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  }
  window.toggleDarkMode = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('qurtaba-dark', isDark);
  };

  // ---- Premium Dynamic Configuration Injection ----
  function applyDynamicConfig() {
    // 1. Inject Style Overrides for Dynamic Hex Theme Color
    const themeColor = systemSettings.themeColor || '#3525cd';
    let dynamicStyle = document.getElementById('dynamic-theme-style');
    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.id = 'dynamic-theme-style';
      document.head.appendChild(dynamicStyle);
    }
    dynamicStyle.innerHTML = `
      .text-primary, .text-primary-important { color: ${themeColor} !important; }
      .bg-primary, .bg-primary-important, .btn-primary { background-color: ${themeColor} !important; }
      .border-primary, .border-primary-important { border-color: ${themeColor} !important; }
      .nav-link:hover { color: ${themeColor} !important; background-color: ${themeColor}14 !important; }
      .nav-link.active { color: ${themeColor} !important; background: linear-gradient(135deg, ${themeColor}1f, ${themeColor}14) !important; }
      .nav-link.active::before { background-color: ${themeColor} !important; }
      .nav-link-parent:hover { color: ${themeColor} !important; background-color: ${themeColor}14 !important; }
      .input-field:focus, .form-input:focus { border-color: ${themeColor} !important; box-shadow: 0 0 0 4px ${themeColor}1a !important; }
      .focus\\:ring-primary:focus { --tw-ring-color: ${themeColor} !important; }
      .focus\\:border-primary:focus { border-color: ${themeColor} !important; }
      .accent-primary { accent-color: ${themeColor} !important; }
      .text-primary-important-inner { color: #ffffff !important; }
    `;

    // 2. Update all school name labels dynamically
    document.querySelectorAll('.school-name-lbl').forEach(el => {
      el.textContent = systemSettings.schoolName;
    });

    // 3. Update all school logos dynamically
    document.querySelectorAll('#sidebar img[alt="Logo"], .auth-left img[alt="Logo"], img.school-logo-img').forEach(el => {
      el.src = systemSettings.schoolLogo || 'logo.jpg';
    });

    // 4. Update Document Title
    const currentTitle = document.title.split('–')[0].trim() || 'Portal';
    document.title = `${currentTitle} – ${systemSettings.schoolName}`;

    // 5. Update public navbar if on public page
    if (isPublicPage) {
      renderPublicNavbar();
    }
  }

  function renderPublicNavbar() {
    // Update logo
    document.querySelectorAll('nav img[alt="Logo"], nav img[src*="logo.jpg"]').forEach(el => {
      el.src = systemSettings.schoolLogo || 'logo.jpg';
    });
    
    // Update school name
    document.querySelectorAll('nav span.text-xl, nav .school-name-lbl').forEach(el => {
      el.textContent = systemSettings.schoolName;
    });

    // Hide theme switcher on public portals
    const themeBtn = document.getElementById('theme-toggle') || document.querySelector('#theme-toggle') || document.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.style.display = 'none';
      
      // Hide adjacent divider if any
      const nextSibling = themeBtn.nextElementSibling;
      if (nextSibling && (nextSibling.classList.contains('w-px') || nextSibling.tagName === 'DIV')) {
        nextSibling.style.display = 'none';
      }
      const prevSibling = themeBtn.previousElementSibling;
      if (prevSibling && (prevSibling.classList.contains('w-px') || prevSibling.tagName === 'DIV')) {
        prevSibling.style.display = 'none';
      }
    }

    // Hide "Home" page link if on home page (index.html or root)
    const isHome = currentPage.toLowerCase() === 'index.html' || currentPage === '' || currentPage === '/';
    document.querySelectorAll('nav a').forEach(a => {
      if (a.textContent.trim().toLowerCase() === 'home') {
        if (isHome) {
          a.style.display = 'none';
        } else {
          a.style.display = '';
        }
      }
    });

    // Update dashboard/login button dynamically if already logged in
    const hasToken = localStorage.getItem('qurtaba_token');
    const userJson = localStorage.getItem('qurtaba_user');
    if (hasToken && userJson) {
      try {
        const u = JSON.parse(userJson);
        let target = 'login.html';
        if (u.role === 'Student') target = 'student-dashboard.html';
        else if (u.role === 'Teacher') target = 'teacher-dashboard.html';
        else if (u.role === 'Staff') target = 'staff-dashboard.html';
        else if (u.role === 'Admin' || u.role === 'Super Admin') target = 'dashboard.html';

        document.querySelectorAll('nav button, nav a').forEach(el => {
          const text = el.textContent.trim().toLowerCase();
          if (text === 'dashboard' || text === 'login') {
            el.setAttribute('onclick', `window.location='${target}'`);
            if (el.tagName === 'A') {
              el.setAttribute('href', target);
            }
            el.textContent = 'Dashboard';
          }
        });
      } catch(e) {}
    }
  }

  async function loadSystemConfig() {
    try {
      const res = await fetch('/api/settings/system');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          systemSettings = data;
          applyDynamicConfig();
        }
      }
    } catch (e) {
      console.error('Error loading system settings:', e);
    }
  }

  // ---- Init ----
  window.onPageLoad(function () {
    applyDarkMode();
    
    // Initial apply with local/default config
    applyDynamicConfig();
    
    // Load config from MongoDB database
    loadSystemConfig();

    renderSidebar();
    renderTopBar();

    // Close sidebar on overlay click
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.addEventListener('click', toggleMobileSidebar);

    // Page fade-in transition
    document.body.classList.add('page-fade-in');

    // Fetch dashboard stats if on the admin dashboard
    if (currentPage === 'dashboard.html') {
      updateDashboardStats();
    }
  });

  async function updateDashboardStats() {
    try {
      const stats = await apiFetch('/stats');
      if (!stats) return;

      const mappings = {
        'Total Students': stats.totalStudents,
        'Total Teachers': stats.totalTeachers,
        'Total Staff': stats.totalStaff,
        'Total Classes': stats.totalClasses,
        'Pending Admissions': stats.pendingAdmissions,
        'Total Revenue': `₨ ${(stats.totalRevenue || 0).toLocaleString()}`,
        'Fee Collections': `₨ ${(stats.feeCollections || 0).toLocaleString()}`,
        'Notifications Count': stats.notificationsCount || 0
      };

      document.querySelectorAll('.stat-card').forEach(card => {
        const label = card.querySelector('p')?.textContent;
        const valueEl = card.querySelector('h3');
        if (label && valueEl && mappings[label] !== undefined) {
          valueEl.textContent = mappings[label];
        }
      });
    } catch (e) {
      console.error('Error updating stats:', e);
    }
  }

})();

/**
 * Fast image upload: Sharp optimize on server → Cloudinary CDN URL.
 * @param {File} file
 * @param {string} category - student | staff | program | facility | logo | document | general
 * @param {{ onStart?: () => void, onDone?: (url: string) => void }} [hooks]
 * @returns {Promise<string|null>} Cloudinary or local URL
 */
window.fetchWithTimeout = async function fetchWithTimeout(url, options = {}, ms = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again or submit without large files.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

window.uploadOptimizedFile = async function uploadOptimizedFile(file, category = 'general', hooks = {}) {
  if (!file || !file.size) return null;
  hooks.onStart?.();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  const res = await fetchWithTimeout('/api/upload', { method: 'POST', body: formData }, 25000);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  hooks.onDone?.(data.url);
  return data.url;
};

/** Preview URL for img src (Cloudinary auto-format or local path) */
window.resolveImageUrl = function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) {
    if (url.includes('res.cloudinary.com') && !url.includes('/f_auto,q_auto')) {
      return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
    }
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
};

window.showTableSkeleton = function showTableSkeleton(tbody, colCount = 7, rowCount = 6) {
  if (!tbody) return;
  const cell = '<td class="py-3 px-4"><div class="skeleton h-4 w-full rounded"></div></td>';
  const row = `<tr>${cell.repeat(colCount)}</tr>`;
  tbody.innerHTML = row.repeat(rowCount);
};

window.optimizePublicImages = function optimizePublicImages() {
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    if (img.closest('nav')) return;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (!img.sizes && img.classList.contains('w-full')) {
      img.sizes = '(max-width: 768px) 100vw, 50vw';
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.optimizePublicImages());
} else {
  window.optimizePublicImages();
}
