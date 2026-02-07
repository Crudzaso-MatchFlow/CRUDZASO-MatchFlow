# MatchFlow – Hiring Platform by Crudzaso

## 📋 Description

MatchFlow is a match-first hiring platform where candidates activate an **“Open to Work”** status and companies discover and match with them.
There are no traditional applications; instead, companies create matches directly with candidates through controlled business rules and subscription plans.

This project is an educational implementation focused on frontend logic, business rules, and REST-based data handling using `json-server`.

---

## 🎯 Key Features

### For Candidates

* Open to Work toggle to control visibility
* Profile management (personal and professional data)
* Match tracking with status progression
* Privacy control: contact information only visible after being contacted

### For Companies

* Candidate discovery (only open candidates)
* Match creation linked to job offers
* Candidate reservation system
* Match lifecycle management
* Job offer creation with plan-based limits

---

## 🏗️ Project Structure

```
CRUDZASO-MatchFlow/
├── index.html
├── README.md
├── package.json
├── css/
│   └── styles.css
├── db/
│   ├── db.json
│   ├── package.json
│   └── package-lock.json
├── images/
│   └── hero.svg
├── pages/
│   ├── login.html
│   ├── candidate.html
│   ├── company.html
│   ├── createOffer.html
│   ├── plans.html
│   └── subscription.html
└── scripts/
    ├── app.js
    ├── login.js
    ├── candidate.js
    ├── company.js
    ├── createOffer.js
    ├── matches.js
    ├── plans.js
    ├── subscription.js
    ├── showOferts.js
    └── utils.js
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm or npx

### Installation

Clone the repository:

```
git clone <repository-url>
cd CRUDZASO-MatchFlow
```

Start json-server:

```
cd db
npx json-server --watch db.json --port 3000
```

Open the application:

* Open `index.html` directly
* Or use Live Server in VS Code

---

## 📊 Database Structure

### Candidates

```json
{
  "id": 1,
  "username": "user",
  "password": "password",
  "rol": "candidate",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+57 300 123 4567",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "profession": "Frontend Developer",
  "experience": 3,
  "skills": ["JavaScript", "HTML", "CSS"],
  "languages": ["Spanish", "English"],
  "location": "Medellín",
  "openToWork": true,
  "reservedBy": null,
  "reservedForOffer": null
}
```

### Companies

```json
{
  "id": 1,
  "username": "company",
  "password": "password",
  "rol": "company",
  "name": "Tech Corp",
  "email": "contact@techcorp.com",
  "industry": "Technology",
  "location": "Bogotá"
}
```

### Job Offers

```json
{
  "id": 1,
  "companyId": 1,
  "title": "Frontend Developer",
  "description": "We are looking for...",
  "location": "Medellín",
  "mode": "Hybrid",
  "salary": "$3.500.000",
  "isActive": true
}
```

### Matches

```json
{
  "id": 1,
  "companyId": 1,
  "candidateId": 2,
  "jobOfferId": 1,
  "status": "pending"
}
```

---

## 📝 Business Rules

* Only candidates with `openToWork: true` appear in discovery
* Candidates cannot see other candidates
* One match = one company + one candidate + one job offer
* Reserved candidates are blocked from other companies
* Contact information is only visible after status `contacted`
* Match status flow:

```
pending → contacted → interview → hired / discarded
```

---

## 🔐 Authentication

### Default Test Accounts

Candidate
Email: `candidate@test.com`
Password: `123456`

Company
Email: `company@test.com`
Password: `123456`

Authentication is handled via json-server and session persistence through `localStorage`.

---

## 🔄 API Endpoints

Base URL: `http://localhost:3000`

* `/candidates`
* `/companies`
* `/jobOffers`
* `/matches`
* `/plans`
* `/subscriptions`

Supports GET, POST, PATCH, PUT.

---

## 📌 Change Log – Project Extensions & Fixes

### Change 1–10: Plans & Subscriptions (Phase 1)

* Added `plans` and `subscriptions` collections
* Plan-based restrictions for:

  * Candidate reservations
  * Job offer creation
* Subscription expiration validation
* UI improvements for plans and subscriptions
* SweetAlert2 integration
* Session normalization and date fixes

---

### Change 11–17: Dashboard & Matching Fixes

* Added profile button to dashboard cards
* Extended candidate model (skills, languages, experience)
* Role-based dashboard visibility
* Match creation auto-reserves candidate
* Fixed repeated reload and object recreation
* Deprecated and removed `dashboard_user.html`

---

### Change 18–25: Authentication, Session & Routing (Ulith Giraldo)

* Unified and simplified login + register logic
* Correct json-server integration
* Proper session persistence using localStorage
* Role-aware login (candidate & company)
* Centralized `getCurrentUser()` utility
* Modular JS across all pages
* Manual route protection
* Match creation with job offer selection
* Navbar normalization across all pages
* Inline documentation for all major refactors

---

## 🐛 Troubleshooting

**json-server not starting**

```
npm install -g json-server
json-server --watch db.json --port 3000
```

**Login issues**

* Ensure json-server is running
* Check db.json test accounts
* Verify session data in localStorage

---

## 📄 License

Educational project developed under the Crudzaso learning initiative.

---

## 👥 Team

Developed by the Crudzaso team as part of a web development bootcamp.

**Note:** This project is not production-ready. Authentication, authorization, and backend logic should be implemented server-side for real-world use.