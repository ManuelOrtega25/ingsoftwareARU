// Logica de cliente para el Sistema de Donaciones Chihuahua
let mapa;
let marcadores = [];
let tokenActual = localStorage.getItem('token_donaciones') || null;
let usuarioActual = JSON.parse(localStorage.getItem('usuario_donaciones') || 'null');

document.addEventListener('DOMContentLoaded', () => {
  inicializarMapa();
  cargarInstituciones();
  cargarInventario();
  configurarEventos();
  actualizarEstadoUsuario();
});

// Inicializar mapa centrado en Chihuahua capital
function inicializarMapa() {
  mapa = L.map('map').setView([28.6353, -106.0889], 13);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(mapa);
}

// Cargar centros del DIF y casas hogar con marcadores de colores
async function cargarInstituciones() {
  try {
    const res = await fetch('/api/instituciones');
    const data = await res.json();

    if (data.exito) {
      marcadores.forEach(m => mapa.removeLayer(m));
      marcadores = [];

      data.instituciones.forEach(inst => {
        let colorHex = '#10b981'; // verde
        let etiqueta = 'Abastecimiento Suficiente';

        if (inst.estadoSemaforo === 'amarillo') {
          colorHex = '#f59e0b';
          etiqueta = 'Necesidad Moderada';
        } else if (inst.estadoSemaforo === 'rojo') {
          colorHex = '#ef4444';
          etiqueta = 'Prioridad Alta (Urgente)';
        }

        const iconoPersonalizado = L.divIcon({
          className: 'custom-pin',
          html: `<div style="background-color: ${colorHex}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const popupContenido = `
          <div style="font-family: sans-serif; font-size: 13px;">
            <strong style="color: #0f172a; font-size: 14px;">${inst.nombre}</strong><br>
            <span style="display:inline-block; margin-top:4px; padding: 2px 6px; border-radius:4px; font-weight:600; font-size:11px; color:white; background:${colorHex}">
              ${etiqueta}
            </span>
            <p style="margin: 6px 0; color: #475569;">${inst.descripcion}</p>
            <small style="color: #64748b;">${inst.direccion}</small><br>
            <a href="https://wa.me/52${inst.contacto}?text=Hola,%20quisiera%20coordinar%20una%20donaci%C3%B3n%20para%20${encodeURIComponent(inst.nombre)}" 
               target="_blank" class="btn-whatsapp">
              Contactar por WhatsApp
            </a>
          </div>
        `;

        const marcador = L.marker([inst.lat, inst.lng], { icon: iconoPersonalizado })
          .addTo(mapa)
          .bindPopup(popupContenido);

        marcadores.push(marcador);
      });
    }
  } catch (err) {
    console.error('Error al cargar instituciones:', err);
  }
}

// Cargar y mostrar inventario
async function cargarInventario() {
  const tbody = document.getElementById('tablaInventario');
  try {
    const res = await fetch('/api/donaciones');
    const data = await res.json();

    if (data.exito) {
      tbody.innerHTML = '';
      if (data.donaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay donaciones registradas aun.</td></tr>';
        return;
      }

      data.donaciones.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${d.tipo.toUpperCase()}</strong></td>
          <td>${d.descripcion} <br><small style="color:#64748b;">Donante: ${d.nombreDonante}</small></td>
          <td>${d.tipo === 'ropa' ? 'Talla: ' + d.talla : 'Didactico'}</td>
          <td><span style="color:#10b981; font-weight:600;">Aprobado</span></td>
          <td>Centro #${d.idInstitucionDestino}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error('Error al cargar inventario:', err);
  }
}

// Configuracion de eventos
function configurarEventos() {
  // Cambio de tipo de donacion (mostrar/ocultar talla)
  const tipoSelect = document.getElementById('tipoDonacion');
  tipoSelect.addEventListener('change', (e) => {
    const esRopa = e.target.value === 'ropa';
    document.getElementById('grupoTalla').style.display = esRopa ? 'flex' : 'none';
    document.getElementById('grupoEstado').style.display = esRopa ? 'flex' : 'none';
  });

  // Envio de donacion
  const formDonacion = document.getElementById('formDonacion');
  formDonacion.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      tipo: document.getElementById('tipoDonacion').value,
      categoria: document.getElementById('categoriaDonacion').value,
      talla: document.getElementById('tallaDonacion').value,
      estadoPrenda: document.getElementById('estadoPrenda').value,
      idInstitucionDestino: document.getElementById('institucionDestino').value,
      nombreDonante: document.getElementById('nombreDonanteOpcional').value,
      descripcion: document.getElementById('descripcionDonacion').value
    };

    const headers = { 'Content-Type': 'application/json' };
    if (tokenActual) {
      headers['Authorization'] = `Bearer ${tokenActual}`;
    }

    try {
      const res = await fetch('/api/donaciones', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.exito) {
        alert('Donacion registrada exitosamente en el sistema.');
        formDonacion.reset();
        cargarInventario();
      } else {
        alert('Error: ' + data.mensaje);
      }
    } catch (err) {
      alert('Ocurrio un fallo de conexion al registrar la donacion.');
    }
  });

  // Modal Auth
  const modal = document.getElementById('modalAuth');
  const btnAuth = document.getElementById('btnAuthModal');
  const closeBtn = document.getElementById('closeModal');
  const btnLogout = document.getElementById('btnLogout');

  btnAuth.addEventListener('click', () => modal.classList.add('active'));
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  document.getElementById('tabLogin').addEventListener('click', () => {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    document.getElementById('formLogin').style.display = 'flex';
    document.getElementById('formRegister').style.display = 'none';
  });

  document.getElementById('tabRegister').addEventListener('click', () => {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('formLogin').style.display = 'none';
    document.getElementById('formRegister').style.display = 'flex';
  });

  // Login
  document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value;
    const password = document.getElementById('loginPass').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const data = await res.json();

      if (data.exito) {
        tokenActual = data.token;
        usuarioActual = data.usuario;
        localStorage.setItem('token_donaciones', tokenActual);
        localStorage.setItem('usuario_donaciones', JSON.stringify(usuarioActual));
        modal.classList.remove('active');
        actualizarEstadoUsuario();
        alert(`Bienvenido ${usuarioActual.nombre} (${usuarioActual.rol})`);
      } else {
        alert(data.mensaje);
      }
    } catch (err) {
      alert('Error al intentar iniciar sesion');
    }
  });

  // Register
  document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      nombre: document.getElementById('regNombre').value,
      correo: document.getElementById('regCorreo').value,
      telefono: document.getElementById('regTelefono').value,
      password: document.getElementById('regPass').value,
      rol: 'usuario'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.exito) {
        tokenActual = data.token;
        usuarioActual = data.usuario;
        localStorage.setItem('token_donaciones', tokenActual);
        localStorage.setItem('usuario_donaciones', JSON.stringify(usuarioActual));
        modal.classList.remove('active');
        actualizarEstadoUsuario();
        alert('Cuenta creada y autenticada mediante JWT correctamente.');
      } else {
        alert(data.mensaje);
      }
    } catch (err) {
      alert('Error en el registro');
    }
  });

  btnLogout.addEventListener('click', () => {
    tokenActual = null;
    usuarioActual = null;
    localStorage.removeItem('token_donaciones');
    localStorage.removeItem('usuario_donaciones');
    actualizarEstadoUsuario();
    alert('Sesion cerrada.');
  });

  document.getElementById('btnRecargarInventario').addEventListener('click', cargarInventario);
}

function actualizarEstadoUsuario() {
  const statusEl = document.getElementById('userStatus');
  const btnAuth = document.getElementById('btnAuthModal');
  const btnLogout = document.getElementById('btnLogout');

  if (usuarioActual) {
    statusEl.textContent = `Sesion activa: ${usuarioActual.nombre} [${usuarioActual.rol.toUpperCase()}]`;
    statusEl.style.color = '#0284c7';
    statusEl.style.fontWeight = '600';
    btnAuth.style.display = 'none';
    btnLogout.style.display = 'inline-block';
  } else {
    statusEl.textContent = 'Modo Visitante';
    statusEl.style.color = '#64748b';
    statusEl.style.fontWeight = 'normal';
    btnAuth.style.display = 'inline-block';
    btnLogout.style.display = 'none';
  }
}
