# Task_Management_System

 This project is a part of a hackathon run by
 https://www.katomaran.com

## Overview

This project is a **Task Management System** designed and implemented as part of a hackathon. It enables users to create, assign, track, and manage tasks in a collaborative environment. The application aims to simplify team productivity and task tracking with a focus on user experience and scalability.

## Features

- User registration and authentication
- Create, assign, edit, and delete tasks
- Set due dates and priorities for tasks
- Task status tracking (To Do, In Progress, Done)
- Collaborative workspaces for teams
- Responsive, user-friendly interface
- Scalable backend architecture

## Live Demo

Access the deployed application here:  
[Task Management System (Frontend)](https://task-management-system-frontend-2y4y.onrender.com)

## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install dependencies:**
    ```bash
    # If there is a backend and frontend, specify both:
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3. **Configure environment variables:**
    - Create `.env` files in both the backend and frontend directories as needed.
    - Example (`backend/.env`):
        ```
        PORT=5000
        MONGO_URI=your-mongodb-uri
        JWT_SECRET=your-secret
        ```
    - Example (`frontend/.env`):
        ```
        REACT_APP_API_URL=https://your-backend-url.com
        ```

4. **Run the application:**
    ```bash
    # Start backend
    cd backend
    npm run start

    # Start frontend
    cd ../frontend
    npm run start
    ```
    The app will be available at `http://localhost:3000` (or your configured port).

## Assumptions

- The application is built using a **React frontend** and a **Node.js/Express backend** with **MongoDB** as the database.
- The deployed frontend URL is: https://task-management-system-frontend-2y4y.onrender.com
- The backend is also deployed and accessible via the appropriate API URL (to be added in the `.env`).
- All users must register before using the application.
- Only registered and authenticated users can create or assign tasks.
- Additional features can be added as future enhancements.

## Prompts & AI Tools Usage

- AI tools such as **ChatGPT** were used to generate boilerplate code, README structure, and initial design suggestions.
- Prompt history and usage will be retained for review during the interview process.

## License

This project is open-source and available under the [MIT License](./LICENSE).

---

This project is a part of a hackathon run by  
https://www.katomaran.com
