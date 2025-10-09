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
        // Đóng menu nếu đang mở trên mobile để tránh xung đột
        if (window.innerWidth <= 768 && isMenuOpen) {
            closeMenu();
        }
        // Ẩn menu-toggle trên mobile khi modal mở để tránh trùng nút đóng
        if (window.innerWidth <= 768 && menuToggleBtn) {
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
        // Hiển thị lại menu-toggle trên mobile khi đóng modal
        if (window.innerWidth <= 768 && menuToggleBtn) {
            menuToggleBtn.style.display = 'flex';
        }
        // Chỉ xóa overflow nếu menu cũng không mở
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
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });

    // Share simulation
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

    // === Search Functionality for Simulations ===
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

    // === Mobile Menu Toggle ===
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
        // Chỉ xóa overflow nếu modal cũng không mở
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
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
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
                const clickHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu(e);
                };
                const touchHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu(e);
                };
                if (menuToggle) {
                    menuToggle.addEventListener('click', clickHandler);
                    menuToggle.addEventListener('touchstart', touchHandler, { passive: false });
                    eventListeners.push(
                        { element: menuToggle, event: 'click', handler: clickHandler },
                        { element: menuToggle, event: 'touchstart', handler: touchHandler }
                    );
                }
                if (overlay) {
                    const overlayHandler = function() {
                        closeMenu();
                    };
                    overlay.addEventListener('click', overlayHandler);
                    eventListeners.push({ element: overlay, event: 'click', handler: overlayHandler });
                }
                const sidebarLinks = sidebar.querySelectorAll('a:not(.opener)');
                sidebarLinks.forEach(link => {
                    const linkHandler = function(e) {
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
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === Scroll Animation with Intersection Observer ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
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
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
});

// === Remove Preload Class ===
window.addEventListener('load', function() {
    setTimeout(function() {
        document.body.classList.remove('is-preload');
    }, 100);
});

// === Handle Visibility Change ===
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.querySelectorAll('.floating-icon').forEach(icon => {
            icon.style.animationPlayState = 'paused';
        });
    } else {
        document.querySelectorAll('.floating-icon').forEach(icon => {
            icon.style.animationPlayState = 'running';
        });
    }
});
