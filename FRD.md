# Functional Requirements Document - Internal Tool

## Feature List

1. User Authentication
   - User Registration
   - User Login
   - JWT-based session management
   - Protected routes

2. Project Management
   - Create new projects
   - View list of projects
   - Update project details (Edit)
   - Delete projects
   - Projects are user-specific

3. Task Management
   - Create tasks within projects
   - Update task status (Todo/In Progress/Done)
   - Update task details (Edit title/description)
   - View tasks by project
   - Delete tasks
   - Tasks are user-specific

## User Flow

1. User registers with name, email, password
2. User logs in with email and password
3. Upon successful login, user sees dashboard with their projects
4. User can create new projects from dashboard
5. From dashboard, user can click "View Tasks" for any project
6. In Tasks page, user can create tasks within a project
7. User can update task status using dropdown (quick update)
8. User can edit task title/description using Edit button
9. User can delete tasks or projects as needed
10. User can logout from any page

## Basic Validations

- All forms have required field validation
- Password minimum 6 characters
- Name minimum 2 characters
- Email must be valid format
- Project name minimum 3 characters
- Task title minimum 3 characters
- No duplicate emails allowed
- JWT token validation on protected routes
- Input sanitization on backend

## Assumptions

- Users are authenticated to access projects/tasks
- Each user only sees their own projects and tasks
- Task status can only be Todo, In Progress, or Done
- Projects can have multiple tasks
- Deleting a project does NOT automatically delete its tasks
- Basic responsive design (not fancy UI as time constraint)
- No role-based access control needed (single user type)
- Application will be deployed on Render (backend) and Vercel/Netlify (frontend)
- MongoDB Atlas used for database
