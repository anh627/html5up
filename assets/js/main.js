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
    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            createMobileMenu();
            
            // Đảm bảo sidebar bắt đầu ở trạng thái đóng trên mobile
            sidebar.classList.add('inactive');
            
            // Event handlers cho menu toggle
            if (menuToggle) {
                // Remove old listeners để tránh duplicate
                menuToggle.replaceWith(menuToggle.cloneNode(true));
                menuToggle = document.querySelector('.menu-toggle');
                
                // Click event
                menuToggle.addEventListener('click', toggleMenu);
                
                // Touch event cho mobile (ưu tiên)
                menuToggle.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    toggleMenu(e);
                }, { passive: false });
            }
            
            // Click overlay để đóng menu
            if (overlay) {
                overlay.addEventListener('click', closeMenu);
            }
            
            // Đóng menu khi click vào link
            const sidebarLinks = sidebar.querySelectorAll('a:not(.opener)');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Delay để animation smooth
                    setTimeout(closeMenu, 300);
                });
            });
        } else {
            // Desktop: ẩn menu toggle và hiện sidebar
            if (menuToggle) menuToggle.style.display = 'none';
            if (overlay) overlay.classList.remove('active');
            sidebar.classList.remove('inactive');
            document.body.style.overflow = '';
        }
    }
    
    // Khởi tạo khi load
    initMobileMenu();
    
    // Xử lý khi resize window
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initMobileMenu();
        }, 250);
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
