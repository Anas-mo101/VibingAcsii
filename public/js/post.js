function post(path, params, name) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = path;
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = name;
    hiddenField.value = params;
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}