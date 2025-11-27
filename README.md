# Habito - AI-Powered Real Estate Platform

A full-stack real estate listing platform built with the MERN stack, enhanced with AI capabilities. Users can browse, filter, and favorite properties, list new properties with AI-generated descriptions, and report issues for admin review. The platform leverages Google's Gemini AI to provide intelligent property summaries and descriptions.

## 🚀 Key Features

- **AI-Powered Property Descriptions**: Generate professional property descriptions with a single click
- **Smart Property Summaries**: Get concise, engaging property summaries automatically
- **Advanced Search & Filtering**: Find properties by location, price, features, and more
- **User Authentication**: Secure JWT-based authentication system
- **Favorites System**: Save and manage your favorite properties
- **Property Management**: List, edit, and manage your properties with ease
- **Admin Dashboard**: Comprehensive tools for property verification and issue management
- **Responsive Design**: Fully responsive layout for desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 18 with Hooks
- React Router v6 for navigation
- Bootstrap 5 for responsive UI
- Context API for state management
- Axios for API requests
- React Icons for beautiful icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Google Gemini AI API integration
- Multer for file uploads
- Cloudinary for image storage

### AI Features
- Google Gemini 2.5 Flash for natural language generation
- Dynamic prompt engineering for real estate content
- Intelligent property summarization
- Context-aware description generation

## ✨ Key Features

### For Buyers/Renters
- 🏠 Browse and filter properties with advanced search options
- 🔍 View detailed property information with high-quality images
- ❤️ Save favorite properties for easy access
- 📱 Responsive design works on all devices
- 🤖 AI-powered property insights and recommendations

### For Sellers/Landlords
- 🏗️ List properties with AI-assisted description generation
- 📊 Track property views and engagement
- ✏️ Edit and manage property listings
- 📱 Get notified about interested buyers/renters
- 📈 Performance analytics for your listings

### For Administrators
- 👑 Manage user accounts and permissions
- ✅ Verify property listings
- ⚠️ Handle user reports and issues
- 📊 View platform analytics and statistics
- ⚙️ Configure platform settings

## Project Structure
```
Habito/
├─ backend/
│  ├─ controllers/
│  │  ├─ auth.js
│  │  ├─ issue.js
│  │  └─ property.js
│  ├─ middleware/
│  │  └─ auth.js
│  ├─ model/
│  │  ├─ Issue.js
│  │  └─ Property.js
│  ├─ routes/
│  │  ├─ ai.js
│  │  ├─ auth.js
│  │  ├─ issue.js
│  │  └─ property.js
│  └─ index.js (Express app entry)
├─ frontend/
│  └─ src/
│     ├─ App.jsx
│     ├─ context/AuthContext.jsx
│     ├─ components/
│     │  ├─ SidebarLayout.jsx
│     │  ├─ PropertiesPage.jsx
│     │  ├─ Details.jsx
│     │  ├─ ListPropertyPage.jsx
│     │  ├─ Favourites.jsx
│     │  ├─ Profile.jsx
│     │  ├─ AdminPanel.jsx
│     │  ├─ AdminIssues.jsx
│     │  ├─ MyIssues.jsx
│     │  ├─ Login.jsx
│     │  └─ Signup.jsx
├─ package.json
└─ package-lock.json
```

## Prerequisites
- Node.js LTS (>= 18)
- MongoDB instance (local or hosted)

## Backend Setup
1. Open a terminal in `backend/`.
2. Create a `.env` file with:
   ```
   MONGODB_URI=mongodb://localhost:27017/habito
   JWT_SECRET=your_strong_secret
   PORT=5000
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```
4. Server runs at `http://localhost:5000`.

### Key API Endpoints (summary)
- Auth: `POST /auth/register`, `POST /auth/login`
- Properties:
  - `GET /properties` (query: location, minPrice, maxPrice)
  - `POST /properties` (auth required; multipart with images)
  - `PUT /properties/:id/verify` (admin)
  - `DELETE /properties/:id` (admin)
- User favorites:
  - `GET /user/getUserFavourite` (auth)
  - `POST /user/addUserFavourite` (auth)
  - `DELETE /user/removeUserFavourite/:id` (auth)
- Issues:
  - `POST /issues` (auth) create report
  - `GET /issues` (admin) list all
  - `GET /issues/mine` (auth) my reports
  - `PUT /issues/:id/status` (admin) update status
  - `POST /issues/:id/notes` (auth/admin) add note

## Frontend Setup
1. Open a second terminal in `frontend/`.
2. Configure API base (default used in code is `http://localhost:5000`).
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm start
   ```
4. App runs at `http://localhost:3000` (or as configured).

## Authentication Flow
- On login/signup, backend returns a JWT.
- Frontend stores token in `localStorage` and attaches `Authorization: Bearer <token>` to protected requests.
- Logout clears auth state and redirects to the login page.

## Listing Properties (Required Fields)
- Frontend requires all key fields (title, description, details, price, location, propertyType, furnished, parking, availableFrom, bedrooms, bathrooms, area, yearBuilt, ownerEmail, ownerPhone) and at least one image.
- Backend schema enforces required fields as well.

## Reporting Issues
- From Properties page, click Report to open the modal.
- Choose category and optionally add description.
- Submit to `POST /issues` with the current property ID.
- Track your reports under My Reports.

## Admin Panel
- Approve/verify properties via `PUT /properties/:id/verify`.
- Delete properties via `DELETE /properties/:id`.
- View stats, details, and reported issues (AdminIssues page).

## Environment/Security Notes
- Never commit real secrets. Use `.env` and environment variables.
- Avoid logging sensitive info (tokens). Existing console logs that exposed tokens were removed.
- Validate all inputs on both client and server.

## Scripts (typical)
- Backend (`backend/`):
  - `npm start` — start Express server
- Frontend (`frontend/`):
  - `npm start` — start React dev server

## Troubleshooting
- 404/401 on admin routes: ensure you are logged in with an admin role and backend is running.
- Image upload failures: check request is multipart/form-data and backend accepts `images` field.
- CORS/network: if frontend and backend are on different ports, ensure no ad‑blockers and the backend is reachable at configured URL.

