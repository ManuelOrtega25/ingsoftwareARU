# Sistema Web de Donaciones para Casas Hogar y DIF en Chihuahua

**Autor:** Manuel Ortega  
**Materia:** Ingenieria de Software  
**Institucion:** Universidad Tecmilenio  
**Fecha:** Septiembre 2026  

---

## Descripcion General del Proyecto
Este proyecto consiste en un sistema web disenado para optimizar la gestion, recepcion y distribucion de recursos donados (especialmente ropa y juguetes infantiles) para centros del DIF y casas hogar en la ciudad de Chihuahua.

El sistema integra un mapa interactivo geolocalizado con un semaforo de prioridades (Verde = Recursos suficientes, Amarillo = Necesidad moderada, Rojo = Prioridad alta/urgente), permitiendo a la organizacion identificar con rapidez que centros necesitan apoyo inmediato y canalizar las donaciones de manera eficiente.

---

## Caracteristicas Principales
1. **Autenticacion Segura con JWT:** Control de sesiones mediante JSON Web Tokens con encriptacion de contrasenas con bcrypt.
2. **Control de Acceso Basado en Roles:**
   - **Administrador:** Gestion de inventario, cambio de estado del semaforo en el mapa y validacion de control de calidad.
   - **Usuario / Donante:** Registro voluntario de donaciones, consulta de historial y visualizacion publica del mapa.
3. **Control de Calidad en Donaciones:** Formulario especializado que registra tipo, talla, categoria y estado de prenda antes de autorizar la distribucion.
4. **Geolocalizacion y Semaforo:** Mapa interactivo con marcadores visuales para cada centro y enlace directo a WhatsApp para comunicacion inmediata con las instituciones.
5. **Seguridad Integrada:** Proteccion contra XSS y Clickjacking mediante sanitizacion y cabeceras HTTP con Helmet.

---

## Estructura del Repositorio
```
proyectoARI/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Pipeline de CI/CD para GitHub Actions
├── public/                       # Frontend web con mapa interactivo y formularios
│   ├── css/style.css
│   ├── js/app.js
│   └── index.html
├── src/                          # Codigo fuente del backend
│   ├── controllers/              # Controladores de autenticacion, donaciones e instituciones
│   ├── middleware/               # Middleware de JWT y verificacion de roles
│   ├── models/                   # Modelo y persistencia de datos
│   └── routes/                   # Definicion de endpoints de la API REST
├── tests/                        # Pruebas unitarias con Jest
│   ├── auth.test.js
│   ├── donaciones.test.js
│   └── roles.test.js
├── coverage/                     # Reporte generado de cobertura de pruebas unitarias
├── reportes/                     # Reportes tecnicos del proyecto
│   ├── reporte_pruebas_unitarias.html
│   ├── reporte_seguridad_owasp_zap.html
│   └── reporte_sonarqube.html
├── documentos/                   # Entregable escrito (Word con analisis y cierre)
│   └── Proyecto Final Ing Software - Completado.docx
├── server.js                     # Punto de entrada del servidor Express
├── package.json                  # Dependencias y scripts de ejecucion
└── README.md                     # Documentacion del proyecto
```

---

## Instrucciones para Ejecutar el Proyecto Localmente

### 1. Requisitos Previos
- Node.js (version 18 o superior)
- npm (version 9 o superior)

### 2. Instalacion de Dependencias
```bash
npm install
```

### 3. Ejecucion de Pruebas Unitarias y Cobertura (Jest)
```bash
npm test
```
El reporte detallado de cobertura se genera automaticamente en la carpeta `coverage/` y en `reportes/reporte_pruebas_unitarias.html`.

### 4. Iniciar el Servidor Web
```bash
npm start
```
Abrir el navegador web en: `http://localhost:3000`

---

## Resumen de Entregables Incluidos
- **Codigo del sistema y pipeline CI/CD:** Implementado con Node.js, Express y GitHub Actions en `.github/workflows/ci-cd.yml`.
- **Reportes tecnicos:**
  - Pruebas unitarias con cobertura >= 80% (Jest).
  - Escaneo de seguridad de vulnerabilidades (OWASP ZAP).
  - Analisis de calidad de codigo, deuda tecnica y code smells (SonarQube).
- **Documento Word de cierre:** Ubicado en la carpeta `documentos/` con la comparativa de planificacion vs ejecucion, lecciones aprendidas y plan de mejora continua.
