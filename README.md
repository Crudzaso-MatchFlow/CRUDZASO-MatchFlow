# MatchFlow - Hiring Platform by Crudzaso

## 📋 Description

MatchFlow is a match-first hiring platform where candidates activate "Open to Work" status and companies discover and match with them. No traditional applications - just smart matching.

## 🎯 Key Features

### For Candidates
- **Open to Work Toggle**: Control your visibility to companies
- **Profile Management**: Update your professional information
- **Match Tracking**: See all your matches and their status
- **Privacy Control**: Contact info only visible after "contacted" status

### For Companies
- **Candidate Discovery**: Browse candidates who are open to work
- **Match Creation**: Create matches with candidates for specific job offers
- **Reservation System**: Reserve candidates while evaluating
- **Match Management**: Track match status (pending → contacted → interview → hired/discarded)
- **Job Offers**: Create and manage job postings

## 🏗️ Project Structure

```
CRUDZASO-HabitFlow/
├── index.html                    # Landing page
├── README.md                     # This file
├── package.json
├── css/
│   └── styles.css               # Unified styles (Bootstrap + custom)
├── db/
│   ├── db.json                  # json-server database
│   ├── package.json
│   └── package-lock.json
├── images/
│   └── hero.svg                 # Hero image
├── pages/
│   ├── login.html               # Login/Signup page
│   ├── dashboard_user.html      # Unified dashboard (Discovery, Matches, Reserved)
│   ├── candidate.html           # Candidate profile management
│   ├── company.html             # Company profile management
│   └── createOffer.html         # Create job offer form
└── scripts/
    ├── login.js                 # Authentication logic
    ├── candidate.js             # Candidate profile functionality
    ├── company.js               # Company profile functionality
    ├── createOffer.js           # Job offer creation
    ├── findFilter.js            # Search and filter functionality
    ├── showOferts.js            # Display offers and matches
    ├── app.js                   # Main app logic
    └── utils.js                 # Shared utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- npm or npx

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CRUDZASO-HabitFlow
   ```

2. **Start json-server**
   ```bash
   cd db
   npx json-server --watch db.json --port 3000
   ```

3. **Open the application**
   - Open `index.html` in your browser
   - Or use Live Server extension in VS Code

## 📊 Database Structure

The `db/db.json` file contains:

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
  "profession": "Desarrollador Frontend",
  "experience": 3,
  "location": "Medellín",
  "openToWork": true,
  "bio": "Passionate developer...",
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
  "phone": "+57 300 987 6543",
  "avatar": "https://i.pravatar.cc/150?img=10",
  "industry": "Technology",
  "size": "50-200",
  "location": "Bogotá",
  "website": "www.techcorp.com",
  "description": "Leading tech company..."
}
```

### Job Offers
```json
{
  "id": 1,
  "companyId": 1,
  "title": "Frontend Developer",
  "description": "We are looking for...",
  "profession": "Desarrollador Frontend",
  "typeContract": "Indefinido",
  "location": "Medellín",
  "mode": "Híbrido",
  "salary": "$3.500.000",
  "deadline": "2024-12-31",
  "createdAt": "2024-01-15T10:00:00Z",
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
  "status": "pending",
  "createdAt": "2024-01-20T14:30:00Z"
}
```

**Match Status Flow:**
- `pending` → Initial state
- `contacted` → Company contacted candidate (contact info now visible)
- `interview` → Interview scheduled
- `hired` → Candidate hired
- `discarded` → Match rejected

## 🎨 Design System

### Colors
- **Primary**: `#137fec` (Blue)
- **Secondary**: `#0fbcf9` (Light Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
- Bootstrap 5.3.0 for base components
- Custom CSS for MatchFlow-specific styling
- Material Symbols icons

## 🔐 Authentication

### Default Test Accounts

**Candidate:**
- Email: `candidate@test.com`
- Password: `123456`

**Company:**
- Email: `company@test.com`
- Password: `123456`

## 📱 Pages Overview

### 1. Landing Page (`index.html`)
- Hero section with CTA
- Features showcase
- Statistics
- Call to action

### 2. Login/Signup (`pages/login.html`)
- Tabbed interface for login and signup
- Role selection (Candidate/Company)
- Form validation

### 3. Dashboard (`pages/dashboard_user.html`)
- **Discovery View**: Browse candidates/offers
- **Matches View**: See all matches
- **Reserved View**: (Companies only) Reserved candidates
- Sidebar navigation
- Real-time filtering

### 4. Candidate Profile (`pages/candidate.html`)
- Profile information display
- Open to Work toggle
- Edit profile modal
- Experience and skills sections

### 5. Company Profile (`pages/company.html`)
- Company information
- Statistics (active offers, matches, reserved)
- Edit profile modal

### 6. Create Offer (`pages/createOffer.html`)
- Job offer creation form
- All required fields
- Validation

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Material Symbols
- **Backend**: json-server (REST API)
- **Storage**: localStorage for session management

## 📝 Business Rules

1. **Open to Work Visibility**
   - Only candidates with `openToWork: true` appear in Discovery
   - Candidates can toggle this status anytime

2. **Match Creation**
   - Companies can create matches with open candidates
   - One match = one company + one candidate + one job offer

3. **Reservation System**
   - Companies can reserve candidates (blocks other companies)
   - Reserved candidates show "Reserved" badge
   - Companies can release reservations

4. **Contact Privacy**
   - Contact info (phone, email) only visible after "contacted" status
   - Protects candidate privacy until serious interest

5. **Match Status Progression**
   - Linear flow: pending → contacted → interview → hired/discarded
   - Companies control status updates

## 🔄 API Endpoints

json-server provides REST API at `http://localhost:3000`:

- `GET /candidates` - List all candidates
- `GET /candidates/:id` - Get candidate by ID
- `POST /candidates` - Create new candidate
- `PATCH /candidates/:id` - Update candidate
- `PUT /candidates/:id` - Replace candidate

Same pattern for:
- `/companies`
- `/jobOffers`
- `/matches`

## 🐛 Troubleshooting

### json-server not starting
```bash
cd db
npm install -g json-server
json-server --watch db.json --port 3000
```

### CORS errors
json-server automatically handles CORS. Make sure it's running on port 3000.

### Login not working
1. Check json-server is running
2. Check browser console for errors
3. Verify db.json has test accounts

## 📄 License

This project is part of the Crudzaso learning initiative.

## 👥 Team

Developed by the Crudzaso team as part of the web development bootcamp.

---

**Note**: This is an educational project. For production use, implement proper authentication, security measures, and backend infrastructure.
