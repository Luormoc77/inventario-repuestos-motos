# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
>
> # 🏁 Sistema de Inventario y Cotización de Repuestos para Motos

> **Proyecto universitario didáctico** desarrollado con SvelteKit y PocketBase para gestionar un inventario de +2.000 repuestos de motocicletas, con búsqueda avanzada y cotización automática.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white)
![PocketBase](https://img.shields.io/badge/PocketBase-4A3AFF?logo=sqlite&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)

---

## 📌 Descripción

Aplicación web para **consultar, filtrar y cotizar repuestos de motos** de forma intuitiva. Ideal para talleres, mecánicos o tiendas de repuestos que necesitan una herramienta ágil para presupuestar reparaciones.

### ✨ Funcionalidades principales
- 🔍 **Búsqueda avanzada** por nombre, marca, modelo, categoría, precio y disponibilidad.
- 💰 **Cotización automática**: selecciona repuestos y obtén el total en tiempo real.
- 📊 **Estadísticas del inventario**: total de repuestos, disponibles, categorías y marcas.
- 🗃️ **Base de datos con 2.000+ registros realistas** (generados automáticamente).

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| **Frontend** | [SvelteKit](https://kit.svelte.dev/) | Framework moderno para interfaces reactivas y rápidas |
| **Backend + BD** | [PocketBase](https://pocketbase.io/) | Base de datos SQLite + API REST + panel de administración |
| **Entorno** | Visual Studio Code | Editor de código |
| **Control de versiones** | Git + GitHub | Gestión del código fuente |

---

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Binario de [PocketBase](https://pocketbase.io/) (incluido en el repo)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Luormoc77/inventario-repuestos-motos.git
   cd inventario-repuestos-motos
inventario-repuestos-motos/
├── scripts/                  # Scripts de gestión de datos
│   ├── generate-repuestos.js # Genera 2000+ repuestos
│   └── clear-repuestos.js    # Limpia la base de datos
├── src/
│   ├── routes/               # Páginas de la app
│   │   ├── +page.js          # Configuración y carga de datos
│   │   ├── +page.svelte      # Inventario principal
│   │   └── cotizacion/       # Página de cotización
│   ├── lib/
│   │   └── stores/cart.js    # Carrito de cotización
│   └── components/           # Componentes reutilizables
├── pocketbase/               # Binario de PocketBase (Linux/Windows)
├── docs/                     # Capturas de pantalla
├── static/                   # Assets estáticos
├── .gitignore
├── package.json
└── README.md
