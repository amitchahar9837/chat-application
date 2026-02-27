💬 Real-Time Chat Application

A full-stack real-time chat application built with the MERN Stack (MongoDB, Express, React, Node.js) and powered by WebSockets for instant messaging.
This application supports authentication, secure messaging, media uploads, and scalable backend architecture.

🚀 Features

🔐 JWT Authentication (Login / Register)
💬 Real-time messaging (Socket.io)
🖼️ Image upload support (Cloudinary)
🟢 Online / Offline user status
📱 Responsive UI
🌙 Clean modern UI (Vite + React)
🛡️ Protected routes & secure APIs
⚡ Optimized for performance
🛠️ Tech Stack

Frontend
React (Vite)
Axios
Socket.io-client
Tailwind CSS / CSS (if used)
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Socket.io
Cloudinary (Media Storage)

📂 Project Structure
chat-application/
│
├── client/      # React Frontend
├── /      # Express Backend
│
└── README.md
⚙️ Environment Variables Setup

Create a .env file inside your server folder and add:

MONGO_URI=your_mongodb_connection_string

JWT_KEY=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

NODE_ENV=development

PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
🔎 Explanation of Required Variables
Variable	Description
MONGO_URI	MongoDB database connection string
JWT_KEY	Secret key used for signing JWT tokens
JWT_EXPIRES_IN	Token expiration duration
NODE_ENV	development / production
PORT	Backend server port
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name
CLOUDINARY_API_KEY	Cloudinary API key
CLOUDINARY_API_SECRET	Cloudinary secret key
CLIENT_URL	Frontend URL for CORS configuration

💻 Installation Guide
1️⃣ Clone the repository
git clone https://github.com/amitchahar9837/chat-application.git
cd chat-application
2️⃣ Install Backend Dependencies
npm install
3️⃣ Install Frontend Dependencies
cd client
npm install
4️⃣ Run the Application

Start Backend
npm run dev

Start Frontend
cd client
npm run dev

🔐 Security Notes

Never commit your .env file.
Add .env to .gitignore.
Use strong JWT_KEY in production.
Set NODE_ENV=production in deployment.

🌍 Deployment

You can deploy using:
Frontend → Vercel / Netlify
Backend → Render / Railway / AWS
Database → MongoDB Atlas
Media Storage → Cloudinary

📸 Future Improvements

Message read receipts
Typing indicators
Push notifications

👨‍💻 Author

Amit
Full Stack Developer
MERN Stack Enthusiast 🚀
