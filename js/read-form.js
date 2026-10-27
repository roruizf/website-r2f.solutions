// Sends the Credit Viability Read form to Formspree. If the endpoint is not
// configured yet, or the request fails, falls back to a pre-filled email.
(function () {
  var form = document.getElementById('read-form');
  if (!form) return;

  var status = document.getElementById('read-status');
  var button = form.querySelector('button[type="submit"]');
  var endpoint = form.getAttribute('data-endpoint') || '';
  var configured = endpoint && endpoint.indexOf('FORMSPREE_ID') === -1;

  function answers() {
    var lines = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name.charAt(0) === '_' || el.type === 'submit') return;
      var value = (el.value || '').trim();
      if (value) lines.push(el.name + ': ' + value);
    });
    return lines;
  }

  function mailtoUrl() {
    var subject = 'Credit Viability Read — ' + form.elements['Scheme and version'].value;
    var body = 'Hello Roberto,\n\nPlease prepare a Credit Viability Read for this project.\n\n' + answers().join('\n') + '\n';
    return 'mailto:roberto@r2f.solutions?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function showFallback(message) {
    status.textContent = message + ' ';
    var link = document.createElement('a');
    link.href = mailtoUrl();
    link.textContent = 'Send it by email instead.';
    status.appendChild(link);
  }

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) return;
    event.preventDefault();

    if (!configured) {
      window.location.href = mailtoUrl();
      return;
    }

    button.disabled = true;
    status.textContent = 'Sending…';

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      status.textContent = 'Thank you. Roberto will reply by email.';
    }).catch(function () {
      showFallback('The form could not be sent.');
    }).then(function () {
      button.disabled = false;
    });
  });
})();
