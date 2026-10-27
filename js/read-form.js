// Turns the Credit Viability Read form into a pre-filled email.
(function () {
  var form = document.getElementById('read-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) return;
    event.preventDefault();

    var lines = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit') return;
      var value = (el.value || '').trim();
      if (value) lines.push(el.name + ': ' + value);
    });

    var scheme = form.elements['Scheme and version'].value;
    var subject = 'Credit Viability Read — ' + scheme;
    var body = 'Hello Roberto,\n\nPlease prepare a Credit Viability Read for this project.\n\n' + lines.join('\n') + '\n';

    window.location.href = 'mailto:roberto@r2f.solutions' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
