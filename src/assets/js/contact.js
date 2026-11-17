/* Contact form: validate, send to Apps Script (Sheet + email), show the wireframe's thank-you note. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var btn = form.querySelector('button[type="submit"]');
    var sent = form.querySelector('[data-if="sent"]');
    var submitErr = form.querySelector('[data-submit-error]');
    var hp = form.querySelector('[data-hp]');
    var f = {
      name: form.querySelector('#cn'),
      email: form.querySelector('#ce'),
      phone: form.querySelector('#cp'),
      message: form.querySelector('#cm')
    };
    var rules = {
      name: function (v) { return v.trim().length > 0; },
      email: function (v) { return window.PW_API.emailOk(v.trim()); },
      message: function (v) { return v.trim().length > 0; }
    };
    var touched = {};

    function check(key) {
      var ok = rules[key](f[key].value);
      var err = form.querySelector('[data-err="' + key + '"]');
      if (err) err.hidden = ok;
      f[key].setAttribute('aria-invalid', String(!ok));
      if (err) {
        err.id = err.id || 'err-' + key;
        if (!ok) f[key].setAttribute('aria-describedby', err.id); else f[key].removeAttribute('aria-describedby');
      }
      return ok;
    }

    Object.keys(rules).forEach(function (key) {
      f[key].addEventListener('blur', function () { if (f[key].value) { touched[key] = true; check(key); } });
      f[key].addEventListener('input', function () { if (touched[key]) check(key); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitErr.hidden = true;
      var firstBad = null;
      Object.keys(rules).forEach(function (key) {
        touched[key] = true;
        if (!check(key) && !firstBad) firstBad = f[key];
      });
      if (firstBad) { firstBad.focus(); return; }

      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      window.PW_API.post({
        type: 'contact',
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        message: f.message.value.trim(),
        website: hp ? hp.value : '',
        page: location.pathname
      }).then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.code) || 'failed');
        form.reset();
        touched = {};
        sent.hidden = false;
        sent.focus && sent.setAttribute('tabindex', '-1');
        sent.focus();
      }).catch(function () {
        submitErr.textContent = 'We could not send your message. Please try again, or call us at ' + window.PW_CONFIG.phone + '.';
        submitErr.hidden = false;
      }).then(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  });
})();
