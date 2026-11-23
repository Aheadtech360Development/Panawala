/* Book a consultation: 6-step flow from the wireframe, live slots from Google Calendar via Apps Script. */
(function () {
  'use strict';

  var TOTAL = 6;

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-book]');
    if (!root) return;

    var $ = function (sel) { return root.querySelector(sel); };
    var $$ = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
    var byIf = function (name) { return root.querySelector('[data-if="' + name + '"]'); };

    var el = {
      flow: $$('[data-if="inFlow"]'),
      steps: [1, 2, 3, 4, 5, 6].map(function (n) { return byIf('s' + n); }),
      bars: $$('[data-for="bars"]'),
      stepLabel: $('[data-step-label]'),
      who: $$('[data-for="whoOpts"]'),
      svc: $$('[data-for="svcOpts"]'),
      ind: $$('[data-for="indOpts"]'),
      emp: $$('[data-for="empOpts"]'),
      entity: $('#ent'),
      state: $('#st'),
      notes: $('#sit'),
      name: $('#nm'),
      email: $('#em'),
      phone: $('#ph'),
      days: $('[data-days]'),
      times: $('[data-times]'),
      slotStatus: $('[data-slot-status]'),
      back: byIf('canBack'),
      next: $('[data-next]'),
      submitErr: $('[data-submit-error]'),
      done: byIf('done'),
      when: $('[data-when]'),
      doneEmail: $('[data-email]'),
      hp: $('[data-hp]'),
      err: {
        e1: byIf('e1'), e2: byIf('e2'), e3: byIf('e3'), e6: byIf('e6'),
        eName: byIf('eName'), eEmail: byIf('eEmail'), ePhone: byIf('ePhone')
      }
    };

    var labelOf = function (node) {
      var s = node.querySelector('span[style*="font-weight:600"]');
      return (s || node).textContent.trim();
    };
    var LABELS = {
      who: el.who.map(labelOf),
      svc: el.svc.map(labelOf),
      ind: el.ind.map(function (b) { return b.textContent.trim(); }),
      emp: el.emp.map(function (b) { return b.textContent.trim(); })
    };
    // "Not sure yet" is exclusive with the other services. Found by label so the list can change.
    var NOT_SURE_SVC = LABELS.svc.indexOf('Not sure yet');

    var s = {
      step: 1, who: -1, svcs: [], ind: -1, emp: -1, tried: false, done: false,
      days: null, day: -1, time: -1, loadingSlots: false, slotsError: false, submitting: false
    };

    // Arriving from the home page picker (?who=0..4): step 1 is already answered, so open on step 2.
    // Back still returns to step 1 with the choice selected.
    var q = new URLSearchParams(location.search).get('who');
    if (q !== null && /^\d$/.test(q) && +q < LABELS.who.length) { s.who = +q; s.step = 2; }

    function emailOk() { return window.PW_API.emailOk(el.email.value.trim()); }
    function valid(step) {
      switch (step) {
        case 1: return s.who > -1;
        case 2: return s.svcs.length > 0;
        case 3: return s.ind > -1;
        case 4: return true;
        case 5: return !!el.name.value.trim() && emailOk() && !!el.phone.value.trim();
        case 6: return s.day > -1 && s.time > -1;
      }
      return false;
    }

    function setPressed(nodes, isOn, base) {
      nodes.forEach(function (n, i) {
        var on = isOn(i);
        n.className = base + (on ? ' on' : '');
        if (n.tagName === 'BUTTON') n.setAttribute('aria-pressed', String(on));
        var input = n.querySelector('input');
        if (input) input.checked = on;
      });
    }

    function render() {
      var t = s.tried, step = s.step, inFlow = !s.done;
      el.flow.forEach(function (n) { n.hidden = !inFlow; });
      el.steps.forEach(function (n, i) { n.hidden = !(inFlow && step === i + 1); });
      el.bars.forEach(function (b, i) { b.style.background = i + 1 <= step ? '#5B1A2D' : '#E7DDE0'; });
      el.stepLabel.textContent = 'Step ' + step + ' of ' + TOTAL;

      setPressed(el.who, function (i) { return s.who === i; }, 'opt');
      setPressed(el.svc, function (i) { return s.svcs.indexOf(i) > -1; }, 'opt');
      setPressed(el.ind, function (i) { return s.ind === i; }, 'chip');
      setPressed(el.emp, function (i) { return s.emp === i; }, 'chip');

      el.err.e1.hidden = !(t && step === 1 && !valid(1));
      el.err.e2.hidden = !(t && step === 2 && !valid(2));
      el.err.e3.hidden = !(t && step === 3 && !valid(3));
      el.err.e6.hidden = !(t && step === 6 && !valid(6));
      setFieldError(el.name, el.err.eName, t && step === 5 && !el.name.value.trim());
      setFieldError(el.email, el.err.eEmail, t && step === 5 && !emailOk());
      setFieldError(el.phone, el.err.ePhone, t && step === 5 && !el.phone.value.trim());

      el.back.hidden = !(step > 1);
      el.next.textContent = s.submitting ? 'Booking…' : (step === TOTAL ? 'Confirm booking' : 'Continue');
      el.next.disabled = s.submitting || (step === TOTAL && s.loadingSlots);
      el.done.hidden = !s.done;
      if (step === TOTAL) renderSlots();
    }

    function setFieldError(input, errEl, show) {
      errEl.hidden = !show;
      input.setAttribute('aria-invalid', String(!!show));
      errEl.id = errEl.id || 'err-' + input.id;
      if (show) input.setAttribute('aria-describedby', errEl.id); else input.removeAttribute('aria-describedby');
    }

    function focusStep() {
      var panel = el.steps[s.step - 1];
      var heading = panel && panel.querySelector('legend, h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
      var top = root.getBoundingClientRect().top + window.pageYOffset - 100;
      if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }

    // ---- option handlers ----
    el.who.forEach(function (n, i) {
      n.querySelector('input').addEventListener('change', function () { s.who = i; render(); });
    });
    el.svc.forEach(function (n, i) {
      n.querySelector('input').addEventListener('change', function () {
        var on = s.svcs.indexOf(i) > -1, a = s.svcs.slice();
        if (i === NOT_SURE_SVC) a = on ? [] : [NOT_SURE_SVC];
        else {
          a = a.filter(function (x) { return x !== NOT_SURE_SVC; });
          a = on ? a.filter(function (x) { return x !== i; }) : a.concat([i]);
        }
        s.svcs = a;
        render();
      });
    });
    el.ind.forEach(function (b, i) { b.addEventListener('click', function () { s.ind = i; render(); }); });
    el.emp.forEach(function (b, i) { b.addEventListener('click', function () { s.emp = i; render(); }); });
    [el.name, el.email, el.phone].forEach(function (inp) {
      inp.addEventListener('input', function () { if (s.tried) render(); });
    });

    // ---- slots ----
    function fmtTime(d) { return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
    function fmtShort(d) {
      return d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
        d.toLocaleDateString('en-US', { month: 'short' }) + ' ' + d.getDate();
    }
    function fmtLong(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
    function localKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

    // Group server slots by the visitor's local date so labels match local time.
    function groupSlots(raw) {
      var map = {}, order = [];
      (raw || []).forEach(function (day) {
        (day.slots || []).forEach(function (sl) {
          var start = new Date(sl.start);
          if (isNaN(start) || start.getTime() < Date.now()) return;
          var k = localKey(start);
          if (!map[k]) { map[k] = { date: start, slots: [] }; order.push(k); }
          map[k].slots.push({ start: start, end: new Date(sl.end), iso: sl.start, isoEnd: sl.end });
        });
      });
      return order.map(function (k) { return map[k]; });
    }

    function loadSlots() {
      s.loadingSlots = true;
      s.slotsError = false;
      s.days = null; s.day = -1; s.time = -1;
      render();
      window.PW_API.get({ action: 'availability' }).then(function (res) {
        if (!res || !res.ok) throw new Error('bad');
        s.days = groupSlots(res.days);
        s.day = s.days.length ? 0 : -1;
      }).catch(function () {
        s.slotsError = true;
      }).then(function () {
        s.loadingSlots = false;
        render();
      });
    }

    function status(msg) {
      el.slotStatus.textContent = msg || '';
      el.slotStatus.hidden = !msg;
    }

    function renderSlots() {
      el.days.textContent = '';
      el.times.textContent = '';
      if (s.loadingSlots) { status('Loading available times…'); return; }
      if (s.slotsError) {
        status('');
        el.slotStatus.hidden = false;
        el.slotStatus.textContent = 'We could not load available times. ';
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn2';
        retry.style.cssText = 'min-height:40px;padding:0 16px;margin-left:4px';
        retry.textContent = 'Try again';
        retry.addEventListener('click', loadSlots);
        el.slotStatus.appendChild(retry);
        return;
      }
      if (!s.days) return;
      if (!s.days.length) {
        status('No times are open right now. Please call ' + window.PW_CONFIG.phone + ' or send us a message.');
        return;
      }
      status('');
      s.days.forEach(function (d, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (s.day === i ? ' on' : '');
        b.setAttribute('aria-pressed', String(s.day === i));
        b.textContent = fmtShort(d.date);
        b.addEventListener('click', function () { s.day = i; s.time = -1; render(); });
        el.days.appendChild(b);
      });
      var day = s.days[s.day];
      if (!day) return;
      day.slots.forEach(function (sl, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot' + (s.time === i ? ' on' : '');
        b.setAttribute('aria-pressed', String(s.time === i));
        b.textContent = fmtTime(sl.start);
        b.addEventListener('click', function () { s.time = i; render(); });
        el.times.appendChild(b);
      });
    }

    // ---- navigation ----
    el.back.addEventListener('click', function () {
      if (s.submitting) return;
      s.step -= 1;
      s.tried = false;
      el.submitErr.hidden = true;
      render();
      focusStep();
    });

    el.next.addEventListener('click', function () {
      if (s.submitting) return;
      if (!valid(s.step)) { s.tried = true; render(); return; }
      if (s.step === TOTAL) { submit(); return; }
      s.step += 1;
      s.tried = false;
      render();
      focusStep();
      if (s.step === TOTAL && !s.days && !s.loadingSlots) loadSlots();
    });

    function submit() {
      var day = s.days[s.day], slot = day.slots[s.time];
      var whenText = fmtLong(slot.start) + ' at ' + fmtTime(slot.start);
      var tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      s.submitting = true;
      el.submitErr.hidden = true;
      render();
      window.PW_API.post({
        type: 'booking',
        who: LABELS.who[s.who],
        services: s.svcs.map(function (i) { return LABELS.svc[i]; }),
        industry: LABELS.ind[s.ind],
        entity: el.entity.value,
        state: el.state.value.trim(),
        employees: s.emp > -1 ? LABELS.emp[s.emp] : '',
        notes: el.notes.value.trim(),
        name: el.name.value.trim(),
        email: el.email.value.trim(),
        phone: el.phone.value.trim(),
        start: slot.iso,
        end: slot.isoEnd,
        clientTimeZone: tz,
        clientWhen: whenText,
        website: el.hp ? el.hp.value : ''
      }).then(function (res) {
        if (res && res.ok) {
          s.done = true;
          el.when.textContent = whenText;
          el.doneEmail.textContent = el.email.value.trim();
          s.submitting = false;
          render();
          var h = el.done.querySelector('h1');
          if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
          root.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (res && res.code === 'slot_taken') {
          s.submitting = false;
          el.submitErr.textContent = 'That time was just booked. Please pick another time.';
          el.submitErr.hidden = false;
          loadSlots();
          return;
        }
        throw new Error((res && res.code) || 'failed');
      }).catch(function () {
        s.submitting = false;
        el.submitErr.textContent = 'We could not complete your booking. Please try again, or call us at ' + window.PW_CONFIG.phone + '.';
        el.submitErr.hidden = false;
        render();
      });
    }

    render();
  });
})();
