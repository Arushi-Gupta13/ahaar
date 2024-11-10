## AHAAR - ONE BYTE AGAINST WASTE (Backend Documentation)

*Overview*  
AHAAR is a web-based application designed to help users track pantry items, receive expiration alerts, and share excess food to minimize food waste. By providing a comprehensive food management platform, AHAAR aims to reduce household food waste, lower greenhouse gas emissions, and promote sustainable consumption.

### *Problem Statement*  
Household food waste contributes to 8-10% of preventable greenhouse gas emissions globally and incurs an annual economic loss of over $1 trillion. This is often due to poor planning, forgotten items, and lack of community-driven sharing solutions. AHAAR aims to address this by providing a platform to track, manage, and share food items effectively.

---

### *Key Features*  
- *Pantry Tracking*: Users can catalog pantry items and monitor their usage.
- *Expiration Notifications*: Users will be alerted when pantry items near expiration.
- *Waste Histories*: Track food waste over time, including items thrown away, shared, or consumed.
- *Points System*: Reward system for reducing food waste and improving sustainable consumption.
- *AI Integration*: Scans receipts to import items and predicts expiration dates based on the category.
  
---

### *Why MongoDB Atlas?*

MongoDB Atlas is used for its flexibility, scalability, and real-time capabilities:

- *Document Flexibility*: Stores user data, pantry items, expiration dates, and waste histories efficiently.
- *Scalability*: Handles increasing data demands as the user base grows.
- *Real-Time Notifications*: Sends real-time expiration alerts and sharing notifications.
- *AI Integration*: Supports machine learning and AI features for expiration predictions and recipe suggestions.
- *Security and Reliability*: Ensures secure data storage and real-time access with automated backups and redundancy.

---

### *Tech Stack*  
- *Frontend*: React, Next.js, Tailwind CSS, TypeScript
- *Backend*: Node.js, Express.js
- *Database*: MongoDB Atlas
- *AI*: Optical Character Recognition (OCR) for receipt scanning, GEN-AI for expiration prediction

---

### *Installation (Backend Setup)*

*Prerequisites*:  
- Node.js and npm installed  
- MongoDB Atlas account  

*Steps to Set Up the Backend*:

1. *Clone the Repository*:
    bash
    git clone https://github.com/Arushi-Gupta13/ahaar-BE.git
    cd backend
    

2. *Install Dependencies*:
    bash
    npm install
    

3. *Set Up Environment Variables*:  
    Create a .env file in the root directory and add the following variables:
    env
    MONGODB_URI=your-mongodb-atlas-uri
    JWT_SECRET=your-jwt-secret-key
    PORT=5000
    

4. *Run the Application*:
    bash
    npm start
    

The backend will now be running on port 5000 by default.

---

### *API Endpoints*  

1. *POST /api/auth/register* - Register a new user  
    Request body:
    json
    {
        "username": "user1",
        "email": "user1@example.com",
        "password": "password123"
    }
    

2. *POST /api/auth/login* - Login user  
    Request body:
    json
    {
        "email": "user1@example.com",
        "password": "password123"
    }
    

3. *GET /api/pantry* - Get all pantry items for the user  
    Response:
    json
    [
        {
            "name": "Milk",
            "category": "Dairy",
            "expiration_date": "2024-11-15",
            "quantity": 2
        },
        {
            "name": "Tomatoes",
            "category": "Vegetables",
            "expiration_date": "2024-11-12",
            "quantity": 5
        }
    ]
    

4. *POST /api/pantry* - Add new pantry item  
    Request body:
    json
    {
        "name": "Bread",
        "category": "Grains",
        "expiration_date": "2024-11-14",
        "quantity": 1
    }
    

5. *DELETE /api/pantry/:id* - Delete pantry item by ID

6. *GET /api/notifications* - Get expiration notifications for pantry items nearing expiration

7. *GET /api/waste-history* - View user’s food waste history

8. *POST /api/food-share* - Share excess food with nearby users

---

### *MongoDB Atlas Usage*

MongoDB Atlas is used for:

- *User Data*: Storing user details such as name, email, password, pantry items, and waste history.
- *Pantry Items*: Each pantry item includes fields such as name, category, expiration date, and quantity.
- *Expiration Alerts*: MongoDB stores data for real-time expiration notifications.
- *Waste History*: Keeps a record of all items thrown away, shared, or consumed, and helps track waste patterns over time.

---

### *AI Features and Integration*

- *Receipt Scanning*: The backend uses Optical Character Recognition (OCR) to scan receipts, extract item names, and add them to the user's pantry.
- *Expiration Prediction*: Machine learning algorithms analyze item categories and expiration patterns to suggest when food will likely expire.

---

### *Contributing*

Contributions are welcome! To contribute to the backend, follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Implement your changes and commit them
4. Open a pull request

---

### *Future Improvements*

- *Recipe Suggestions*: Recommend recipes based on pantry items close to expiration.
- *Community Waste Statistics*: Show community-wide impact based on waste data aggregation.
- *Enhanced AI*: Improve the AI to suggest optimized storage methods for different food types and further reduce waste.

---

### *License*  
This project is licensed under the MIT License - see the LICENSE file for details.

---

### *Deploying the Backend*  

To deploy the backend, use services like Heroku, DigitalOcean, or any other preferred cloud hosting. Ensure MongoDB Atlas is connected and the .env variables are properly set up in the cloud environment.

---

This setup ensures that the backend is fully operational with MongoDB Atlas handling the database management, supporting scalability and real-time features for a seamless food waste reduction experience.
