/*
    main.js – Vui học STEM
    Tác giả: Nguyễn Quang Ảnh
    Mục đích: Quản lý sidebar, menu mở rộng, hiệu ứng mượt, và tương tác cơ bản.
*/

(function($) {

    // Khi DOM sẵn sàng
    $(function() {

        // ----- 1. Loại bỏ class "is-preload" sau khi tải -----
        $(window).on('load', function() {
            $('body').removeClass('is-preload');
        });

        // ----- 2. Xử lý mở / đóng menu con -----
        $('#menu .opener').each(function() {
            var $this = $(this);
            $this.on('click', function(e) {
                e.preventDefault();

                // Toggle menu con
                $this.toggleClass('active');
                $this.next('ul').slideToggle(200);
            });
        });

        // ----- 3. Xử lý ẩn sidebar trên mobile -----
        const $sidebar = $('#sidebar');
        const $menuToggle = $('<div id="menuToggle"><i class="fa fa-bars"></i></div>');
        $('body').prepend($menuToggle);

        $menuToggle.css({
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            'z-index': 10000,
            cursor: 'pointer',
            'font-size': '1.5rem',
            color: '#333',
            background: '#fff',
            padding: '8px 10px',
            'border-radius': '8px',
            'box-shadow': '0 2px 8px rgba(0,0,0,0.2)'
        });

        $menuToggle.on('click', function() {
            $sidebar.toggleClass('visible');
        });

        // Đóng sidebar khi click ra ngoài
        $(document).on('click', function(e) {
            if (
                !$(e.target).closest('#sidebar').length &&
                !$(e.target).closest('#menuToggle').length
            ) {
                $sidebar.removeClass('visible');
            }
        });

        // ----- 4. Cuộn mượt khi click vào liên kết nội trang -----
        $('a[href^="#"]').on('click', function(e) {
            const target = $($(this).attr('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 600);
            }
        });

        // ----- 5. Xử lý responsive sidebar -----
        function checkWidth() {
            if ($(window).width() <= 980) {
                $sidebar.addClass('mobile');
            } else {
                $sidebar.removeClass('mobile visible');
            }
        }

        $(window).on('resize', checkWidth);
        checkWidth();

    });

})(jQuery);
