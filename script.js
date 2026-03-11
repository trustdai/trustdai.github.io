/* ========================================
   TrustdAI — Static Site JavaScript
   ======================================== */

(function () {
  'use strict';

  // ===== HEADER: Sticky + Glass on Scroll =====
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== MOBILE MENU =====
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#start-chat') return; // handled by chat widget
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // Close mobile menu
      if (mobileToggle && mobileMenu) {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  });

  // ===== INTERSECTION OBSERVER: Reveal on Scroll =====
  const revealElements = document.querySelectorAll('.reveal, .fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===== TRUSTDAI CHAT WIDGET INITIALIZATION =====
  let widgetInstance = null;

  function initWidget() {
    if (typeof window.ChatWidget === 'undefined') {
      // Retry after a short delay if CDN hasn't loaded yet
      setTimeout(initWidget, 500);
      return;
    }

    if (widgetInstance) {
      widgetInstance.destroy();
    }

    var token = 'trustdai_tk_2026_03_11_hfr87J973FR';
    var primaryColor = '#1e40af';
    var secondaryColor = '#ffffff';
    var shadeColor = '#f3f4f6';
    var logoUrl = 'https://trustdai.in/assets/trustdai_logo.svg';
    var backgroundUrl = 'https://d2ug12dkmgcsv2.cloudfront.net/bkgrnd_image.png';
    var headerText = 'Trusty';
    var apiBaseUrl = 'https://api.trustdai.in';
    var signInMessage = 'Sign in to get started';

    // Add widget-scoped styles
    var existingStyle = document.getElementById('chat-widget-styles');
    if (existingStyle) existingStyle.remove();

    var style = document.createElement('style');
    style.id = 'chat-widget-styles';
    style.textContent =
      '#crate-widget { position: fixed; bottom: 0; right: 0; z-index: 9999; width: auto; height: auto; overflow: hidden; }' +
      '#crate-widget iframe { border: none !important; background: transparent !important; display: block; }' +
      '.chat-container, .messages-container { background-color: #f3f4f6 !important; background-image: url("' + backgroundUrl + '") !important; background-size: cover !important; background-attachment: fixed !important; }' +
      '.chat-header { background-color: #1e40af !important; color: white !important; }' +
      '.user-message { background-color: #1e40af !important; color: white !important; }' +
      '.bot-message { background-color: white !important; color: #1f2937 !important; }' +
      '.chat-input-container { background-color: white !important; border-top: 1px solid #e5e7eb !important; }' +
      '.send-button, .action-button { background-color: #1e40af !important; color: white !important; }' +
      '.send-button:hover, .action-button:hover { background-color: #1e3a8a !important; }' +
      '.chat-close-button, .close-button, .widget-close, [class*="close"], [class*="Close"], .crate-close, #chat-close { color: white !important; filter: brightness(0) invert(1) !important; opacity: 0.9 !important; position: relative !important; z-index: 10000 !important; }' +
      '.chat-close-button:hover, .close-button:hover, .widget-close:hover, [class*="close"]:hover, [class*="Close"]:hover { opacity: 1 !important; transform: scale(1.1) !important; }' +
      '.user-message, .user-message *, .user-message p, .user-message span, .user-message div, [class*="message"][class*="user"], [class*="message"][class*="sent"] { color: white !important; fill: white !important; }' +
      '.logout-button, [class*="logout"], [class*="sign-out"] { color: white !important; border: 1px solid white !important; background-color: transparent !important; }' +
      '.user-email, [class*="email"], [class*="user-info"] { color: white !important; opacity: 0.9 !important; }' +
      '.send-button, [class*="send"], .action-button { color: white !important; }' +
      '.chat-input, [class*="input"], [class*="Input"] { color: #1f2937 !important; }' +
      'input:not([class*="user"]):not([class*="send"]), textarea:not([class*="user"]):not([class*="send"]) { color: #1f2937 !important; }';
    document.head.appendChild(style);

    widgetInstance = window.ChatWidget.initChatWidget({
      token: token,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      shadeColor: shadeColor,
      logoUrl: logoUrl,
      backgroundUrl: backgroundUrl,
      apiBaseUrl: apiBaseUrl,
      headerText: headerText,
      signInMessage: signInMessage,
      onLoad: function () {
        var iframe = document.querySelector('#crate-widget iframe');
        if (iframe) {
          setTimeout(function () {
            if (iframe.contentDocument) {
              var iframeStyle = document.createElement('style');
              iframeStyle.textContent =
                '.chat-container, .messages-container { background-color: #f3f4f6 !important; background-image: url("' + backgroundUrl + '") !important; background-size: cover !important; }' +
                '.chat-header { background-color: #2563eb !important; color: white !important; }' +
                '.user-message { background-color: #2563eb !important; color: white !important; }' +
                '.bot-message { background-color: white !important; color: #1f2937 !important; }' +
                '.chat-input-container { background-color: white !important; border-top: 1px solid #e5e7eb !important; }' +
                '.send-button, .action-button { background-color: #2563eb !important; color: white !important; }' +
                '.send-button:hover, .action-button:hover { background-color: #1e40af !important; }';
              iframe.contentDocument.head.appendChild(iframeStyle);
            }
          }, 500);
        }
      },
    });
  }

  // Function to open chat widget
  function openChatWidget() {
    if (widgetInstance) {
      widgetInstance.open();
    }
    return false;
  }

  // Hash change handler
  function handleHashChange() {
    if (window.location.hash === '#start-chat') {
      openChatWidget();
    }
  }

  // ===== DOM READY =====
  document.addEventListener('DOMContentLoaded', function () {
    // Init chat widget
    initWidget();

    // Handle initial hash
    if (window.location.hash === '#start-chat') {
      setTimeout(openChatWidget, 1000);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // CTA buttons that open chat
    var chatButtons = [
      document.getElementById('openChat'),
      document.getElementById('headerCTA'),
      document.getElementById('mobileCTA'),
    ];

    chatButtons.forEach(function (btn) {
      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          window.location.hash = 'start-chat';
          openChatWidget();
        });
      }
    });

    // Contact links in footer
    var contactLinks = document.querySelectorAll('.contact-link, .footer a[href*="#contact-section"]');
    contactLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openChatWidget();
        var contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });

})();
