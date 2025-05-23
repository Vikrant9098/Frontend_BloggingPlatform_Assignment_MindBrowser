# Frontend_BloggingPlatform_Assignment_MindBrowser
Built a full-stack blog application using React (frontend) and Node.js with Express (backend), with a focus on clean architecture, secure authentication, and a smooth user experience.

📘 Frontend - Blog Application
This is the frontend of a modern blog application built using React, featuring rich text post creation, responsive design, dark/light themes, and user authentication through JWT.

🚀 Technologies Used
React – Frontend library
React Router DOM – Client-side routing
Axios – HTTP client for API integration
CKEditor 5 – Rich text editor
Context API – Authentication state management
CSS – Styling with support for dark/light modes

🛠️ Setup Instructions
1. Prerequisites
Node.js (v14 or later)
npm or yarn

2. Install Dependencies
cd frontend
npm install

Installs:
react react-dom react-router-dom axios @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic

3. Start Development Server
npm start
App will run at http://localhost:3000

5. Environment Variables (Optional)
If needed, create a .env file to set the backend URL:
REACT_APP_API_URL=http://localhost:5000/api

✨ Features
🔐 JWT-based authentication
📝 Rich text post creation with CKEditor
🔎 Search posts by title/content
🎨 Dark/light theme toggle (saved in localStorage)
📱 Responsive layout
🔒 Route protection
🧑 Dashboard with user’s posts
