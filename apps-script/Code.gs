/**
 * Panawala, CPA website form backend.
 * - Contact form  -> "Contact" tab + notification email
 * - Booking flow  -> live slots from Google Calendar, creates the event (with Meet link and invite),
 *                    "Bookings" tab + notification email
 *
 * Deploy as a web app bound to the Google Sheet. Setup steps: apps-script/README.md
 *
 * @OnlyCurrentDoc
 */

var CONFIG = {
  // Who receives the "new form submission" emails. Comma separate several addresses.
  NOTIFY_EMAILS: 'development.aheadtech360@gmail.com',

  // Calendar used for availability and new bookings. 'primary' = the deploying account's main calendar.
  CALENDAR_ID: 'primary',

  // Business time zone. Slot times below are in this zone. Visitors see them in their own zone.
  TIME_ZONE: 'America/Chicago',

  // Bookable start times each weekday (24h, business time zone). Same as the wireframe.
  SLOT_TIMES: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'],

  // Meeting length in minutes. CONFIRM WITH CLIENT.
  MEETING_MINUTES: 30,

  // Show this many days that have at least one open slot (wireframe shows 5).
  DAYS_TO_SHOW: 5,
  MAX_DAYS_TO_SCAN: 30,
  FIRST_DAY_OFFSET: 1, // 1 = start tomorrow, like the wireframe
  MIN_NOTICE_HOURS: 12,
  WORK_DAYS: [1, 2, 3, 4, 5], // 1 = Monday ... 7 = Sunday
  BLOCKED_DATES: [], // e.g. ['2026-12-25']

  ADD_MEET_LINK: true,
  BUSINESS_NAME: 'Panawala, CPA',
  CONTACT_SHEET: 'Contact',
  BOOKING_SHEET: 'Bookings',
  SPAM_SHEET: 'Spam'
};

var SPAM_HEADERS = ['Submitted at', 'Form', 'Name', 'Email', 'Trap field value', 'Message'];

var CONTACT_HEADERS = ['Submitted at', 'Name', 'Email', 'Phone', 'Message', 'Page'];
var BOOKING_HEADERS = ['Submitted at', 'Meeting (business time)', 'Meeting (client local)', 'Client time zone',
  'Name', 'Email', 'Phone', 'Help for', 'Services', 'Industry', 'Business type', 'State', 'Employees', 'Notes',
  'Meet link', 'Calendar event', 'Status'];

/* ------------------------------------------------------------------ */
/* Web app entry points                                                */
/* ------------------------------------------------------------------ */

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'availability') {
      return json_({ ok: true, timeZone: CONFIG.TIME_ZONE, days: getAvailability_() });
    }
    return json_({ ok: true, service: 'panawala-forms' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: 'server_error' });
  }
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 20000) return json_({ ok: false, code: 'bad_request' });
    var data = JSON.parse(raw);

    // Honeypot: bots fill the hidden field. Keep it in a "Spam" tab (no email) so nothing is lost silently.
    if (data.website) {
      appendRow_(CONFIG.SPAM_SHEET, SPAM_HEADERS, [new Date(), clean_(data.type, 20), clean_(data.name, 120),
        clean_(data.email, 200), clean_(data.website, 200), clean_(data.message || data.notes, 2000, true)]);
      return json_({ ok: true });
    }

    if (data.type === 'contact') return json_(handleContact_(data));
    if (data.type === 'booking') return json_(handleBooking_(data));
    return json_({ ok: false, code: 'bad_request' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: 'server_error' });
  }
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

