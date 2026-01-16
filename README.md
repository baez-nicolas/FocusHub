# 🎯 FocusHub

![Portada](./img/logo1.png)

![FocusHub Banner](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**FocusHub** es una aplicación web minimalista y profesional para potenciar tu productividad diaria.  Combina técnicas de gestión del tiempo, planificación y seguimiento de hábitos en una sola plataforma, 100% en el navegador, sin necesidad de backend. 

🌐 **[Ver Demo en Vivo](https://focus-hub-gamma.vercel.app/)**

---

## ✨ Características

### 🍅 Pomodoro
- Timer configurable con ciclos automáticos
- Descansos cortos y largos personalizables
- Modo foco, pausa y control total del flujo

### 📅 Planner Diario
- Time blocking para organizar tu día
- Categorías:   Focus, Break, Gym, Personal
- Estados:  Planificado, Completado, Omitido
- Vista de agenda ordenada por horario

### 💪 Gym
- Crea rutinas personalizadas
- Timer de descanso entre sets
- Seguimiento de ejercicios y series
- Historial de sesiones

### 📝 Notas Rápidas
- Scratchpad minimalista
- Almacenamiento local

### 🧮 Calculadora
- Calculadora funcional integrada
- Operaciones básicas:  suma, resta, multiplicación, división
- Diseño limpio y responsive
- Acceso rápido sin salir de la app

---

## 🚀 Tecnologías

| Tecnología | Versión |
|------------|---------|
| **Angular** | 20.3.0 |
| **Angular CLI** | 20.3.2 |
| **TypeScript** | 5.9.2 |
| **Bootstrap** | 5.3.8 |
| **Bootstrap Icons** | 1.13.1 |
| **Node.js** | 22.19.0 |
| **npm** | 10.9.3 |

### Stack Técnico
- **Framework:** Angular 20+ (Standalone Components)
- **UI:** Bootstrap 5 + Bootstrap Icons
- **Lenguaje:** TypeScript 5.9
- **Estado:** Signals API (Angular)
- **Persistencia:** LocalStorage (sin backend)
- **Deploy:** Vercel
- **Estilos:** CSS3 + Bootstrap utilities

---

## 🛠️ Instalación Local

### Requisitos Previos
- Node.js 18+ (recomendado 22.x)
- npm 10+

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/baez-nicolas/FocusHub.git
cd FocusHub
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm start
# o
ng serve
```

4. **Abrir en el navegador**
```
http://localhost:4200
```

5. **Build de producción**
```bash
npm run build
```

Los archivos compilados estarán en `dist/FocusHub/browser/`

---

## 🎨 Características Técnicas

### Arquitectura
- **Standalone Components:** Sin módulos NgModule
- **Signals:** Estado reactivo moderno de Angular
- **Services con Injectable:** Inyección de dependencias
- **LocalStorage:** Persistencia client-side con wrapper de servicio
- **Routing:** Navegación SPA con lazy loading

### Responsive Design
- **Desktop:** Sidebar fijo lateral
- **Tablet:** Sidebar adaptativo
- **Mobile:** Navbar colapsable con hamburger menu

---

## 📱 Capturas de Pantalla

### Dashboard
Vista principal con timer de Pomodoro, próximo bloque y estadísticas del día.

### Pomodoro
Configuración personalizable y control total del timer con ciclos automáticos.

### Planner
Time blocking con categorías, estados y gestión completa de bloques diarios.

### Calculadora
Calculadora funcional con operaciones básicas y diseño limpio.

---

## 👨‍💻 Autor

**Nicolás Baez**

- GitHub: [@baez-nicolas](https://github.com/baez-nicolas)
- Proyecto: [FocusHub](https://github.com/baez-nicolas/FocusHub)

---

<div align="center">

**[⬆ Volver arriba](#-focushub)**

Hecho con ❤️ y ☕ para aumentar la productividad

</div>
