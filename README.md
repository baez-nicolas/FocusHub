# 🎯 FocusHub

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

<img src="/img/focushubapp.png" width="600" alt="Banner" />

**FocusHub** es una aplicación web de productividad personal, minimalista y totalmente responsive. Reúne herramientas para organizar tu día, registrar hábitos, leer noticias, entrenar con Spotify y más — todo desde el navegador, sin backend ni cuentas obligatorias.

🌐 **[Ver Demo en Vivo](https://focus-hub-gamma.vercel.app/)**

---

## 🎥 Video Demostrativo

<div>

<a href="https://www.youtube.com/watch?v=aQx8hbWnbgE">
  <img src="https://img.youtube.com/vi/aQx8hbWnbgE/maxresdefault.jpg" alt="Video Preview" width="450">
</a>

[![Ver video en YouTube](https://img.shields.io/badge/YouTube-Ver_Video-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=aQx8hbWnbgE)

---

## ✨ Características

### 🏠 Dashboard

- Noticias destacadas en grilla compacta
- Playlists de Spotify embebidas por categoría (Focus, Chill, Energy…)
- Widget de pasos diarios con historial y medallas

### 📰 Noticias

- Feed de artículos con búsqueda y filtros por sección
- Paginación con navegación rápida
- Diseño de tarjetas con imagen, titular y fecha

### 📅 Planner

- Time blocking con bloques de tiempo personalizados
- Categorías: Focus, Break, Gym, Personal
- Vista de agenda ordenada por horario

### 📝 Notas

- Editor rápido de notas con título y contenido
- Fecha de creación/edición simplificada
- Almacenamiento local sin cuenta

### ❤️‍🩹 Health

- Registro de pasos diarios con objetivo configurable
- Tipos de actividad: caminata, bici, carrera
- Historial semanal con gráfico visual
- Sistema de medallas desbloqueables

### 🧮 Calculadora

- Calculadora científica funcional
- Historial de operaciones
- Panel de historial ordenado debajo en mobile

### 🎵 Spotify

- Playlists embebidas sin necesidad de cuenta
- Búsqueda de canciones y artistas conectando tu cuenta Spotify (OAuth)
- Vista detallada de tracks y artistas
- Gestión de playlists propias (crear "FocusHub Session")

---

## 🌍 Internacionalización

La app soporta **Español e Inglés** de forma nativa. El selector de idioma está disponible en el navbar en todo momento. Todos los textos, fechas y mensajes se adaptan automáticamente.

---

## 🚀 Tecnologías

| Tecnología          | Versión   |
| ------------------- | --------- |
| **Angular**         | 20.3.0   |
| **TypeScript**      | 5.9.2    |
| **Bootstrap Icons** | 1.13.1    |
| **SweetAlert2**     | —         |
| **Spotify Web API** | OAuth 2.0 |
| **The Guardian API**        | REST      |

---

## 🛠️ Instalación local

```bash
# 1. Clonar
git clone https://github.com/baez-nicolas/FocusHub.git
cd FocusHub

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm start
# → http://localhost:4200
```

### Variables de entorno (opcional)

Para activar Spotify, News y Weather, configurá tus API keys en `environment.ts`:

```ts
export const environment = {
  spotifyClientId: 'TU_CLIENT_ID',
  newsApiKey: 'TU_NEWS_KEY',
};
```
---

## 🙏 Créditos

- **API de música:** [Spotify Web API](https://developer.spotify.com/documentation/web-api) — búsqueda, artistas, playlists y autenticación OAuth 2.0
- **API de noticias:** [The Guardian API](https://open-platform.theguardian.com) — feed de artículos por sección y búsqueda

<img src="/img/apis.png" width="600" alt="Banner" />

---

## 👨‍💻 Autor

**Nicolás Baez**

- GitHub: [@baez-nicolas](https://github.com/baez-nicolas)
- LinkedIn: [linkedin.com/in/baez-nicolas](https://www.linkedin.com/in/baez-nicolas/)
- Proyecto: [FocusHub](https://github.com/baez-nicolas/FocusHub)
- Demo: [focus-hub-gamma.vercel.app](https://focus-hub-gamma.vercel.app/)

---

<div align="center">

**[Volver arriba](#-focushub)**

</div>
