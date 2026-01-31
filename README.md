# CRUDZASO-HabitFlow

MatchFlow Job & Candidate Matching Platform

## Requisitos

- **Node.js** v18+ (actual: v25.2.1) ✓
- **npm** v10+ (actual: 11.6.2) ✓
- **json-server** v1.0.0+ (actual: 1.0.0-beta.5) ✓

## Instalación

```bash
npm install
```

## Iniciar el Servidor

```bash
npm start
```

El servidor json-server iniciará en **http://localhost:3000**

### Endpoints disponibles:
- `http://localhost:3000/candidates` - Lista de candidatos
- `http://localhost:3000/companies` - Empresas
- `http://localhost:3000/jobOffers` - Ofertas de trabajo
- `http://localhost:3000/matches` - Matches entre candidatos y ofertas

## Estructura del Proyecto

```
CRUDZASO-HabitFlow/
├── /scripts/           → JavaScript modules
│   ├── app.js
│   ├── login.js        → User authentication & db.json integration
│   ├── showOferts.js   → Offer rendering
│   ├── createOffer.js  → Offer creation handler
│   └── findFilter.js   → Candidate filtering
├── /css/               → Stylesheets
│   ├── styles.css
│   └── login.css
├── /db/                → Data files
│   └── db.json         → JSON Server database
├── index.html          → Landing page
├── login.html          → Authentication page
├── dashboard_user.html → User dashboard
└── package.json        → Dependencies & scripts
```

## Features

- ✅ User Authentication (Sign Up/Login)
- ✅ Candidate Profile Management
- ✅ Job Offer Management
- ✅ Candidate-Job Matching
- ✅ Real-time Database Updates (json-server)
- ✅ localStorage Backup for User Data

## Desarrollo

El proyecto usa:
- **HTML5** - Structure
- **CSS3** - Styling (Bootstrap 5.3.0)
- **JavaScript (ES6+)** - Logic & DOM manipulation
- **json-server** - Mock REST API & persistent storage

## API Endpoints

### Candidates
- `GET /candidates` - Get all candidates
- `GET /candidates/:id` - Get specific candidate
- `POST /candidates` - Create new candidate
- `PUT /candidates/:id` - Update candidate
- `DELETE /candidates/:id` - Delete candidate

### Companies
- `GET /companies` - Get all companies
- `GET /companies/:id` - Get specific company

### Job Offers
- `GET /jobOffers` - Get all job offers
- `POST /jobOffers` - Create new offer

### Matches
- `GET /matches` - Get all matches

## Notas de Seguridad

- Las contraseñas se guardan en texto plano en db.json (SOLO para desarrollo)
- Para producción, implementar autenticación con JWT y backend seguro
- localStorage se usa como backup temporal

## Contribuidores

CRUDZASO Team

## Licencia

MIT
