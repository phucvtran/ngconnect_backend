# 🏪 Marketplace & Real-Time Chat API  

A **marketplace platform** where users can post **items for sale, services, or jobs** and connect via **real-time chat**. Built with **Express.js, TypeScript, MySQL, and Socket.io**, this backend provides a secure and scalable foundation for user authentication, listing management, and messaging.  

### Demo
http://18.217.230.205:3000

## Test Accounts:
| Username  | Password |
|------------|-------------|
| admin@gmail.com | password |
| user@gmail.com | password |

### Frontend Repository
https://github.com/phucvtran/ngconnect

## 🚀 Features  

### 🔐 Authentication & Security  
- **JWT-based authentication** (access & refresh tokens)  
- **User roles** (Admin, Business, User)  
- Secure password hashing with **bcrypt**  

### 🛍️ Marketplace Listings  
- Post **items for sale** with **price, location, and description**  
- Post **services or job offers**, allowing others to connect  
- Listings categorized as **Item, Service, or Job**  
- **Filtering and pagination** for efficient browsing  

### 💬 Real-Time Communication  
- **Live chat** using **Socket.io** for instant messaging  
- Conversations linked to **service or job listings**  
- Messages stored with timestamps for history tracking  

### 📅 Request & Reservation System  
- Users can send a **request for a service or job**  
- **One request per user per listing** to prevent spam  
- **Reservation dates** stored securely with transactional integrity  

### ☁️ Deployment & Scalability  
- Hosted on **AWS EC2** with **PM2** for process management  
- **Nginx reverse proxy** for performance optimization  
- Secured with **SSL (Let's Encrypt)**  

## 🛠️ Tech Stack  

| Technology  | Description |
|------------|-------------|
| **Backend** | Express.js + TypeScript |
| **Database** | MySQL + Sequelize ORM |
| **Authentication** | JWT + bcrypt |
| **Real-Time** | Socket.io |
| **Deployment** | AWS EC2, PM2, Nginx |

## 📦 Installation  

### 1️⃣ Clone the Repository  
```sh
https://github.com/phucvtran/ngconnect_backend.git
```

### Install Dependencies 
```sh
npm install
```

### Create local .env file
```sh
DB_NAME=your-database-name
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_HOST=your-database-host
DB_PORT=3306
JWT_SECRET_KEY=your-jwt-secret-key
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
HOST=http://localhost
```

### Run on local
```sh
npm run dev
```

### API documentation
- In-Progress: will be provided later
