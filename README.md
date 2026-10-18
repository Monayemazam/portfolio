# Monayem Azam Space Portfolio (`space-portfolio`)

A modern, database-driven space-themed portfolio web application for **Monayem Azam**, built on Laravel, React, Inertia.js, TypeScript in strict mode, Tailwind CSS, Three.js, GSAP, and MySQL.

---

## Technology Stack

- **Backend**: Laravel (latest stable), PHP 8.3+
- **Frontend**: React 19, TypeScript (strict mode), Inertia.js, Vite 8
- **Styling**: Tailwind CSS v4 with CSS design tokens
- **3D & Animation**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), GSAP, Framer Motion, Lenis smooth scroll
- **Icons**: Lineicons (outline style)
- **Database**: MySQL 8 / MariaDB with InnoDB, foreign keys, and cascading rules
- **Testing & Quality**: Pest / PHPUnit, PHPStan (Level 7+), Laravel Pint, Vite-plus (`vp check`), TypeScript compiler (`tsc --noEmit`)

---

## Specification Documents

All primary project specifications and guidelines are preserved in `docs/`:

- [`docs/implementation-plan.md`](docs/implementation-plan.md) — 14-prompt sequential implementation plan
- [`docs/PRD Monayem Azam Space Portfolio.md`](docs/PRD%20Monayem%20Azam%20Space%20Portfolio.md) — Product Requirements Document (features and behaviour)
- [`docs/Design Guideline Monayem Azam Space Portfolio.md`](docs/Design%20Guideline%20Monayem%20Azam%20Space%20Portfolio.md) — Visual design tokens, typography, planet styles, and motion
- [`docs/database-schema.md`](docs/database-schema.md) — Complete database schema, tables, columns, constraints, and seed data
- [`AGENTS.md`](AGENTS.md) — Mandatory agent execution rules

---

## Setup & Installation

### 1. Prerequisites

- PHP 8.3 or higher with `pdo_mysql`, `mbstring`, `openssl`, `zip`, `gd`
- Composer 2.x
- Node.js 20.x or higher and npm 10+
- MySQL 8.0+ or MariaDB 10.4+

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url> space-portfolio
cd space-portfolio

# Install backend dependencies
composer install

# Install frontend dependencies
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Generate the application encryption key:

```bash
php artisan key:generate
```

Configure `.env` with your database credentials and admin details:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=space_portfolio
DB_USERNAME=root
DB_PASSWORD=

ADMIN_NAME="Monayem Azam"
ADMIN_EMAIL="monayem@example.com"
ADMIN_PASSWORD="password"
```

### 4. Database Setup & Migration

Create the MySQL database if not already created:

```sql
CREATE DATABASE IF NOT EXISTS space_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS space_portfolio_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run database migrations:

```bash
php artisan migrate
```

To run migrations and seeders (when seeders are implemented in Phase 2):

```bash
php artisan migrate:fresh --seed
```

---

## Local Development

Start the development server (Laravel server, queue listener, and Vite dev server concurrently):

```bash
composer run dev
```

Or start processes individually:

```bash
# Terminal 1: Laravel backend server
php artisan serve

# Terminal 2: Vite frontend server
npm run dev

# Terminal 3: Queue worker (for mail and background jobs)
php artisan queue:listen
```

Visit the application at [http://localhost:8000](http://localhost:8000).

---

## Quality & Verification Commands

Run linting, type checks, tests, and production build:

```bash
# PHP code styling (Laravel Pint)
composer lint:check      # Check styling
composer lint            # Auto-fix styling

# PHP static analysis (PHPStan level 7)
composer types:check

# Frontend linting & formatting (Vite-plus)
npm run lint             # Check formatting and lint
npm run lint:fix         # Auto-fix formatting and lint

# TypeScript strict type check
npm run types:check

# Run automated tests (Pest / PHPUnit)
php artisan test

# Build production frontend bundle
npm run build
```

---

## Git Workflow

Commits follow the single-prompt convention:
`prompt-NN: short title`
Each phase is committed only after its Definition of Done is fully verified with real evidence.
