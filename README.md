# 🚀 Eduardo Juárez — Frontend Engineer Portfolio

<p align="center">
  <a href="https://edujuarez.dev">🌐 Live Portfolio</a> •
  <a href="https://github.com/edjuarez">💻 GitHub</a> •
  <a href="https://www.linkedin.com/in/eduardo-juarez-dev/">💼 LinkedIn</a>
</p>

A personal portfolio showcasing my work, technical projects, and interactive experiments.

Built with **React, JavaScript, and CSS**, combining reusable components, custom animations, responsive layouts, and interactive browser experiences.

---

## ✨ Features

- 💻 **Project Showcase:** Web applications, client projects, technical demonstrations, and academic projects.
- 🎮 **Game Collection:** Browser-based games playable directly from the portfolio.
- 🚀 **Custom Cursor:** Interactive spaceship with shooting mechanics and particle effects.
- 👾 **Alien Hunt:** Hidden mini-game where visitors can find and destroy aliens throughout the website.
- 📱 **Responsive Design:** Adapted to different screen sizes and devices.
- 🎨 **Custom Animations:** Interactive visual effects and transitions.

---

## 👾 Alien Hunt — Hidden Mini-Game

An interactive Easter egg integrated into the portfolio. Aliens are randomly scattered across the website, and visitors can use the spaceship cursor to find and destroy them.

### 🕹️ How to Play

| Action | Effect |
|---|---|
| 🖱️ Click | Shoot a normal projectile |
| 🔋 Hold click | Charge a powerful shot |
| 💥 Release click | Fire the charged shot |
| 👾 Hit an alien | Reduce its health |
| ☠️ Destroy an alien | Increase the kill counter |

### ❤️ Alien Health

- Each alien starts with **3 HP**.
- Normal shots reduce its health by 1.
- A charged shot can destroy an alien instantly.
- Aliens display visual feedback when hit and play a destruction animation when eliminated.

### 🎯 Alien Counter

The counter tracks eliminated aliens against the actual number successfully spawned.

**Example: `4 / 10`**

This means 4 aliens have been destroyed out of 10 spawned aliens.

The counter only increases when an alien is eliminated, not when it is simply hit.

The game is completed when all spawned aliens have been destroyed.

### ⚙️ Under the Hood

Alien Hunt combines several browser technologies:

- **React Hooks:** Manage alien states, health, and game progress.
- **HTML Canvas:** Renders the spaceship, projectiles, and particle effects.
- **React Portals:** Display the game overlay independently of the main component hierarchy.
- **DOM Collision Detection:** Uses element boundaries to detect projectile impacts.
- **Custom Events:** Connect the cursor shooting system with the alien management component.
- **CSS Animations:** Handle alien movement, damage feedback, and destruction effects.

The game also considers reduced-motion preferences and uses pointer capability detection to adapt the cursor experience.

---

## 🗂️ Portfolio Projects

Projects are organized into two main categories.

### 💻 Web Projects

A collection of client applications, technical demonstrations, and personal projects.

| Project | Description | Type |
|---|---|---|
| Tuchi Digital | Independent web development business website | Personal Business |
| Noventitre | Custom e-commerce platform | Client Project |
| Sophie Art Tattoo | Artist portfolio website | Client Project |
| Event Hub | Event management dashboard with large datasets | Technical Demonstration |
| Podcast App | Podcast discovery and playback application | Technical Demonstration |
| Mobile Store | Mobile phone catalog with product details and shopping cart | Technical Demonstration |

### 🎮 Game Projects

Browser-based games and academic game development projects.

| Project | Description | Technologies |
|---|---|---|
| Master Elba | Arcade survival game | Construct, HTML5 |
| Synesthesia | 2D action platformer | Construct, HTML5 |
| Penality | Football-inspired arcade game | Construct, HTML5 |
| Rupert | Environmental awareness game | ActionScript, Adobe Flash |

---

## 🛠️ Technologies

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=fff" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=fff" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff" />
</p>

### Browser APIs & Interactive Development

- Canvas API
- React Hooks and Portals
- DOM APIs
- Custom Browser Events
- Pointer Events
- `requestAnimationFrame`
- Collision Detection
- CSS Animations and Transitions

### Tools & Workflow

- Git & GitHub
- VS Code
- ESLint
- Vite

---

## 🏗️ Architecture

The application follows a component-based architecture, separating reusable UI components, interactive features, and project data.

```text
src/
├── components/
│   ├── MyWork/
│   ├── ProjectCard/
│   ├── SpaceCursor/
│   └── AlienHunt/
│
├── data/
│   └── projects.js
│
├── assets/
│
├── App.jsx
├── main.jsx
└── index.css

public/
├── projects/
├── games/
└── assets/
```

*Simplified project structure.*

### ♻️ Reusable Components

Project information is centralized in `projects.js` and rendered dynamically through reusable `ProjectCard` components.

This makes it easy to add, update, and organize projects without changing the main rendering logic.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/edjuarez/portfolio.git

# Navigate to the project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

### 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (if configured) |

---

## 🌐 Live Demo

Explore the portfolio and discover the projects and hidden interactions:

<p align="center">
  <a href="https://edujuarez.dev">
    <img src="https://img.shields.io/badge/Visit%20Portfolio-55D6FF?style=for-the-badge&logo=googlechrome&logoColor=102A43" />
  </a>
</p>

---

## 👨‍💻 About Me

I'm Eduardo Juárez, a Software developer focused on Frontend and Full Stack Development.

I enjoy building web applications, reusable components, interactive interfaces, and exploring creative ways to use browser technologies.

This portfolio brings together professional work, technical demonstrations, academic projects, and personal experiments.

**Thanks for visiting! 🚀**
