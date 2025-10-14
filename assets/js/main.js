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
(function() {
    // Ngăn mở DevTools bằng F12 hoặc Ctrl+Shift+I / Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            alert('Chức năng này đã bị vô hiệu để bảo vệ nội dung.');
            return false;
        }
    });

    // Ngăn chuột phải (Copy hoặc Inspect)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('Tính năng chuột phải bị khóa để bảo vệ nội dung.');
        return false;
    });

    // Phát hiện DevTools mở (bằng timing detection)
    let checkStatus = function() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            alert('Phát hiện công cụ kiểm tra đang mở! Hãy đóng DevTools để tiếp tục.');
            window.location.reload();
        }
    };
    setInterval(checkStatus, 2000);

    // Ngăn chọn văn bản
    document.addEventListener('selectstart', e => e.preventDefault());

    // Ngăn copy và cắt
    ['copy', 'cut'].forEach(evt => {
        document.addEventListener(evt, function(e) {
            e.preventDefault();
            alert('Chức năng sao chép đã bị khóa!');
        });
    });
})();
