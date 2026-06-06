# LeadFlow CRM

**LeadFlow CRM** is a premium, full-stack MERN (MongoDB, Express, React, Node.js) Lead Management CRM. Built with a professional MVC structure on the backend and a gorgeous, glassmorphic dark UI using React & Bootstrap 5 on the frontend.

---

## Key Features

- **Lead Lifecycle Management**: Full CRUD operations to add, view, update status, edit details, and delete leads.
- **Interactive Notes Logger**: Click into any lead profile to write and persist customer logs.
- **Smart Pipeline Filtering**: Instantly search across names, emails, and companies, or filter pipeline view by lead status.
- **Advanced Query Engine**: Server-side pagination, sorting, and status aggregates out-of-the-box.
- **KPI Metrics Dashboard**: At-a-glance summaries of total pipelines, won/lost deals, and qualified counts.
- **Premium Aesthetics**: Dark layout, glassmorphic cards, harmonized status badges, and smooth hover micro-animations.

---

## Technology Stack

- **Frontend**: React.js (Vite), Bootstrap 5, Bootstrap Icons, Axios, Google Fonts (Outfit)
- **Backend**: Node.js, Express.js, Mongoose, Dotenv, Cors
- **Database**: MongoDB (Mongoose Object Modeling)

---

## Folder Organization

```
LeadFlow CRM/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # MVC controller actions
│   ├── middlewares/     # Custom error handlers & utilities
│   ├── models/          # Mongoose lead schemas
│   ├── routes/          # Express route endpoints
│   ├── .env             # Backend variables (ignored)
│   ├── package.json     # Node scripts & packages
│   └── server.js        # Express application entrypoint
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Navbars, lead forms, metric cards
│   │   ├── pages/       # Dashboard & LeadDetails profile page
│   │   ├── services/    # Axios API client setup
│   │   ├── App.jsx      # Navigation routing & main view layout
│   │   ├── index.css    # Premium HSL dark design system
│   │   └── main.jsx     # Vite renderer entry
│   ├── index.html       # SEO title & meta descriptions
│   ├── package.json     # Frontend scripts & packages
│   └── vite.config.js   # Vite server settings
├── .env.example         # System configuration template
└── README.md            # This documentation file
```

---

## Get Started Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (usually at `mongodb://127.0.0.1:27017`)

### 1. Setup Backend Server
Open a terminal in the root workspace and run:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

Create a `.env` file inside the `backend` folder (or copy from `.env.example` in the root) and verify settings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/leadflow
NODE_ENV=development
```

Start the backend in development hot-reload mode:
```bash
npm run dev
```
The server will boot and log: `MongoDB Connected: <host>` and `Server running in development mode on port 5000`.

### 2. Setup Frontend Application
Open a new terminal window in the root workspace and run:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite hot-reload server
npm run dev
```

Open your browser to the URL output by Vite (usually `http://localhost:5173`).

---

## Core API Endpoints

The Express server exposes the following RESTful API routes under `/api/leads`:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/leads` | `GET` | Fetch all leads (Supports filtering: `status`, search query: `search`, sorting: `sort`/`order`, and pagination: `page`/`limit`) |
| `/api/leads/:id` | `GET` | Retrieve a single lead's full profile details |
| `/api/leads` | `POST` | Create a new lead (Validates name, email uniqueness, phone, company, status, notes) |
| `/api/leads/:id` | `PUT` | Update details, status changes, or append notes to an existing lead |
| `/api/leads/:id` | `DELETE` | Permanently remove a lead from the CRM pipeline |
