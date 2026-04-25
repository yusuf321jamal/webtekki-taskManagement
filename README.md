# Project & Task Management System

## Project Overview
A full-stack MERN (MongoDB, Express, React, Node.js) application for managing projects and tasks with user authentication. Users can create projects, add tasks, update task status (Todo/In Progress/Done), and manage their work efficiently. The app features a clean, responsive UI with toast notifications and confirmation modals.

## Tech Stack Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for building REST APIs
- **MongoDB Atlas** - Cloud database for data persistence
- **JWT (JSON Web Token)** - Authentication and authorization
- **bcryptjs** - Password hashing for security
- **express-validator** - Input validation and sanitization
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - UI library for building user interfaces
- **Vite** - Next-generation frontend build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications for user feedback
- **CSS-in-JS** - Inline styles for component styling

### Deployment
- **Render** - Backend hosting (free tier)
- **Vercel** - Frontend hosting (free tier)
- **GitHub** - Version control and repository hosting

## Local Setup Steps



### Step 1: Clone the Repository
```bash
# Clone the project
git clone https://github.com/yusuf321jamal/webtekki-taskManagement.git

# Navigate into the project folder
cd webtekki-taskManagement

Step 2: Backend Setup
Navigate to backend folder
cd backend
Install dependencies
npm install

2.3 Create environment variables file
Create a .env file in the backend folder with the following content:

Windows (Command Prompt/PowerShell):
echo PORT=5000 > .env
echo MONGODB_URI=mongodb+srv://yusufjamal532_db_user:1bElRn4LD0R0aeLh@tekkiwebsols.gdnuihn.mongodb.net/internal_tool?retryWrites=true&w=majority >> .env
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789 >> .env

Or manually create .env file with:

PORT=5000
MONGODB_URI=mongodb+srv://yusufjamal532_db_user:1bElRn4LD0R0aeLh@tekkiwebsols.gdnuihn.mongodb.net/internal_tool?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789

2.4 Start the backend server
npm run dev
Expected output:

Server running on port 5000
MongoDB Connected: tekkiwebsols.gdnuihn.mongodb.net

Step 3: Frontend Setup

3.1 Open a new terminal and navigate to frontend folder
cd frontend

3.2 Install dependencies
npm install

3.3 Create environment variables file
Create a .env file in the frontend folder:

Windows:


echo VITE_API_URL=http://localhost:5000/api > .env
Mac/Linux:


echo "VITE_API_URL=http://localhost:5000/api" > .env
Or manually create .env file with:

env
VITE_API_URL=http://localhost:5000/api
3.4 Start the frontend development server

npm run dev
Expected output:
VITE v5.0.8 ready in 500 ms
➜ Local: http://localhost:3000/
The frontend will run at: http://localhost:3000

Step 4: Access the Application
Open your browser and go to http://localhost:3000

Click "Register" to create a new account

Enter Name, Email, and Password (min 6 characters)

Login with your credentials

Create your first project from the dashboard

Add tasks to your project

Update task status using the dropdown menu

Step 5: Verify Everything is Working
Backend API Test:

bash
# In your browser, visit:
http://localhost:5000/api/health

# Expected response:
{"message":"API is running","status":"OK"}
Frontend Connection Test:

Register a new user

Create a project

Create a task

Update task status

Refresh page - data should persist


Deployment URLs

Backend (Render)
https://webtekki-taskmanagement.onrender.com

Health Check Endpoint:
https://webtekki-taskmanagement.onrender.com/api/health

Frontend (Vercel)
https://webtekki-taskmanagement.vercel.app

GitHub Repository
https://github.com/yusuf321jamal/webtekki-taskManagement

FOLDER STRUCTURE EXPLANATION

Backend Structure

backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration/login logic
│   │   ├── projectController.js  # CRUD operations for projects
│   │   └── taskController.js     # CRUD operations for tasks
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── errorMiddleware.js    # Central error handling
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   ├── Project.js            # Project schema with user reference
│   │   └── Task.js               # Task schema with status enum
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── projectRoutes.js      # Project CRUD endpoints
│   │   └── taskRoutes.js         # Task CRUD endpoints
│   └── app.js                    # Express app configuration
├── .env                          # Environment variables (not committed)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts


Frontend Structure

frontend/
├── src/
│   ├── components/
│   │   ├── Button.jsx            # Reusable button component with variants
│   │   ├── Input.jsx             # Reusable input with label/error
│   │   ├── LoadingSpinner.jsx    # Loading animation component
│   │   ├── ErrorMessage.jsx      # Error display component
│   │   └── Modal.jsx             # Confirmation modal component
│   ├── pages/
│   │   ├── Login.jsx             # Login page with form validation
│   │   ├── Register.jsx          # Registration page with validation
│   │   ├── Dashboard.jsx         # Projects list with CRUD operations
│   │   └── Tasks.jsx             # Tasks management page
│   ├── con/
│   │   └── AuthCon.jsx       # Authentication state management
│   ├── services/
│   │   └── api.js                # Axios instance with interceptors
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point with Toaster
│   └── index.css                 # Global styles
├── .env                          # Development environment variables
├── .env.production               # Production environment variables
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── vercel.json                   # Vercel routing configuration
└── vite.config.js                # Vite build configuration


API List
Method	Endpoint	                 Description
POST	/api/auth/register	         Register user
POST	/api/auth/login	              Login user
GET	    /api/projects	                Get all projects
POST	/api/projects	            Create project
PUT	    /api/projects/:id	            Update project
DELETE	/api/projects/:id	        Delete project
GET 	/api/tasks	                     Get tasks
POST	/api/tasks	                Create task
PUT	    /api/tasks/:id	                Update task
DELETE	/api/tasks/:id	             Delete task

Quick Start Commands Summary

# Clone repository
git clone https://github.com/yusuf321jamal/webtekki-taskManagement.git
cd webtekki-taskManagement

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Open browser at http://localhost:3000
Environment Variables
Backend (.env)
Variable	Description	Example
PORT	Server port	5000
MONGODB_URI	MongoDB connection string	mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET	Secret key for JWT tokens	your_secret_key_here
Frontend Development (.env)
Variable	Description	Example
VITE_API_URL	Backend API URL	http://localhost:5000/api
Frontend Production (.env.production)
Variable	Description	Example
VITE_API_URL	Backend API URL	https://webtekki-taskmanagement.onrender.com/api