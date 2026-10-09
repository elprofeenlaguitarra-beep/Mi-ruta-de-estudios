MI RUTA DE ESTUDIOS — ARCHIVOS WEB/PWA
=====================================

Incluye:
- index.html: aplicación.
- styles.css: diseño adaptable a celular y computador.
- app.js: interacción, corrección inmediata, progreso y exportación CSV.
- questions.js: banco de 125 preguntas (25 por asignatura).
- manifest.webmanifest, sw.js e icon.svg: soporte de instalación como PWA y caché para uso sin conexión tras la primera carga.

USO LOCAL
1. Descomprime el archivo ZIP.
2. Abre index.html en un navegador moderno para probar las funciones básicas.
3. Para probar instalación PWA y modo sin conexión, sirve la carpeta por HTTPS o localhost; abrir como archivo local no activa el service worker.

PUBLICACIÓN GRATUITA (OPCIÓN SENCILLA: GITHUB PAGES)
1. Crea una cuenta gratuita en GitHub.
2. Crea un repositorio público, por ejemplo mi-ruta-de-estudios.
3. Sube TODOS los archivos de esta carpeta a la raíz del repositorio.
4. En el repositorio, abre Settings > Pages.
5. En Build and deployment, selecciona Deploy from a branch, elige la rama main y la carpeta /(root), y guarda.
6. Espera a que GitHub Pages entregue la URL HTTPS. Prueba la URL desde el teléfono.

OTRAS OPCIONES
- Netlify o Cloudflare Pages permiten publicar sitios estáticos; sube la carpeta descomprimida o conecta el repositorio.
- Para que la instalación PWA funcione, el sitio debe estar servido por HTTPS (localhost también sirve para pruebas).

INSTALAR EN CELULAR
- Android/Chrome: abre la URL HTTPS y selecciona «Instalar aplicación» si aparece, o menú > Instalar aplicación/Añadir a pantalla de inicio.
- iPhone/Safari: abre la URL HTTPS, toca Compartir y selecciona «Añadir a pantalla de inicio».
- No se genera un APK nativo en este paquete; es una aplicación web instalable (PWA).

PRIVACIDAD Y LIMITACIONES
- No necesita cuenta y no transmite respuestas a un servidor.
- El progreso se guarda en localStorage del navegador/dispositivo; borrar datos del navegador puede eliminarlo y no se sincroniza entre dispositivos.
- El panel docente resume solo los datos locales del mismo dispositivo; no permite supervisión remota de una clase.
- Recurso independiente de práctica, no oficial ni afiliado al MINEDUC. Las preguntas son originales de práctica, no preguntas oficiales. Contrasta siempre la preparación con el temario vigente y las instrucciones de la entidad examinadora.
- El ensayo usa 25 preguntas por asignatura y no aplica un cronómetro estricto de 90 minutos; puedes usar un reloj externo para simular condiciones de evaluación.
