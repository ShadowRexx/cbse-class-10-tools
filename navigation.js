/**
 * navigation.js — v2
 * Hamburger menu + multi-dropdown logic for site-wide nav.
 * Supports any number of .nav-dropdown elements.
 * Safe to load in <head> or end of <body>.
 */
(function () {
    function init() {
        var nav    = document.getElementById('siteNav');
        var toggle = document.getElementById('navToggle');
        var list   = document.getElementById('navList');

        if (!nav || !toggle || !list) return;

        /* ── All dropdowns (Tools, Guides, …) ── */
        var dropdowns = Array.prototype.slice.call(
            nav.querySelectorAll('.nav-dropdown')
        );

        function isMobile() {
            return window.innerWidth <= 760;
        }

        /* Close every dropdown */
        function closeAllDropdowns() {
            dropdowns.forEach(function (dd) {
                dd.classList.remove('open');
                var btn = dd.querySelector('.nav-dropdown-btn');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }

        /* ── Scroll: add/remove "scrolled" class ── */
        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });

        /* ── Hamburger toggle ── */
        toggle.addEventListener('click', function () {
            var isOpen = list.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            if (!isOpen) closeAllDropdowns();
        });

        /* ── Wire each dropdown independently ── */
        dropdowns.forEach(function (dd) {
            var btn = dd.querySelector('.nav-dropdown-btn');
            if (!btn) return;

            btn.addEventListener('click', function (e) {
                if (!isMobile()) return;   /* Desktop: CSS :hover handles it */
                e.stopPropagation();

                var wasOpen = dd.classList.contains('open');

                /* Close all first, then re-open this one if it was closed */
                closeAllDropdowns();
                if (!wasOpen) {
                    dd.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });

        /* ── Close nav + all dropdowns when clicking outside ── */
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) {
                list.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                closeAllDropdowns();
            }
        });

        /* ── Close mobile menu when a nav link is tapped ── */
        list.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (isMobile()) {
                    list.classList.remove('open');
                    toggle.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                    closeAllDropdowns();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());

