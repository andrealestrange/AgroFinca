function mensajeDe(input) {
    const v = input.validity;
    if (v.valueMissing) return 'Este campo es obligatorio.';
    if (v.typeMismatch) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    if (v.tooShort) return 'Debe tener al menos ' + input.minLength + ' caracteres.';
    if (v.patternMismatch) return input.title || 'El formato no es válido.';
    if (v.rangeUnderflow || v.rangeOverflow) return 'Fecha no válida. Debes ser mayor de edad.';
    return '';
  }
  
  function validarCampo(input) {
    let mensaje = mensajeDe(input);
  
    if (!mensaje && input.id === 'clave2' && input.value !== document.getElementById('clave').value) {
      mensaje = 'Las contraseñas no coinciden.';
    }
  
    input.nextElementSibling.textContent = mensaje;
    input.classList.toggle('invalido', mensaje !== '');
    input.classList.toggle('valido', mensaje === '' && input.value !== '');
    input.setAttribute('aria-invalid', mensaje !== '');
    return mensaje === '';
  }
  
  function mostrarAlerta(form, texto, tipo) {
    const alerta = form.querySelector('.alerta');
    alerta.textContent = texto;
    alerta.className = 'alerta mostrar ' + tipo;
  }
  
  function activarValidacion(form, alEnviar) {
    const campos = Array.from(form.querySelectorAll('input:not([type="checkbox"])'));
  
    campos.forEach(function (campo) {
      const aviso = document.createElement('small');
      aviso.className = 'error-msg';
      aviso.setAttribute('aria-live', 'polite');
      campo.after(aviso);
  
      campo.addEventListener('input', function () {
        validarCampo(campo);
        if (campo.id === 'clave') {
          const confirmar = document.getElementById('clave2');
          if (confirmar && confirmar.value !== '') validarCampo(confirmar);
        }
      });
      campo.addEventListener('blur', function () { validarCampo(campo); });
    });
  
    const alerta = document.createElement('p');
    alerta.className = 'alerta';
    alerta.setAttribute('role', 'alert');
    form.append(alerta);
  
    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      let todoBien = true;
  
      campos.forEach(function (campo) {
        if (!validarCampo(campo)) todoBien = false;
      });
  
      const terminos = form.querySelector('input[type="checkbox"]');
      if (terminos && !terminos.checked) {
        todoBien = false;
        mostrarAlerta(form, 'Debes aceptar los términos y condiciones.', 'err');
      }
  
      if (todoBien) alEnviar(form);
    });
  }
  
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    activarValidacion(formRegistro, function (form) {
      const usuarios = JSON.parse(localStorage.getItem('agrofinca_usuarios')) || [];
      const correo = form.correo.value.trim().toLowerCase();
  
      if (usuarios.some(function (u) { return u.correo === correo; })) {
        mostrarAlerta(form, 'Ese correo ya está registrado.', 'err');
        return;
      }
  
      usuarios.push({
        nombre: form.nombre.value.trim(),
        correo: correo,
        telefono: form.telefono.value,
        nacimiento: form.nacimiento.value,
        clave: form.clave.value
      });
      localStorage.setItem('agrofinca_usuarios', JSON.stringify(usuarios));
  
      form.reset();
      form.querySelectorAll('.valido').forEach(function (i) { i.classList.remove('valido'); });
      mostrarAlerta(form, '✅ Cuenta creada. Te llevamos a iniciar sesión…', 'ok');
      setTimeout(function () { window.location.href = 'login.html'; }, 1500);
    });
  }
  
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    activarValidacion(formLogin, function (form) {
      const usuarios = JSON.parse(localStorage.getItem('agrofinca_usuarios')) || [];
      const correo = form.correo.value.trim().toLowerCase();
  
      const usuario = usuarios.find(function (u) {
        return u.correo === correo && u.clave === form.clave.value;
      });
  
      if (!usuario) {
        mostrarAlerta(form, 'Correo o contraseña incorrectos.', 'err');
        return;
      }
  
      localStorage.setItem('agrofinca_sesion', JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo }));
      mostrarAlerta(form, '✅ Bienvenida, ' + usuario.nombre + '. Te llevamos a los productos…', 'ok');
      setTimeout(function () { window.location.href = 'productos.html'; }, 1200);
    });
  }