function handleContact_(d) {
  var f = {
    name: clean_(d.name, 120),
    email: clean_(d.email, 200),
    phone: clean_(d.phone, 40),
    message: clean_(d.message, 5000, true),
    page: clean_(d.page, 200)
  };
  if (!f.name || !isEmail_(f.email) || !f.message) return { ok: false, code: 'invalid' };
  // Skip only an identical message sent again within 60 seconds (double click, refresh).
  if (isRateLimited_(('contact:' + f.email.toLowerCase() + ':' + f.message).slice(0, 240), 60)) return { ok: true };

  appendRow_(CONFIG.CONTACT_SHEET, CONTACT_HEADERS,
    [new Date(), f.name, f.email, f.phone, f.message, f.page]);

  notify_('New website message from ' + f.name, f.email, [
    ['Name', f.name], ['Email', f.email], ['Phone', f.phone || 'Not given'], ['Message', f.message]
  ]);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

function handleBooking_(d) {
  var f = {
    who: clean_(d.who, 80),
    services: (Array.isArray(d.services) ? d.services : []).slice(0, 10).map(function (s) { return clean_(s, 80); }),
    industry: clean_(d.industry, 120),
    entity: clean_(d.entity, 80),
    state: clean_(d.state, 60),
    employees: clean_(d.employees, 10),
    notes: clean_(d.notes, 3000, true),
    name: clean_(d.name, 120),
    email: clean_(d.email, 200),
    phone: clean_(d.phone, 40),
    start: clean_(d.start, 40),
    clientTimeZone: clean_(d.clientTimeZone, 60),
    clientWhen: clean_(d.clientWhen, 120)
  };
  if (!f.who || !f.services.length || !f.industry || !f.name || !isEmail_(f.email) || !f.phone || !f.start) {
    return { ok: false, code: 'invalid' };
  }
  var start = new Date(f.start);
  if (isNaN(start.getTime())) return { ok: false, code: 'invalid' };

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok: false, code: 'busy' };
  var event;
  try {
    // Only accept a start time that is one of the currently open slots.
    if (!isSlotOpen_(start)) return { ok: false, code: 'slot_taken' };
    var end = new Date(start.getTime() + CONFIG.MEETING_MINUTES * 60000);
    event = createEvent_(f, start, end);
  } finally {
    lock.releaseLock();
  }

  var businessWhen = Utilities.formatDate(start, CONFIG.TIME_ZONE, "EEEE, MMMM d, yyyy 'at' h:mm a z");
  appendRow_(CONFIG.BOOKING_SHEET, BOOKING_HEADERS, [
    new Date(), businessWhen, f.clientWhen, f.clientTimeZone,
    f.name, f.email, f.phone, f.who, f.services.join(', '), f.industry, f.entity, f.state, f.employees, f.notes,
    event.hangoutLink || '', event.htmlLink || '', 'Booked'
  ]);

  notify_('New consultation booked: ' + f.name + ', ' + businessWhen, f.email, [
    ['When', businessWhen + (f.clientWhen ? ' (client sees: ' + f.clientWhen + ', ' + f.clientTimeZone + ')' : '')],
    ['Name', f.name], ['Email', f.email], ['Phone', f.phone],
    ['Help for', f.who], ['Services', f.services.join(', ')], ['Industry', f.industry],
    ['Business type', f.entity || 'Not given'], ['State', f.state || 'Not given'],
    ['Employees', f.employees || 'Not given'], ['Notes', f.notes || 'None'],
    ['Meet link', event.hangoutLink || 'None'], ['Calendar event', event.htmlLink || '']
  ]);

  return { ok: true, meetLink: event.hangoutLink || '' };
}

