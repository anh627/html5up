// Main JavaScript for Vui Học STEM
document.addEventListener('DOMContentLoaded', function() {
    // Trạng thái để theo dõi modal và menu
    let isModalOpen = false;
    let isMenuOpen = false;

    // === Menu Functionality ===
    const openers = document.querySelectorAll('#menu .opener');
    openers.forEach(opener => {
        opener.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.parentElement;
            document.querySelectorAll('#menu > ul > li').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });
            parent.classList.toggle('active');
        });
    });

    // === PhET Modal Functionality ===
    const phetModal = document.getElementById('phetModal');
    const modalIframe = document.getElementById('modalIframe');
    const modalTitle = document.getElementById('modalTitle');
    const simCards = document.querySelectorAll('.sim-card');
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle');

    function openModal(url, title) {
        if (!phetModal || !modalIframe || !modalTitle) return;
        if (window.innerWidth <= 1024 && isMenuOpen) {
            closeMenu();
        }
        if (window.innerWidth <= 1024 && menuToggleBtn) {
            menuToggleBtn.style.display = 'none';
        }
        modalIframe.classList.add('loading');
        modalIframe.src = url;
        modalTitle.textContent = title;
        phetModal.classList.add('active');
        isModalOpen = true;
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';

        modalIframe.onload = () => {
            modalIframe.classList.remove('loading');
        };
    }

    function closeModal() {
        if (!phetModal || !modalIframe) return;
        modalIframe.src = '';
        phetModal.classList.remove('active');
        isModalOpen = false;
        if (window.innerWidth <= 1024 && menuToggleBtn) {
            menuToggleBtn.style.display = 'flex';
        }
        if (!isMenuOpen) {
            document.body.classList.remove('modal-open', 'menu-open');
            document.body.style.overflow = '';
        }
    }

    simCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            const title = card.getAttribute('data-title');
            openModal(url, title);
        });
    });

    const modalCloseBtn = document.querySelector('.phet-modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
        modalCloseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeModal();
        }, { passive: false });
    }

    const modalCloseTextBtn = document.querySelector('.phet-modal-close-text');
    if (modalCloseTextBtn) {
        modalCloseTextBtn.addEventListener('click', closeModal);
        modalCloseTextBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeModal();
        }, { passive: false });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen && window.innerWidth > 1024) {
            closeModal();
            e.preventDefault();
        }
    });

    const modalShareBtn = document.querySelector('.phet-modal-share');
    if (modalShareBtn) {
        modalShareBtn.addEventListener('click', () => {
            const url = modalIframe.src;
            if (navigator.share) {
                navigator.share({
                    title: modalTitle.textContent,
                    url: url
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    alert('Đã sao chép link: ' + url);
                }).catch(console.error);
            }
        });
    }

    // === Search Functionality ===
    const searchInput = document.getElementById('query');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            simCards.forEach(card => {
                const title = card.getAttribute('data-title').toLowerCase();
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                card.style.display = (query === '' || title.includes(query) || description.includes(query)) ? 'block' : 'none';
            });
        });
    }

    // === Mobile Menu ===
    let menuToggle = document.querySelector('.menu-toggle');
    let overlay = document.querySelector('.sidebar-overlay');
    let mobileMenuInitialized = false;
    let eventListeners = [];

    function createMobileMenu() {
        if (!menuToggle) {
            menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', 'Toggle Menu');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(menuToggle);
        }
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
    }

    function openMenu() {
        if (!sidebar) return;
        sidebar.classList.remove('inactive');
        if (overlay) overlay.classList.add('active');
        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        isMenuOpen = true;
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!sidebar) return;
        sidebar.classList.add('inactive');
        if (overlay) overlay.classList.remove('active');
        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        isMenuOpen = false;
        if (!isModalOpen) {
            document.body.classList.remove('menu-open', 'modal-open');
            document.body.style.overflow = '';
        }
    }

    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isMenuOpen) closeMenu();
        else openMenu();
    }

    function cleanupEventListeners() {
        eventListeners.forEach(({ element, event, handler }) => {
            if (element) element.removeEventListener(event, handler);
        });
        eventListeners = [];
    }

    function initMobileMenu() {
        if (!sidebar) return;
        cleanupEventListeners();
        if (window.innerWidth <= 768) {
            createMobileMenu();
            menuToggle = document.querySelector('.menu-toggle');
            overlay = document.querySelector('.sidebar-overlay');
            if (!isMenuOpen) sidebar.classList.add('inactive');
            if (menuToggle) menuToggle.style.display = 'flex';
            if (!mobileMenuInitialized) {
                const clickHandler = (e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(e); };
                const touchHandler = (e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(e); };
                if (menuToggle) {
                    menuToggle.addEventListener('click', clickHandler);
                    menuToggle.addEventListener('touchstart', touchHandler, { passive: false });
                    eventListeners.push({ element: menuToggle, event: 'click', handler: clickHandler });
                    eventListeners.push({ element: menuToggle, event: 'touchstart', handler: touchHandler });
                }
                if (overlay) {
                    const overlayHandler = () => closeMenu();
                    overlay.addEventListener('click', overlayHandler);
                    eventListeners.push({ element: overlay, event: 'click', handler: overlayHandler });
                }
                const sidebarLinks = sidebar.querySelectorAll('a:not(.opener)');
                sidebarLinks.forEach(link => {
                    const linkHandler = function() {
                        const href = this.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            setTimeout(closeMenu, 300);
                        }
                    };
                    link.addEventListener('click', linkHandler);
                    eventListeners.push({ element: link, event: 'click', handler: linkHandler });
                });
                mobileMenuInitialized = true;
            }
        } else {
            if (menuToggle) menuToggle.style.display = 'none';
            if (overlay) overlay.classList.remove('active');
            sidebar.classList.remove('inactive');
            isMenuOpen = false;
            if (!isModalOpen) {
                document.body.classList.remove('menu-open', 'modal-open');
                document.body.style.overflow = '';
            }
            mobileMenuInitialized = false;
        }
    }

    initMobileMenu();

    let resizeTimer;
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', function() {
        const currentWidth = window.innerWidth;
        const crossedBreakpoint = (lastWidth <= 768 && currentWidth > 768) || (lastWidth > 768 && currentWidth <= 768);
        if (crossedBreakpoint) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                initMobileMenu();
                lastWidth = currentWidth;
            }, 250);
        }
    });

    window.addEventListener('beforeunload', cleanupEventListeners);

    // === Xử lý nút Back trên điện thoại ===
    function pushHistoryState() {
        try {
            history.pushState(null, '', location.href);
        } catch (e) {}
    }

    const originalOpenModal = openModal;
    openModal = function(url, title) {
        pushHistoryState();
        originalOpenModal(url, title);
    };

    const originalOpenMenu = openMenu;
    openMenu = function() {
        pushHistoryState();
        originalOpenMenu();
    };

    window.addEventListener('popstate', function() {
        if (isModalOpen) {
            closeModal();
            history.pushState(null, '', location.href);
            return;
        }
        if (isMenuOpen) {
            closeMenu();
            history.pushState(null, '', location.href);
            return;
        }
    });

    // === Smooth Scrolling ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === Scroll Animation ===
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.features article, .posts article, .sim-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // === Prevent Double Tap Zoom on iOS ===
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });
});

