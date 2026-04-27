/**
 * Quick List — splash, chooser, editor, and bulletin-board preview.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'quickList_visited';

  const TEMPLATE_META = {
    sale: {
      headline: 'For Sale',
      summary:
        'Add a clear title, your price, a short description, and a phone number so interested buyers can reach you quickly.',
    },
    rent: {
      headline: 'For Rent',
      summary:
        'Add a title, monthly rent, what makes the space work, and the best way to contact you about showings or questions.',
    },
    lost: {
      headline: 'Lost',
      summary:
        'Describe what is missing, where it was last seen, whether there is a reward, and how someone should get in touch if they find it.',
    },
    action: {
      headline: 'Take Action',
      summary:
        'Give this a strong headline, explain the situation, choose the label for your button, and paste the link it should open.',
    },
  };

  const CHIP_LABEL = {
    sale: 'For sale',
    rent: 'For rent',
    lost: 'Lost',
    action: 'Take action',
  };

  const LUCIDE_ICON = {
    sale: 'tag',
    rent: 'key',
    lost: 'search',
    action: 'megaphone',
  };

  const splash = document.getElementById('state-splash');
  const flow = document.getElementById('state-flow');
  const chooser = document.getElementById('state-chooser');
  const editor = document.getElementById('state-editor');
  const preview = document.getElementById('state-preview');
  const viewer = document.getElementById('state-viewer');
  const form = document.getElementById('listing-form');
  const fieldTemplate = document.getElementById('field-template');
  const editorHeadline = document.getElementById('editor-headline');
  const editorFieldSummary = document.getElementById('editor-field-summary');
  const splashCta = document.getElementById('splash-cta');
  const btnBackChooser = document.getElementById('btn-back-chooser');
  const btnChangeType = document.getElementById('btn-change-type');
  const btnToPreview = document.getElementById('btn-to-preview');
  const btnBackEditor = document.getElementById('btn-back-editor');
  const listingPreview = document.getElementById('listing-preview');
  const listingPreviewBoard = document.getElementById('listing-preview-board');
  const listingPreviewError = document.getElementById('listing-preview-error');
  const share = document.getElementById('state-share');
  const shareUrl = document.getElementById('share-url');
  const btnShareLink = document.getElementById('btn-share-link');
  const btnConfirmGenerate = document.getElementById('btn-confirm-generate');
  const btnNewListing = document.getElementById('btn-new-listing');
  const btnBackPreview = document.getElementById('btn-back-preview');
  const qrContainer = document.getElementById('qr-container');
  const modalShare = document.getElementById('modal-share');
  const modalShareBackdrop = document.getElementById('modal-share-backdrop');
  const modalShareSms = document.getElementById('modal-share-sms');
  const modalShareCopy = document.getElementById('modal-share-copy');
  const modalShareClose = document.getElementById('modal-share-close');
  const btnShareQr = document.getElementById('btn-share-qr');
  const modalQrShare = document.getElementById('modal-share-qr');
  const modalQrBackdrop = document.getElementById('modal-share-qr-backdrop');
  const modalQrSms = document.getElementById('modal-share-qr-sms');
  const modalQrCopy = document.getElementById('modal-share-qr-copy');
  const modalQrClose = document.getElementById('modal-share-qr-close');
  const linkAboutQuickList = document.getElementById('link-about-quicklist');
  const btnSaveCalendar = document.getElementById('btn-save-calendar');
  const modalCalendar = document.getElementById('modal-calendar');
  const modalCalendarBackdrop = document.getElementById('modal-calendar-backdrop');
  const modalCalendarGoogle = document.getElementById('modal-calendar-google');
  const modalCalendarIcal = document.getElementById('modal-calendar-ical');
  const modalCalendarIcs = document.getElementById('modal-calendar-ics');
  const modalCalendarClose = document.getElementById('modal-calendar-close');

  const MODAL_COPY_LABEL = 'Copy to clipboard';
  const MODAL_QR_COPY_LABEL = 'Copy to clipboard';
  let copyModalResetTimer;
  let copyQrModalResetTimer;
  let lastFocusBeforeModal = null;
  let lastFocusBeforeQrModal = null;
  let lastFocusBeforeCalendar = null;

  function show(el) {
    if (el) el.classList.remove('hidden');
  }

  function hide(el) {
    if (el) el.classList.add('hidden');
  }

  function refreshIcons() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function val(id) {
    const el = document.getElementById(id);
    return el && 'value' in el ? String(el.value).trim() : '';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function displayOrPlaceholder(text, placeholder) {
    const t = String(text || '').trim();
    if (t) return escapeHtml(t);
    return '<span style="opacity:.42">' + escapeHtml(placeholder) + '</span>';
  }

  /** US NANP: 10 digits -> XXX-XXX-XXXX; 11 starting with 1 -> 1-XXX-XXX-XXXX. Otherwise null (keep raw). */
  function formatPhoneDigits(input) {
    const digits = String(input || '').replace(/\D/g, '');
    if (digits.length === 10) {
      return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    }
    if (digits.length === 11 && digits.charAt(0) === '1') {
      return '1-' + digits.slice(1, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7);
    }
    return null;
  }

  /** Phone / text contact lines on flyers; adds hyphens for US-style numbers, leaves email as-is. */
  function displayPhoneOrPlaceholder(text, placeholder) {
    const t = String(text || '').trim();
    if (!t) {
      return '<span style="opacity:.42">' + escapeHtml(placeholder) + '</span>';
    }
    if (t.indexOf('@') !== -1) {
      return escapeHtml(t);
    }
    const formatted = formatPhoneDigits(t);
    if (formatted) {
      return escapeHtml(formatted);
    }
    return escapeHtml(t);
  }

  /**
   * Sale/rent amounts: single $, thousands commas when the value is a plain number
   * (optional existing commas and one leading $ are normalized first).
   */
  function displayMoneyOrPlaceholder(raw, placeholder) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) {
      return '<span style="opacity:.42">' + escapeHtml(placeholder) + '</span>';
    }
    const core = trimmed.replace(/^\$+\s*/, '');
    if (!core) {
      return '<span style="opacity:.42">' + escapeHtml(placeholder) + '</span>';
    }

    const numeric = core.replace(/,/g, '').trim();
    if (/^-?\d+(\.\d+)?$/.test(numeric)) {
      const num = Number(numeric);
      if (isFinite(num)) {
        const absFmt = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 10,
        }).format(Math.abs(num));
        const withSign = num < 0 ? '-$' + absFmt : '$' + absFmt;
        return escapeHtml(withSign);
      }
    }

    return escapeHtml('$' + core);
  }

  function safeHref(raw) {
    let u = String(raw || '').trim();
    if (!u) return '#';
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try {
      const parsed = new URL(u);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href;
    } catch (_) {
      /* ignore */
    }
    return '#';
  }

  function encodePayload(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return encodeURIComponent(btoa(binary));
  }

  function decodePayload(encoded) {
    const binary = atob(decodeURIComponent(encoded));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function buildListingUrl(data) {
    const u = new URL(window.location.href);
    const base = u.origin + u.pathname;
    return base + '?data=' + encodePayload(data);
  }

  function icsPad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function icsDateValueLocalYmd(d) {
    return d.getFullYear() + icsPad2(d.getMonth() + 1) + icsPad2(d.getDate());
  }

  function icsEscape(value) {
    if (value == null) return '';
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, '\\n');
  }

  function buildCalendarEventDescription(data, listingUrl) {
    const lines = [listingUrl];
    if (data && data.title) {
      lines.push('Title: ' + data.title);
    }
    if (!data) return lines.join('\n');
    if (data.template === 'sale') {
      if (data.price) lines.push('Price: ' + data.price);
      if (data.description) lines.push('Description: ' + data.description);
      if (data.phone) lines.push('Phone: ' + data.phone);
    } else if (data.template === 'rent') {
      if (data.rent) lines.push('Rent: ' + data.rent);
      if (data.description) lines.push('Description: ' + data.description);
      if (data.phone) lines.push('Phone: ' + data.phone);
    } else if (data.template === 'lost') {
      if (data.lastSeen) lines.push('Last seen: ' + data.lastSeen);
      if (data.reward) lines.push('Reward: ' + data.reward);
      if (data.contact) lines.push('Contact: ' + data.contact);
    } else if (data.template === 'action') {
      if (data.description) lines.push('Details: ' + data.description);
      if (data.ctaText) lines.push('Button: ' + data.ctaText);
      if (data.ctaUrl) lines.push('Link: ' + data.ctaUrl);
    }
    return lines.join('\n');
  }

  function buildListingIcsString(data, listingUrl) {
    const now = new Date();
    const stamp =
      now.getUTCFullYear() +
      icsPad2(now.getUTCMonth() + 1) +
      icsPad2(now.getUTCDate()) +
      'T' +
      icsPad2(now.getUTCHours()) +
      icsPad2(now.getUTCMinutes()) +
      icsPad2(now.getUTCSeconds()) +
      'Z';
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const dStart = icsDateValueLocalYmd(start);
    const dEnd = icsDateValueLocalYmd(end);
    const title = (data && data.title) || 'Quick List listing';
    const desc = buildCalendarEventDescription(data, listingUrl);
    const uid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID() + '@quicklist'
        : 'ql-' + String(Date.now()) + '@quicklist';
    return (
      'BEGIN:VCALENDAR\r\n' +
      'VERSION:2.0\r\n' +
      'PRODID:-//Quick List//EN\r\n' +
      'CALSCALE:GREGORIAN\r\n' +
      'BEGIN:VEVENT\r\n' +
      'UID:' +
      uid +
      '\r\n' +
      'DTSTAMP:' +
      stamp +
      '\r\n' +
      'DTSTART;VALUE=DATE:' +
      dStart +
      '\r\n' +
      'DTEND;VALUE=DATE:' +
      dEnd +
      '\r\n' +
      'SUMMARY:' +
      icsEscape(title) +
      '\r\n' +
      'DESCRIPTION:' +
      icsEscape(desc) +
      '\r\n' +
      'END:VEVENT\r\n' +
      'END:VCALENDAR\r\n'
    );
  }

  function buildGoogleCalendarAddUrl(data, listingUrl) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const d0 = icsDateValueLocalYmd(start);
    const d1 = icsDateValueLocalYmd(end);
    const title = (data && data.title) || 'Quick List listing';
    const details = buildCalendarEventDescription(data, listingUrl);
    return (
      'https://www.google.com/calendar/render?action=TEMPLATE&text=' +
      encodeURIComponent(title) +
      '&dates=' +
      d0 +
      '%2F' +
      d1 +
      '&details=' +
      encodeURIComponent(details)
    );
  }

  function getCalendarContext() {
    const data = collectFormData();
    if (!data.title || !data.template) return null;
    let listingUrl = (shareUrl && shareUrl.value.trim()) || '';
    if (!listingUrl) {
      try {
        listingUrl = buildListingUrl(data);
      } catch {
        return null;
      }
    }
    return { data: data, url: listingUrl };
  }

  function collectFormData() {
    const t = fieldTemplate.value;
    const base = { template: t, title: val('field-title') };
    if (t === 'sale') {
      base.price = val('field-price');
      base.description = val('field-description');
      base.phone = val('field-phone');
    } else if (t === 'rent') {
      base.rent = val('field-rent');
      base.description = val('field-description');
      base.phone = val('field-phone');
    } else if (t === 'lost') {
      base.lastSeen = val('field-last-seen');
      base.reward = val('field-reward');
      base.contact = val('field-contact');
    } else if (t === 'action') {
      base.description = val('field-description');
      base.ctaText = val('field-cta-text');
      base.ctaUrl = val('field-cta-url');
    }
    return base;
  }

  function posterFrame(modClass, innerHtml) {
    return (
      '<div class="ql-preview-shell">' +
      '<div class="ql-poster ' +
      modClass +
      '">' +
      '<span class="ql-pin ql-pin--tl" aria-hidden="true"></span>' +
      '<span class="ql-pin ql-pin--tr" aria-hidden="true"></span>' +
      '<div class="ql-poster__tape" aria-hidden="true"></div>' +
      innerHtml +
      '</div></div>'
    );
  }

  function mdChip(template) {
    return (
      '<div class="flex justify-center px-1">' +
      '<span class="ql-md-chip">' +
      escapeHtml(CHIP_LABEL[template] || 'Listing') +
      '</span></div>'
    );
  }

  function iconRow(template) {
    const name = LUCIDE_ICON[template] || 'file-text';
    return (
      '<div class="ql-poster__icon text-[#1c1b1f]" aria-hidden="true">' +
      '<i data-lucide="' +
      escapeHtml(name) +
      '" stroke-width="1.75"></i></div>'
    );
  }

  function renderBulletinBoard(data) {
    const t = data.template;
    const accentBar = '<div class="ql-accent-bar" aria-hidden="true"></div>';
    const titleBlock =
      '<p class="ql-flyer-kicker">Posted on the community board</p>' +
      '<h3 class="ql-flyer-title">' +
      displayOrPlaceholder(data.title, 'Your headline here') +
      '</h3>';

    const lostTitleBlock =
      '<p class="ql-flyer-kicker" style="color:#bf360c">Please keep an eye out</p>' +
      '<h3 class="ql-flyer-title">' +
      displayOrPlaceholder(data.title, 'What went missing?') +
      '</h3>';

    if (t === 'sale') {
      const body =
        accentBar +
        iconRow(t) +
        mdChip(t) +
        titleBlock +
        '<p class="ql-price text-center text-[1.85rem] font-bold leading-tight tracking-tight" style="color:#1b5e20;margin:.35rem 0 .15rem">' +
        displayMoneyOrPlaceholder(data.price, 'Name your price') +
        '</p>' +
        '<div class="ql-md-divider" aria-hidden="true"></div>' +
        '<p class="ql-flyer-sub whitespace-pre-wrap">' +
        displayOrPlaceholder(data.description, 'Tell neighbors what you are selling and why it is a great pick-up.') +
        '</p>' +
        '<div class="ql-tear-line">' +
        '<p class="text-xs font-medium uppercase tracking-[0.14em] text-[#49454f]">Tear-off · call or text</p>' +
        '<p class="mt-1 text-lg font-bold tracking-wide text-[#1c1b1f]">' +
        displayPhoneOrPlaceholder(data.phone, 'Your number here') +
        '</p></div>';
      return posterFrame('ql-poster--sale', body);
    }

    if (t === 'rent') {
      const body =
        accentBar +
        iconRow(t) +
        mdChip(t) +
        titleBlock +
        '<div class="ql-md-tonal-block">' +
        '<p class="text-center text-xs font-medium uppercase tracking-[0.12em] text-[#0d47a1]">Monthly</p>' +
        '<p class="text-center text-[1.65rem] font-bold text-[#0d47a1]">' +
        displayMoneyOrPlaceholder(data.rent, 'Rent amount') +
        '</p></div>' +
        '<div class="ql-md-divider" aria-hidden="true"></div>' +
        '<p class="ql-flyer-sub whitespace-pre-wrap">' +
        displayOrPlaceholder(data.description, 'Describe the space, lease notes, and what makes it easy to say yes.') +
        '</p>' +
        '<div class="ql-tear-line">' +
        '<p class="text-xs font-medium uppercase tracking-[0.14em] text-[#49454f]">Interested? Reach out</p>' +
        '<p class="mt-1 text-lg font-bold tracking-wide text-[#1c1b1f]">' +
        displayPhoneOrPlaceholder(data.phone, 'Phone or text') +
        '</p></div>';
      return posterFrame('ql-poster--rent', body);
    }

    if (t === 'lost') {
      const body =
        accentBar +
        iconRow(t) +
        mdChip(t) +
        lostTitleBlock +
        '<div class="ql-md-tonal-block">' +
        '<p class="text-xs font-medium uppercase tracking-[0.12em] text-[#bf360c]">Last seen near</p>' +
        '<p class="mt-1 text-base font-medium text-[#1c1b1f]">' +
        displayOrPlaceholder(data.lastSeen, 'Neighborhood, cross streets, or date') +
        '</p></div>' +
        '<div class="ql-md-divider" aria-hidden="true"></div>' +
        '<p class="ql-flyer-sub">' +
        '<span class="font-medium text-[#bf360c]">Reward:</span> ' +
        displayOrPlaceholder(data.reward, 'Optional — coffee, thanks, or cash') +
        '</p>' +
        '<div class="ql-tear-line">' +
        '<p class="text-xs font-medium uppercase tracking-[0.14em] text-[#49454f]">If found, contact</p>' +
        '<p class="mt-1 text-lg font-bold tracking-wide text-[#1c1b1f]">' +
        displayPhoneOrPlaceholder(data.contact, 'Phone or email') +
        '</p></div>';
      return posterFrame('ql-poster--lost', body);
    }

    if (t === 'action') {
      const href = safeHref(data.ctaUrl);
      const hasLink = href !== '#';
      const label = displayOrPlaceholder(data.ctaText, 'Tap to learn more');
      const fab =
        '<div class="mt-5 flex flex-col items-center gap-2">' +
        (hasLink
          ? '<a class="ql-md-fab text-white" style="background:#5e35b1" href="' +
            escapeHtml(href) +
            '" rel="noopener noreferrer" target="_blank">' +
            label +
            '</a>'
          : '<span class="ql-md-fab cursor-default text-white opacity-55" style="background:#5e35b1" role="note">' +
            label +
            '</span>' +
            '<p class="text-center text-xs text-[#49454f]">Add a valid URL so neighbors can take action.</p>') +
        '</div>';

      const body =
        accentBar +
        iconRow(t) +
        mdChip(t) +
        titleBlock +
        '<div class="ql-md-divider" aria-hidden="true"></div>' +
        '<p class="ql-flyer-sub whitespace-pre-wrap">' +
        displayOrPlaceholder(data.description, 'Explain what happened and what you need from the community.') +
        '</p>' +
        fab;
      return posterFrame('ql-poster--action', body);
    }

    return posterFrame('ql-poster--sale', accentBar + '<p class="ql-flyer-sub text-center">Unknown listing type.</p>');
  }

  function hidePreviewError() {
    if (!listingPreviewError) return;
    listingPreviewError.classList.add('hidden');
    listingPreviewError.textContent = '';
  }

  function showPreviewError(msg) {
    if (!listingPreviewError) return;
    listingPreviewError.textContent = msg;
    listingPreviewError.classList.remove('hidden');
  }

  function goPreview() {
    closeShareModal();
    hidePreviewError();
    const data = collectFormData();
    if (!data.template || !TEMPLATE_META[data.template]) {
      showPreviewError('Pick a listing type first.');
      listingPreviewError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (!data.title) {
      showPreviewError('Add a title so your posted flyer has a clear headline.');
      listingPreviewError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    if (listingPreviewBoard) {
      listingPreviewBoard.innerHTML = renderBulletinBoard(data);
    }
    hide(editor);
    hide(share);
    show(preview);
    refreshIcons();
    if (listingPreview) {
      listingPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goBackToEditor() {
    closeShareModal();
    hidePreviewError();
    hide(preview);
    hide(share);
    show(editor);
    refreshIcons();
  }

  function renderQr(fullUrl) {
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    qrContainer.textContent = '';
    if (typeof QRCode === 'undefined') {
      qrContainer.textContent = 'QR library failed to load.';
      return;
    }
    try {
      const Level = QRCode.CorrectLevel || { H: 2 };
      new QRCode(qrContainer, {
        text: fullUrl,
        width: 280,
        height: 280,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: Level.H,
      });
    } catch (e) {
      qrContainer.textContent = 'Could not build QR for this link (it may be too long).';
    }
  }

  function updateModalScrollLock() {
    const linkOpen = modalShare && !modalShare.classList.contains('hidden');
    const qrOpen = modalQrShare && !modalQrShare.classList.contains('hidden');
    const calOpen = modalCalendar && !modalCalendar.classList.contains('hidden');
    document.body.classList.toggle('overflow-hidden', !!(linkOpen || qrOpen || calOpen));
  }

  function getQrCanvasOrImg() {
    if (!qrContainer) return null;
    const canvas = qrContainer.querySelector('canvas');
    if (canvas) return { kind: 'canvas', el: canvas };
    const img = qrContainer.querySelector('img');
    if (img) return { kind: 'img', el: img };
    return null;
  }

  function canvasToPngBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob || null);
      }, 'image/png');
    });
  }

  function imgToPngBlob(img) {
    return new Promise(function (resolve) {
      function draw() {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (!w || !h) {
            resolve(null);
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(function (blob) {
            resolve(blob || null);
          }, 'image/png');
        } catch {
          resolve(null);
        }
      }
      if (img.complete) {
        draw();
      } else {
        img.onload = function () {
          draw();
        };
        img.onerror = function () {
          resolve(null);
        };
      }
    });
  }

  function getQrPngBlob() {
    return new Promise(function (resolve) {
      const node = getQrCanvasOrImg();
      if (!node) {
        resolve(null);
        return;
      }
      if (node.kind === 'canvas') {
        canvasToPngBlob(node.el).then(resolve);
      } else {
        imgToPngBlob(node.el).then(resolve);
      }
    });
  }

  function copyQrImageToClipboard() {
    return getQrPngBlob().then(function (blob) {
      if (!blob) return Promise.resolve(false);
      if (navigator.clipboard && window.ClipboardItem && navigator.clipboard.write) {
        return navigator.clipboard
          .write([new ClipboardItem({ 'image/png': blob })])
          .then(
            function () {
              return true;
            },
            function () {
              return false;
            },
          );
      }
      return Promise.resolve(false);
    });
  }

  function fallbackSmsWithListingUrl() {
    const url = shareUrl ? shareUrl.value.trim() : '';
    if (!url) return;
    window.location.href = 'sms:?body=' + encodeURIComponent('Open my listing: ' + url);
  }

  function goGenerateLink() {
    closeShareModal();
    const data = collectFormData();
    if (!data.template || !TEMPLATE_META[data.template]) {
      goBackToEditor();
      showPreviewError('Pick a listing type first.');
      return;
    }
    if (!data.title) {
      goBackToEditor();
      showPreviewError('Add a title before generating a link.');
      return;
    }

    let listingUrl;
    try {
      listingUrl = buildListingUrl(data);
    } catch (e) {
      goBackToEditor();
      showPreviewError('Could not encode your listing. Try shortening the text.');
      return;
    }

    if (shareUrl) shareUrl.value = listingUrl;
    renderQr(listingUrl);

    hide(preview);
    hide(editor);
    show(share);
    refreshIcons();
    if (share) share.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goBackToPreviewFromShare() {
    closeShareModal();
    hide(share);
    show(preview);
    refreshIcons();
    if (listingPreview) listingPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startAnotherListing() {
    closeShareModal();
    hide(share);
    hide(preview);
    hide(editor);
    hidePreviewError();
    form.reset();
    fieldTemplate.value = '';
    document.querySelectorAll('.field-group').forEach(function (group) {
      group.classList.add('hidden');
    });
    show(chooser);
    refreshIcons();
  }

  function resetModalCopyButton() {
    if (modalShareCopy) modalShareCopy.textContent = MODAL_COPY_LABEL;
    clearTimeout(copyModalResetTimer);
  }

  function resetModalQrCopyButton() {
    if (modalQrCopy) modalQrCopy.textContent = MODAL_QR_COPY_LABEL;
    clearTimeout(copyQrModalResetTimer);
  }

  function closeQrShareModal() {
    resetModalQrCopyButton();
    if (!modalQrShare) {
      updateModalScrollLock();
      return;
    }
    const wasOpenQr = !modalQrShare.classList.contains('hidden');
    modalQrShare.classList.add('hidden');
    if (wasOpenQr && lastFocusBeforeQrModal && typeof lastFocusBeforeQrModal.focus === 'function') {
      lastFocusBeforeQrModal.focus();
    }
    if (wasOpenQr) {
      lastFocusBeforeQrModal = null;
    }
    updateModalScrollLock();
  }

  function closeCalendarModal() {
    if (!modalCalendar) {
      updateModalScrollLock();
      return;
    }
    const wasOpen = !modalCalendar.classList.contains('hidden');
    modalCalendar.classList.add('hidden');
    if (wasOpen && lastFocusBeforeCalendar && typeof lastFocusBeforeCalendar.focus === 'function') {
      lastFocusBeforeCalendar.focus();
    }
    if (wasOpen) {
      lastFocusBeforeCalendar = null;
    }
    updateModalScrollLock();
  }

  function closeShareModal() {
    closeCalendarModal();
    closeQrShareModal();
    resetModalCopyButton();
    if (!modalShare) {
      lastFocusBeforeModal = null;
      updateModalScrollLock();
      return;
    }
    const wasOpen = !modalShare.classList.contains('hidden');
    modalShare.classList.add('hidden');
    if (wasOpen && lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function') {
      lastFocusBeforeModal.focus();
    }
    lastFocusBeforeModal = null;
    updateModalScrollLock();
  }

  function onModalsEscape(e) {
    if (e.key !== 'Escape') return;
    if (modalCalendar && !modalCalendar.classList.contains('hidden')) {
      e.preventDefault();
      closeCalendarModal();
      return;
    }
    if (modalQrShare && !modalQrShare.classList.contains('hidden')) {
      e.preventDefault();
      closeQrShareModal();
      return;
    }
    if (modalShare && !modalShare.classList.contains('hidden')) {
      e.preventDefault();
      closeShareModal();
    }
  }

  function openShareModal() {
    if (!modalShare || !shareUrl) return;
    const text = shareUrl.value;
    if (!text.trim()) return;

    closeCalendarModal();
    closeQrShareModal();
    lastFocusBeforeModal = document.activeElement;
    resetModalCopyButton();
    modalShare.classList.remove('hidden');
    updateModalScrollLock();
    window.requestAnimationFrame(function () {
      if (modalShareSms) modalShareSms.focus();
    });
  }

  function openCalendarModal() {
    if (!getCalendarContext() || !modalCalendar) return;
    lastFocusBeforeCalendar = btnSaveCalendar || document.activeElement;
    closeShareModal();
    modalCalendar.classList.remove('hidden');
    updateModalScrollLock();
    window.requestAnimationFrame(function () {
      if (modalCalendarGoogle) modalCalendarGoogle.focus();
    });
  }

  function onModalCalendarGoogle() {
    const ctx = getCalendarContext();
    if (!ctx) return;
    const gcal = buildGoogleCalendarAddUrl(ctx.data, ctx.url);
    window.open(gcal, '_blank', 'noopener,noreferrer');
  }

  function onModalCalendarIcsDownload() {
    const ctx = getCalendarContext();
    if (!ctx) return;
    const ics = buildListingIcsString(ctx.data, ctx.url);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'quicklist-listing.ics';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {
        /* ignore */
      }
    }, 5000);
  }

  function onModalCalendarIcal() {
    const ctx = getCalendarContext();
    if (!ctx) return;
    const ics = buildListingIcsString(ctx.data, ctx.url);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const burl = URL.createObjectURL(blob);
    const w = window.open(burl, '_blank', 'noopener,noreferrer');
    if (w) {
      setTimeout(function () {
        try {
          URL.revokeObjectURL(burl);
        } catch {
          /* ignore */
        }
      }, 120000);
    } else {
      onModalCalendarIcsDownload();
      try {
        URL.revokeObjectURL(burl);
      } catch {
        /* ignore */
      }
    }
  }

  function openQrShareModal() {
    if (!modalQrShare) return;
    getQrPngBlob().then(function (blob) {
      if (!blob) return;
      closeShareModal();
      lastFocusBeforeQrModal = btnShareQr || document.activeElement;
      resetModalQrCopyButton();
      modalQrShare.classList.remove('hidden');
      updateModalScrollLock();
      window.requestAnimationFrame(function () {
        if (modalQrSms) modalQrSms.focus();
      });
    });
  }

  function copyListingUrlToClipboard() {
    const text = shareUrl ? shareUrl.value : '';
    if (!text) return Promise.resolve(false);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackExecCopy(text);
        },
      );
    }
    return Promise.resolve(fallbackExecCopy(text));
  }

  function fallbackExecCopy(text) {
    if (!shareUrl) return false;
    shareUrl.focus();
    shareUrl.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    }
  }

  function onModalShareSms() {
    if (!shareUrl) return;
    const url = shareUrl.value.trim();
    if (!url) return;
    window.location.href = 'sms:?body=' + encodeURIComponent(url);
    closeShareModal();
  }

  function onModalShareCopy() {
    if (!modalShareCopy) return;
    copyListingUrlToClipboard().then(function (ok) {
      if (ok) {
        modalShareCopy.textContent = 'Copied!';
        clearTimeout(copyModalResetTimer);
        copyModalResetTimer = setTimeout(function () {
          closeShareModal();
        }, 1200);
      } else {
        modalShareCopy.textContent = 'Select URL field to copy';
        clearTimeout(copyModalResetTimer);
        copyModalResetTimer = setTimeout(function () {
          modalShareCopy.textContent = MODAL_COPY_LABEL;
        }, 2800);
      }
    });
  }

  function onModalQrSms() {
    const url = shareUrl ? shareUrl.value.trim() : '';
    getQrPngBlob().then(function (blob) {
      if (!blob) {
        fallbackSmsWithListingUrl();
        closeQrShareModal();
        return;
      }
      const file = new File([blob], 'quicklist-listing-qr.png', { type: 'image/png' });
      const sharePayload = { files: [file], title: 'Listing QR code' };
      if (url) sharePayload.text = 'Open or scan: ' + url;
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        navigator
          .share(sharePayload)
          .then(function () {
            closeQrShareModal();
          })
          .catch(function (err) {
            if (err && err.name === 'AbortError') {
              closeQrShareModal();
              return;
            }
            fallbackSmsWithListingUrl();
            closeQrShareModal();
          });
      } else {
        fallbackSmsWithListingUrl();
        closeQrShareModal();
      }
    });
  }

  function onModalQrCopy() {
    if (!modalQrCopy) return;
    copyQrImageToClipboard().then(function (ok) {
      if (ok) {
        modalQrCopy.textContent = 'Copied!';
        clearTimeout(copyQrModalResetTimer);
        copyQrModalResetTimer = setTimeout(function () {
          closeQrShareModal();
        }, 1200);
      } else {
        modalQrCopy.textContent = 'Could not copy image';
        clearTimeout(copyQrModalResetTimer);
        copyQrModalResetTimer = setTimeout(function () {
          modalQrCopy.textContent = MODAL_QR_COPY_LABEL;
        }, 2800);
      }
    });
  }

  function tryInitViewer() {
    const raw = new URLSearchParams(window.location.search).get('data');
    if (!raw) return false;

    hide(splash);
    hide(flow);
    show(viewer);
    bindAboutQuickList();

    const heading = document.getElementById('viewer-heading');
    const body = document.getElementById('viewer-body');
    const viewerHeader = document.querySelector('#state-viewer header');
    if (!heading || !body) return true;

    try {
      const decoded = decodePayload(raw);
      if (viewerHeader) viewerHeader.classList.add('hidden');
      body.className = '';
      body.innerHTML = renderBulletinBoard(decoded);
      refreshIcons();
    } catch {
      if (viewerHeader) viewerHeader.classList.remove('hidden');
      heading.textContent = 'Listing';
      body.className = 'space-y-4 text-slate-600';
      body.textContent = 'This link could not be read. It may be damaged or incomplete.';
    }
    return true;
  }

  function applyTemplate(templateId) {
    const meta = TEMPLATE_META[templateId];
    if (!meta) return;

    fieldTemplate.value = templateId;
    editorHeadline.textContent = meta.headline;
    editorFieldSummary.textContent = meta.summary;

    document.querySelectorAll('.field-group').forEach(function (group) {
      const keys = (group.getAttribute('data-templates') || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const match = keys.length === 0 || keys.includes(templateId);
      group.classList.toggle('hidden', !match);
    });
  }

  function playEditorEnter() {
    editor.classList.remove('animate-ql-enter');
    void editor.offsetWidth;
    editor.classList.add('animate-ql-enter');
    editor.addEventListener(
      'animationend',
      function onEnd() {
        editor.classList.remove('animate-ql-enter');
        editor.removeEventListener('animationend', onEnd);
      },
      { once: true },
    );
  }

  function openChooser() {
    closeShareModal();
    hide(editor);
    hide(preview);
    hide(share);
    hidePreviewError();
    show(chooser);
    refreshIcons();
  }

  function openEditorFromTemplate(templateId) {
    if (!TEMPLATE_META[templateId]) return;

    closeShareModal();
    form.reset();
    fieldTemplate.value = templateId;
    applyTemplate(templateId);

    hide(chooser);
    hide(preview);
    hide(share);
    hidePreviewError();
    show(editor);
    playEditorEnter();

    refreshIcons();
    window.requestAnimationFrame(function () {
      const title = document.getElementById('field-title');
      if (title) title.focus();
    });
  }

  function openOnboardingModal() {
    closeShareModal();
    show(splash);
    window.requestAnimationFrame(function () {
      if (splashCta) splashCta.focus();
    });
  }

  function bindAboutQuickList() {
    if (!linkAboutQuickList || linkAboutQuickList.dataset.bound === '1') return;
    linkAboutQuickList.dataset.bound = '1';
    linkAboutQuickList.addEventListener('click', openOnboardingModal);
  }

  function onSplashContinue() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore quota / private mode */
    }
    hide(splash);
    if (viewer) hide(viewer);
    show(flow);
    startAnotherListing();
  }

  function init() {
    if (tryInitViewer()) return;

    const visited = (function () {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    if (visited) {
      hide(splash);
      show(flow);
      show(chooser);
    } else {
      show(splash);
      hide(flow);
    }

    splashCta.addEventListener('click', onSplashContinue);

    document.querySelectorAll('.template-row').forEach(function (row) {
      row.addEventListener('click', function () {
        const t = row.getAttribute('data-template');
        openEditorFromTemplate(t);
      });
    });

    btnBackChooser.addEventListener('click', openChooser);
    btnChangeType.addEventListener('click', openChooser);

    if (btnToPreview) btnToPreview.addEventListener('click', goPreview);
    if (btnBackEditor) btnBackEditor.addEventListener('click', goBackToEditor);
    if (btnConfirmGenerate) btnConfirmGenerate.addEventListener('click', goGenerateLink);
    if (btnShareLink) btnShareLink.addEventListener('click', openShareModal);
    if (modalShareBackdrop) modalShareBackdrop.addEventListener('click', closeShareModal);
    if (modalShareClose) modalShareClose.addEventListener('click', closeShareModal);
    if (modalShareSms) modalShareSms.addEventListener('click', onModalShareSms);
    if (modalShareCopy) modalShareCopy.addEventListener('click', onModalShareCopy);
    if (btnShareQr) btnShareQr.addEventListener('click', openQrShareModal);
    if (modalQrBackdrop) modalQrBackdrop.addEventListener('click', closeQrShareModal);
    if (modalQrClose) modalQrClose.addEventListener('click', closeQrShareModal);
    if (modalQrSms) modalQrSms.addEventListener('click', onModalQrSms);
    if (modalQrCopy) modalQrCopy.addEventListener('click', onModalQrCopy);
    if (btnNewListing) btnNewListing.addEventListener('click', startAnotherListing);
    if (btnBackPreview) btnBackPreview.addEventListener('click', goBackToPreviewFromShare);
    if (btnSaveCalendar) btnSaveCalendar.addEventListener('click', openCalendarModal);
    if (modalCalendarBackdrop) modalCalendarBackdrop.addEventListener('click', closeCalendarModal);
    if (modalCalendarClose) modalCalendarClose.addEventListener('click', closeCalendarModal);
    if (modalCalendarGoogle) modalCalendarGoogle.addEventListener('click', onModalCalendarGoogle);
    if (modalCalendarIcal) modalCalendarIcal.addEventListener('click', onModalCalendarIcal);
    if (modalCalendarIcs) modalCalendarIcs.addEventListener('click', onModalCalendarIcsDownload);

    document.addEventListener('keydown', onModalsEscape);

    bindAboutQuickList();

    refreshIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