function createEvent_(f, start, end) {
  var lines = [
    'Booked from the website.',
    '',
    'Name: ' + f.name,
    'Email: ' + f.email,
    'Phone: ' + f.phone,
    'Help for: ' + f.who,
    'Services: ' + f.services.join(', '),
    'Industry: ' + f.industry,
    'Business type: ' + (f.entity || 'Not given'),
    'State: ' + (f.state || 'Not given'),
    'Employees: ' + (f.employees || 'Not given'),
    'Notes: ' + (f.notes || 'None')
  ];
  var resource = {
    summary: 'Consultation: ' + f.name + ' and ' + CONFIG.BUSINESS_NAME,
    description: lines.join('\n'),
    start: { dateTime: start.toISOString(), timeZone: CONFIG.TIME_ZONE },
    end: { dateTime: end.toISOString(), timeZone: CONFIG.TIME_ZONE },
    attendees: [{ email: f.email, displayName: f.name }],
    reminders: { useDefault: true }
  };
  if (CONFIG.ADD_MEET_LINK) {
    resource.conferenceData = {
      createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
    };
  }
  // sendUpdates 'all' emails the calendar invite to the client.
  return Calendar.Events.insert(resource, CONFIG.CALENDAR_ID, {
    conferenceDataVersion: CONFIG.ADD_MEET_LINK ? 1 : 0,
    sendUpdates: 'all'
  });
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

// Returns [{ date: 'yyyy-MM-dd', slots: [{ start: ISO, end: ISO }] }]
function getAvailability_() {
  var candidates = candidateDays_();
  if (!candidates.length) return [];
  var allSlots = [];
  candidates.forEach(function (day) { allSlots = allSlots.concat(day.slots); });
  var busy = busyBetween_(allSlots[0].start, allSlots[allSlots.length - 1].end);
  var minStart = Date.now() + CONFIG.MIN_NOTICE_HOURS * 3600000;

  var out = [];
  for (var i = 0; i < candidates.length && out.length < CONFIG.DAYS_TO_SHOW; i++) {
    var open = candidates[i].slots.filter(function (s) {
      return s.start.getTime() >= minStart && !overlaps_(s, busy);
    });
    if (open.length) {
      out.push({
        date: candidates[i].date,
        slots: open.map(function (s) { return { start: s.start.toISOString(), end: s.end.toISOString() }; })
      });
    }
  }
  return out;
}

function isSlotOpen_(start) {
  var days = getAvailability_();
  var iso = start.toISOString();
  return days.some(function (d) {
    return d.slots.some(function (s) { return s.start === iso; });
  });
}

function candidateDays_() {
  var tz = CONFIG.TIME_ZONE;
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var noon = Utilities.parseDate(today + ' 12:00', tz, 'yyyy-MM-dd HH:mm').getTime();
  var days = [];
  for (var i = CONFIG.FIRST_DAY_OFFSET; i < CONFIG.FIRST_DAY_OFFSET + CONFIG.MAX_DAYS_TO_SCAN; i++) {
    var probe = new Date(noon + i * 86400000);
    var date = Utilities.formatDate(probe, tz, 'yyyy-MM-dd');
    var dow = Number(Utilities.formatDate(probe, tz, 'u'));
    if (CONFIG.WORK_DAYS.indexOf(dow) === -1 || CONFIG.BLOCKED_DATES.indexOf(date) > -1) continue;
    days.push({
      date: date,
      slots: CONFIG.SLOT_TIMES.map(function (t) {
        var s = Utilities.parseDate(date + ' ' + t, tz, 'yyyy-MM-dd HH:mm');
        return { start: s, end: new Date(s.getTime() + CONFIG.MEETING_MINUTES * 60000) };
      })
    });
  }
  return days;
}

function busyBetween_(from, to) {
  var res = Calendar.Freebusy.query({
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    items: [{ id: CONFIG.CALENDAR_ID }]
  });
  var cals = res.calendars || {};
  var busy = [];
  Object.keys(cals).forEach(function (k) {
    (cals[k].busy || []).forEach(function (b) {
      busy.push({ start: new Date(b.start), end: new Date(b.end) });
    });
  });
  return busy;
}

function overlaps_(slot, busy) {
  return busy.some(function (b) { return slot.start < b.end && slot.end > b.start; });
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function appendRow_(sheetName, headers, values) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  sh.appendRow(values.map(sheetSafe_));
}

// Stops values like "=IMPORTXML(...)" from running as formulas in the Sheet.
function sheetSafe_(v) {
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(v)) return "'" + v;
  return v;
}

function notify_(subject, replyTo, rows) {
  var html = '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rows.map(function (r) {
      return '<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #eee">' + esc_(r[0]) +
        '</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">' + esc_(r[1]) + '</td></tr>';
    }).join('') + '</table>';
  var text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAILS,
    subject: subject,
    body: text,
    htmlBody: html,
    replyTo: replyTo,
    name: CONFIG.BUSINESS_NAME + ' website'
  });
}

function isRateLimited_(key, seconds) {
  var cache = CacheService.getScriptCache();
  if (cache.get(key)) return true;
  cache.put(key, '1', seconds);
  return false;
}

function clean_(v, max, multiline) {
  if (v === null || v === undefined) return '';
  var s = String(v);
  s = multiline ? s.replace(/[^\S\n]+/g, ' ') : s.replace(/\s+/g, ' ');
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  return s.slice(0, max);
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

function esc_(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/* Run these once from the editor                                      */
/* ------------------------------------------------------------------ */

// Creates both tabs with headers and triggers the permission prompt.
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [[CONFIG.CONTACT_SHEET, CONTACT_HEADERS], [CONFIG.BOOKING_SHEET, BOOKING_HEADERS]].forEach(function (p) {
    var sh = ss.getSheetByName(p[0]) || ss.insertSheet(p[0]);
    if (sh.getLastRow() === 0) {
      sh.appendRow(p[1]);
      sh.getRange(1, 1, 1, p[1].length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });
  var days = getAvailability_();
  console.log('Setup done. Open days found: ' + days.length + '. Emails left today: ' + MailApp.getRemainingDailyQuota());
}

// Logs which spreadsheet this script writes to, its tabs and row counts.
function whereAmI() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  console.log('Spreadsheet: ' + ss.getName());
  console.log('URL: ' + ss.getUrl());
  ss.getSheets().forEach(function (sh) {
    console.log('Tab "' + sh.getName() + '": ' + sh.getLastRow() + ' rows');
  });
}

// Sends one test notification to NOTIFY_EMAILS.
function testNotification() {
  notify_('Test: website form notifications work', CONFIG.NOTIFY_EMAILS.split(',')[0], [['Status', 'OK']]);
}
