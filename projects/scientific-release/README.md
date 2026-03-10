# Scientific Release Mini-Program

**科学放生小程序** - Promoting scientific and compliant animal release practices

---

## Project Structure

```
scientific-release/
├── frontend/                 # WeChat Mini-Program
│   ├── pages/
│   │   ├── index/           # Home page
│   │   ├── species/         # Species list
│   │   ├── species-detail/  # Species detail
│   │   ├── certificate/     # Certificate generator
│   │   ├── calendar/        # Buddhist calendar
│   │   └── profile/         # User profile
│   ├── components/
│   │   ├── species-card/
│   │   ├── certificate-preview/
│   │   └── common/
│   ├── utils/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── util.js
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── sitemap.json
│   └── project.config.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── config/
│   ├── migrations/
│   ├── tests/
│   ├── package.json
│   └── server.js
│
├── docs/
│   ├── api.md
│   ├── database.md
│   └── deployment.md
│
└── README.md
```

---

## Tech Stack

### Frontend
- WeChat Mini-Program (Native)
- WXML + WXSS + JavaScript

### Backend
- Runtime: Node.js 18+
- Framework: Express.js
- Database: MySQL 8.0
- ORM: Sequelize

### Infrastructure
- Server: Linux (Ubuntu 20.04+)
- Domain: [Your filed domain]
- SSL: Let's Encrypt

---

## Quick Start

### Frontend Development
```bash
# Open WeChat DevTools
# Import the frontend/ directory
# Use your WeChat Mini-Program AppID
```

### Backend Development
```bash
cd backend
npm install
cp config/config.example.js config/config.js
# Edit config/config.js with your database credentials
npm run dev
```

---

## Development Progress

| Phase | Dates | Status |
|-------|-------|--------|
| Phase 1: Setup | Mar 9-15 | 🔄 In Progress |
| Phase 2: Core Features | Mar 16-24 | ⬜ Todo |
| Phase 3: Testing & Launch | Mar 25-31 | ⬜ Todo |

---

## Contact

- Project Owner: Yang Jinlin
- Start Date: 2026-03-09
- Target Launch: 2026-03-31
