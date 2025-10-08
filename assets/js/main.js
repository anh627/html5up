// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle opener clicks for dropdown menus
    const openers = document.querySelectorAll('#menu .opener');
    
    openers.forEach(opener => {
        opener.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.parentElement;
            const isActive = parent.classList.contains('active');
            
            // Close all other menus
            document.querySelectorAll('#menu > ul > li').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current menu
            parent.classList.toggle('active');
        });
    });
    
    // ============ PHẦN SỬA ĐỔI CHÍNH ============
    
    // Mobile menu toggle - Cải tiến
    let menuToggle = document.querySelector('.menu-toggle');
    let overlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.getElementById('sidebar');
    
    // Hàm tạo menu toggle và overlay
    function createMobileMenu() {
        // Tạo menu toggle nếu chưa có
        if (!menuToggle) {
            menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.setAttribute('aria-label', 'Toggle Menu');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(menuToggle);
        }
        
        // Tạo overlay nếu chưa có
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
    }
    
    // Hàm toggle menu
    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const isOpen = !sidebar.classList.contains('inactive');
        
        if (isOpen) {
            // Đóng menu
            sidebar.classList.add('inactive');
            overlay.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Enable scroll
        } else {
            // Mở menu
            sidebar.classList.remove('inactive');
            overlay.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden'; // Disable scroll khi menu mở
        }
    }
    
    // Hàm đóng menu
    function closeMenu() {
        sidebar.classList.add('inactive');
        overlay.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }
    
    // Khởi tạo mobile menu
    // Biến global để track event listeners
let mobileMenuInitialized = false;
let eventListeners = [];

function initMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return; // Guard clause nếu không có sidebar
    
    // Clean up old event listeners trước
    cleanupEventListeners();
    
    if (window.innerWidth <= 768) {
        // === MOBILE MODE ===
        
        // Tạo menu toggle và overlay nếu chưa có
        createMobileMenu();
        
        // Lấy lại references sau khi create
        menuToggle = document.querySelector('.menu-toggle');
        overlay = document.querySelector('.sidebar-overlay');
        
        // Đảm bảo sidebar bắt đầu ở trạng thái đóng trên mobile
        sidebar.classList.add('inactive');
        
        // Hiển thị menu toggle
        if (menuToggle) {
            menuToggle.style.display = 'flex';
            
            // Chỉ add event listeners nếu chưa initialized
            if (!mobileMenuInitialized) {
                // Click event handler
                const clickHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu(e);
                };
                
                // Touch event handler
                const touchHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMenu(e);
                };
                
                menuToggle.addEventListener('click', clickHandler);
                menuToggle.addEventListener('touchstart', touchHandler, { passive: false });
                
                // Lưu references để cleanup sau
                eventListeners.push({ 
                    element: menuToggle, 
                    event: 'click', 
                    handler: clickHandler 
                });
                eventListeners.push({ 
                    element: menuToggle, 
                    event: 'touchstart', 
                    handler: touchHandler 
                });
            }
        }
        
        // Overlay click handler
        if (overlay && !mobileMenuInitialized) {
            const overlayHandler = function() {
                closeMenu();
            };
            overlay.addEventListener('click', overlayHandler);
            eventListeners.push({ 
                element: overlay, 
                event: 'click', 
                handler: overlayHandler 
            });
        }
        
        // Sidebar links handlers
        if (!mobileMenuInitialized) {
            const sidebarLinks = sidebar.querySelectorAll('a:not(.opener)');
            sidebarLinks.forEach(link => {
                const linkHandler = function(e) {
                    // Check if it's an anchor link
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        // Delay để animation smooth
                        setTimeout(closeMenu, 300);
                    }
                };
                link.addEventListener('click', linkHandler);
                eventListeners.push({ 
                    element: link, 
                    event: 'click', 
                    handler: linkHandler 
                });
            });
        }
        
        mobileMenuInitialized = true;
        
    } else {
        // === DESKTOP MODE ===
        
        // Ẩn menu toggle
        if (menuToggle) {
            menuToggle.style.display = 'none';
        }
        
        // Ẩn overlay
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Hiện sidebar
        sidebar.classList.remove('inactive');
        
        // Reset body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        
        mobileMenuInitialized = false;
    }
}

// Function cleanup event listeners
function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
        if (element) {
            element.removeEventListener(event, handler);
        }
    });
    eventListeners = [];
}

// Function toggle menu được cải tiến
function toggleMenu(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const isOpen = !sidebar.classList.contains('inactive');
    
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

// Function mở menu
function openMenu() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    sidebar.classList.remove('inactive');
    if (overlay) overlay.classList.add('active');
    if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
}

// Function đóng menu
function closeMenu() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    sidebar.classList.add('inactive');
    if (overlay) overlay.classList.remove('active');
    if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
}

// Khởi tạo khi DOM ready
initMobileMenu();

// Xử lý resize với debounce tốt hơn
let resizeTimer;
let lastWidth = window.innerWidth;

window.addEventListener('resize', function() {
    const currentWidth = window.innerWidth;
    
    // Chỉ re-init nếu cross breakpoint (768px)
    const crossedBreakpoint = (lastWidth <= 768 && currentWidth > 768) || 
                             (lastWidth > 768 && currentWidth <= 768);
    
    if (crossedBreakpoint) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initMobileMenu();
            lastWidth = currentWidth;
        }, 250);
    }
});

// Cleanup khi page unload
window.addEventListener('beforeunload', function() {
    cleanupEventListeners();
});
    
    // ============ PHẦN CÒN LẠI GIỮ NGUYÊN ============
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Đóng menu trên mobile trước khi scroll
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
    
    // Add animation to elements on scroll với throttle
    let isScrolling = false;
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target); // Stop observing sau khi animated
                    }
                });
                isScrolling = false;
            });
        }
    }, observerOptions);
    
    // Observe feature articles and posts
    document.querySelectorAll('.features article, .posts article').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Prevent double tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});

// Remove preload class after page loads
window.addEventListener('load', function() {
    setTimeout(function() {
        document.body.classList.remove('is-preload');
    }, 100);
});

// Handle visibility change (khi user chuyển tab)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations khi tab không active
        document.querySelectorAll('.floating-icon').forEach(icon => {
            icon.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.floating-icon').forEach(icon => {
            icon.style.animationPlayState = 'running';
        });
    }
});
