/* Form backend config. Paste the Google Apps Script web app URL (ends with /exec) below.
   See apps-script/README.md for setup. */
window.PW_CONFIG = {
  endpoint: 'https://script.google.com/macros/s/AKfycbzlm7K6w4mR3UvMgABFoJcoZRmbeuPpF7wdU7SNUTER3uCGH_TzHf-pjugm4_USrA5X/exec',
  phone: '+1 (816) 327-0852'
};

window.PW_API = (function () {
  'use strict';
  var TIMEOUT_MS = 25000;

  function endpoint() {
    var url = (window.PW_CONFIG && window.PW_CONFIG.endpoint) || '';
    if (!url) throw new Error('not_configured');
    return url;
  }

  function withTimeout(promise) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, TIMEOUT_MS);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function parse(res) {
    if (!res.ok) throw new Error('http_' + res.status);
    return res.json();
  }

  return {
    get: function (params) {
      var qs = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }).join('&');
      // Promise.resolve().then() turns a missing endpoint into a rejected promise, not a sync throw.
      return Promise.resolve().then(function () {
        return withTimeout(fetch(endpoint() + '?' + qs, { method: 'GET' }).then(parse));
      });
    },
    // text/plain keeps this a "simple" CORS request, which Apps Script accepts without a preflight.
    post: function (payload) {
      return Promise.resolve().then(function () {
        return withTimeout(fetch(endpoint(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).then(parse));
      });
    },
    emailOk: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  };
})();
