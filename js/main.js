/* ==========================================================================
   RZ Scan — Landing Page Behaviour
   ========================================================================== */

/**
 * Google Places autocomplete for the project-address field.
 * Called by the Google Maps script tag's `callback` param once the API loads.
 */
function initAutocomplete() {
  const addressInput = document.getElementById('ef-address');
  if (!addressInput) return;

  const autocomplete = new google.maps.places.Autocomplete(addressInput, {
    componentRestrictions: { country: 'au' },
    types: ['address'],
    fields: ['formatted_address']
  });

  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      addressInput.value = place.formatted_address;
    }
  });
}

/* ── Mobile menu toggle ── */
const ham = document.getElementById('ham');
const menu = document.getElementById('mob-menu');
ham.addEventListener('click', () => menu.classList.toggle('open'));

/* ── "Request a quote" enquiry form toggle ── */
const toggleBtn = document.getElementById('quote-toggle');
const enquiryWrap = document.getElementById('enquiry-wrap');
toggleBtn.addEventListener('click', function () {
  const isOpen = enquiryWrap.classList.contains('open');
  if (isOpen) {
    enquiryWrap.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = 'Request a quote \u2192';
  } else {
    enquiryWrap.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.textContent = 'Close \u00d7';
    setTimeout(() => enquiryWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
});

/* ── Top notice bar dismissal (persisted for the session) ── */
/* Guarded: on pages without a notice bar in the markup, these lookups
   return null, and calling addEventListener() on null would throw and
   silently kill every script block below this one (reveal-toggles,
   enquiry form submit). */
const noticeBar = document.getElementById('notice-bar');
const noticeDismiss = document.getElementById('notice-dismiss');
if (noticeBar && noticeDismiss) {
  if (sessionStorage.getItem('notice-dismissed')) {
    noticeBar.style.display = 'none';
  }
  noticeDismiss.addEventListener('click', function () {
    noticeBar.style.display = 'none';
    sessionStorage.setItem('notice-dismissed', 'true');
  });
}

/* ── "Read more" reveal toggles (problem cards, services, process steps, about) ── */
document.querySelectorAll('.reveal-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const group = btn.dataset.group;
    const bodies = document.querySelectorAll('.reveal-body[data-group="' + group + '"]');
    const buttons = document.querySelectorAll('.reveal-toggle[data-group="' + group + '"]');
    const isOpen = bodies[0].classList.contains('open');

    bodies.forEach(function (body) {
      body.classList.toggle('open', !isOpen);
    });
    buttons.forEach(function (button) {
      button.textContent = isOpen ? button.dataset.more : button.dataset.less;
    });
  });
});

/* ── Enquiry form submission (Formspree) ── */
const form = document.querySelector('.enquiry-form');
const status = document.getElementById('ef-status');
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = form.querySelector('.ef-submit');
  btn.textContent = 'Sending\u2026';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      status.textContent = 'Thank you \u2014 we\u2019ll be in touch within 24 hours.';
      status.style.color = 'var(--accent)';
      form.reset();
      btn.textContent = 'Sent \u2713';
    } else {
      throw new Error();
    }
  } catch {
    status.textContent = 'Something went wrong \u2014 please email us directly.';
    status.style.color = '#c0392b';
    btn.textContent = 'Send enquiry \u2192';
    btn.disabled = false;
  }
});
