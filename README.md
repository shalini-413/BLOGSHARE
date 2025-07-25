
# BlogShare: Blogging Platform

A modern, full-stack blogging platform that allows users to create and share articles using Markdown, with a unique AI-powered feature for real-time hate speech detection in comments.

---

## ✨ Key Features

* **Full User Authentication**: Secure registration and login using JWTs stored in httpOnly cookies.
* **Markdown Blog Editor**: Users can write and format their blog posts using simple Markdown syntax.
* **AI Comment Moderation**: A Python/Flask microservice with a machine learning model automatically flags comments for hate speech in real-time.
* **Interactive Social Features**: Users can like posts and engage in discussions through comments.
* **Fully Responsive Design**: A sleek, modern, dark-themed UI built with Tailwind CSS that works seamlessly on all devices.
* **Three-Part Architecture**: A decoupled system with a React frontend, a Node.js/Express backend, and a Python AI service.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.js
* **AI Service**: Python, Flask, Scikit-learn, NLTK