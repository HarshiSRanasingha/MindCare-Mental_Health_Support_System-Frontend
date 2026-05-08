# Mental Health Support System 

## 📌 Project Title
Mental Health Support System for Students

##  Problem Description
Mental health issues among students are increasing rapidly due to academic pressure, personal problems, social anxiety, depression, stress, and other emotional challenges. Many students hesitate to seek help because of fear, stigma, lack of privacy, or limited access to counselors.

Traditional counseling systems are often inefficient and difficult to access quickly. Students may feel uncomfortable discussing their issues openly or may not know how to contact professional support services.

As a result, many students suffer silently without receiving proper mental health assistance.


## 💡 Proposed Solution
The MERN Mental Health Support System is a web-based platform developed to provide students with a secure, simple, and private way to request counseling support.

The system allows:
- Students to submit mental health support requests
- Counselors to manage and respond to requests
- Organized storage of counseling records using MongoDB
- Efficient communication between students and counselors

The platform is developed using the MERN stack:
- MongoDB
- Express.js
- React.js
- Node.js

This solution improves accessibility, privacy, and management of mental health support services.

## ✨ Features
### Student Features
- Create student accounts
- Submit counseling requests
- View request status

### Counselor Features
- Add counselor information
- View all counseling requests
- Assign counselors to requests
- Update request status

### System Features
- REST API implementation
- CRUD operations
- MongoDB database integration
- Organized MVC architecture
- Multiple database collections
- API testing with Postman


## 🛠️ Technologies Used
### Frontend
- React.js
- Axios
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Tools & Platforms
- VS Code
- Postman
- GitHub


## 🗂️ Project Structure

mental-health-support-system/

├── backend/
│
│   ├── db/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── counselorModel.js
│   │   └── requestModel.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── counselorController.js
│   │   └── requestController.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── counselorRoutes.js
│   │   └── requestRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
├── frontend/
│
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── docs/
│
│   ├── screenshots/
│   │
│   ├── postman/
│   │   └── mental-health-api.json
│   │
│   └── presentation/
│
└── README.md


## 🧠 Database Collections
### 1. Users Collection
Stores student details.
-Fields
-name
-email

### 2. Counselors Collection
Stores counselor/admin information.
-Fields
-name
-email
-specialization

### 3. Requests Collection
Stores counseling requests.
-Fields
-userId
-counselorId
-issue
-status


## 🔗 API Endpoints
### 👤 User APIs
- POST `/api/users` → Create user  
- GET `/api/users` → Get all users  

### 👨‍⚕️ Counselor APIs
- POST `/api/counselors` → Create counselor  
- GET `/api/counselors` → Get all counselors  

### 📝 Request APIs
- POST `/api/requests` → Create request  
- GET `/api/requests` → Get all requests  
- PUT `/api/requests/:id` → Update request  
- DELETE `/api/requests/:id` → Delete request  


## ⚙️ Setup Instructions
### Step 1 — Clone Repository
git clone YOUR_GITHUB_REPOSITORY_LINK

### Step 2 — Install Backend Dependencies
cd backend  
npm install  

### Step 3 — Create Environment Variables
Create `.env` file in backend folder:

PORT=5000  
MONGO_URI=mongodb://127.0.0.1:27017/mentalHealthDB  



## ▶️ How to Run the Project
### Start MongoDB
Make sure MongoDB is running.
### Run Backend
cd backend  
node index.js  
### Run Frontend
cd frontend  
npm start  

Frontend runs at:
http://localhost:5000  

### 🧪 API Testing
API testing was done using Postman.  
Postman collection is available in:
docs/postman/

### 📸 Screenshots
Project screenshots are available in:
docs/screenshots/
Includes:
- API testing  
- MongoDB connection  
- Folder structure  
- Frontend UI
  
## 🚀 Future Improvements
JWT Authentication
Role-based access control
Real-time chat system
Online appointment scheduling
Email notifications
AI-based emotional analysis
Mobile responsive UI

## ❤️ Conclusion

The MERN Mental Health Support System provides a secure and accessible platform for students to seek counseling support. The project demonstrates full-stack web development concepts including REST APIs, MongoDB integration, CRUD operations, MVC architecture, and frontend-backend communication using the MERN stack.

## 👩‍💻 Developed By
Harshani Sandunika Ranasingha
2022/ICT/78


Harshani Sandunika Ranasingha
