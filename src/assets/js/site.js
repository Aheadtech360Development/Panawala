/* Shared behaviour: mobile menu and FAQ accordions. */
(function () {
  'use strict';

  function initMenu() {
    var btn = document.querySelector('[data-menu-toggle]');
    var panel = document.getElementById('mobile-menu');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // One item open at a time, matching the wireframe. Clicking the open item closes it.
  function initFaq(root) {
    var items = root.querySelectorAll('[data-for="faqs"]');
    function setOpen(item, open) {
      var btn = item.querySelector('button');
      var answer = item.querySelector('[data-if="f.open"]');
      var sign = btn.querySelector('[aria-hidden="true"]');
      btn.setAttribute('aria-expanded', String(open));
      if (answer) answer.hidden = !open;
      if (sign) sign.textContent = open ? '−' : '+';
    }
    items.forEach(function (item, i) {
      var btn = item.querySelector('button');
      var answer = item.querySelector('[data-if="f.open"]');
      if (answer) {
        answer.id = answer.id || 'faq-' + Math.random().toString(36).slice(2, 8) + '-' + i;
        btn.setAttribute('aria-controls', answer.id);
      }
      btn.addEventListener('click', function () {
        var wasOpen = btn.getAttribute('aria-expanded') === 'true';
        items.forEach(function (other) { setOpen(other, false); });
        if (!wasOpen) setOpen(item, true);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    document.querySelectorAll('[data-c="Faq"]').forEach(initFaq);
  });
})();