// === Remove Preload Class ===
window.addEventListener('load', function() {
    setTimeout(() => document.body.classList.remove('is-preload'), 100);
});

// === Handle Visibility Change ===
document.addEventListener('visibilitychange', function() {
    const icons = document.querySelectorAll('.floating-icon');
    icons.forEach(icon => {
        icon.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
});
/* anti-devtools.js Mục đích: giảm khả năng người dùng casual mở DevTools (F12) hoặc copy nội dung. Lưu ý quan trọng: không có cách nào hoàn toàn bảo vệ mã JS trên client. Kỹ thuật này chỉ khiến việc mở/giải mã khó hơn đối với người dùng thông thường.

Cách dùng: chèn <script src="/path/to/anti-devtools.js"></script> ngay trước </body>. */ (function () { 'use strict';

// Cấu hình const config = { detectIntervalMs: 800,    // tần suất kiểm tra devtools sizeThreshold: 160,       // ngưỡng khác biệt outer/inner để nghi ngờ devtools redirectOnDetect: false,  // nếu true sẽ chuyển hướng khi phát hiện devtools redirectUrl: 'about:blank', wipeContentOnDetect: true // nếu true sẽ xóa nội dung trang khi phát hiện devtools };

// --- Chặn hành vi sao chép / chọn / chuột phải --- function blockCopySelection() { // chặn menu chuột phải document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, { passive: false });

// chặn chọn văn bản
document.addEventListener('selectstart', function (e) {
  e.preventDefault();
}, { passive: false });

// chặn copy / cut / paste
['copy', 'cut', 'paste'].forEach(evt => {
  document.addEventListener(evt, function (e) {
    e.preventDefault();
  }, { passive: false });
});

// chặn kéo thả văn bản
document.addEventListener('dragstart', function (e) { e.preventDefault(); }, { passive: false });

}

// --- Chặn phím tắt devtools phổ biến --- function blockShortcuts() { window.addEventListener('keydown', function (e) { // F12 if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); e.stopPropagation(); return false; }

// Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Ctrl+U (view-source), Ctrl+S, Ctrl+Shift+K
  if (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'u' || e.key === 's')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Ctrl+Shift+K (Firefox console)
  if (e.ctrlKey && e.shiftKey && e.key === 'K') {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}, true);

}

// --- Phát hiện DevTools (nhiều chiến thuật kết hợp) --- function createDevtoolsDetector() { let devtoolsOpen = false;

// 1) kiểm tra khác biệt kích thước cửa sổ (thủ thuật đơn giản)
function sizeCheck() {
  try {
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    return (widthDiff > config.sizeThreshold || heightDiff > config.sizeThreshold);
  } catch (e) {
    return false;
  }
}

// 2) kiểm tra console getter trick
function consoleCheck() {
  try {
    const re = /dev/; // dummy
    const el = new Image();
    let opened = false;
    Object.defineProperty(el, 'id', {
      get: function () {
        opened = true;
        return '';
      }
    });
    // Gọi console.log sẽ kích hoạt getter nếu Console đang mở và in object
    // (những trình duyệt hiện đại có thể khác nhau)
    console.log(el);
    // Một số console không trigger getter; opened có thể là false.
    return opened;
  } catch (e) {
    return false;
  }
}

// 3) timing check với debugger statement (có thể gây pause khi breakpoint)
function timingCheck() {
  try {
    const start = performance.now();
    // The following 'debugger' will pause only when DevTools has the pause-on-exception
    // or user set breakpoints; it's a heuristic — use cautiously.
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    return (end - start) > 100; // nếu mất nhiều thời gian, có thể DevTools đang mở
  } catch (e) {
    return false;
  }
}

function isOpen() {
  // kết hợp nhiều kiểm tra để giảm false positive
  if (sizeCheck()) return true;
  if (consoleCheck()) return true;
  // timingCheck có thể gây side-effect; để tùy chọn
  try {
    // tắt timingCheck theo mặc định để tránh pause lạ
    // if (timingCheck()) return true;
  } catch (e) { /* ignore */ }
  return false;
}

function startObserver(onDetect) {
  setInterval(function () {
    const open = isOpen();
    if (open && !devtoolsOpen) {
      devtoolsOpen = true;
      onDetect();
    } else if (!open && devtoolsOpen) {
      devtoolsOpen = false;
    }
  }, config.detectIntervalMs);
}

return { startObserver };

}

// --- Hành động khi phát hiện DevTools --- function onDevtoolsDetected() { try { // Xóa nội dung trang if (config.wipeContentOnDetect) { document.documentElement.innerHTML = ''; // thêm 1 thông điệp nhẹ (nếu muốn giữ) - comment nếu không cần // document.body.innerHTML = '<h1>Access denied</h1>'; }

// Chuyển hướng nếu cấu hình yêu cầu
  if (config.redirectOnDetect) {
    window.location.replace(config.redirectUrl);
  }

  // Ngoài ra: ta có thể gửi event tới server (fetch) để log — cẩn trọng với quyền riêng tư
  // navigator.sendBeacon('/log-devtools', JSON.stringify({ts: Date.now(), url: location.href}));
} catch (e) {
  // ignore
}

}

// --- Khởi chạy --- function init() { blockCopySelection(); blockShortcuts();

const detector = createDevtoolsDetector();
detector.startObserver(onDevtoolsDetected);

// Tối ưu UX: nếu cần cho admin/developer, cho phép mở bằng một mật khẩu tạm thời
// (ví dụ: Ctrl+Shift+Alt+D để tắt lớp bảo vệ) — dùng cẩn thận.
let adminTogglePressed = 0;
window.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'D' || e.key === 'd')) {
    adminTogglePressed = (adminTogglePressed + 1) % 2;
    if (adminTogglePressed === 1) {
      // disable protections
      window.removeEventListener('keydown', () => {});
    }
  }
});

}

// chạy khi DOM sẵn sàng if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

})();

