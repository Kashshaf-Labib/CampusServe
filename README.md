# CampusServe

## 🚀 Project Overview
CampusServe is an integrated management system designed to streamline operations for the University Central Departmental Store (CDS). The system automates food ordering, token issuance, dorm-specific delivery, and real-time order tracking, improving efficiency and user experience.


## ✨ Features

### 🥘 Food Ordering System
- Users (students, teachers, and staff) can browse the menu and place food orders online.
- Each order generates a token for food pickup.
- Real-time notifications inform users when food is ready.

### 🏠 Dorm-Specific Delivery
- Female dorm residents can order food online for delivery after 6 PM.
- Notifications alert users when their food is out for delivery and has arrived.

### 📊 Report Generation
- Users can generate reports based on their order history and spending.
- Admins can extract sales reports for analysis.

### ⭐ Review & Rating System
- Users can submit ratings and reviews for food items.
- Admins can analyze feedback to improve offerings.

### 💬 Multi-Level Commenting
- Users can comment on food items and reply to existing comments.
- Recursive comment support allows structured discussions.

### 🤖 AI-Powered Chatbot
- Chatbot powered by the Gemini API to assist users.
- Provides instant answers to FAQs about ordering and system usage.

## 🏗️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Clerk (OAuth, email/password)
- **Chatbot:** Gemini API

## 🔗 API Endpoints

| Endpoint         | Method | Description |
|-----------------|--------|-------------|
| `/cart`         | GET, POST, DELETE, PATCH | Manage user's food cart |
| `/cart/item`    | DELETE | Remove an item from the cart |
| `/chat`         | POST | Chatbot backend interaction |
| `/menu`         | GET, POST | Retrieve or add menu items |
| `/orders`       | POST, GET, PATCH | Handle user orders |
| `/orders/admin` | PATCH | Admin order status updates |
| `/reviews`      | POST, GET | Manage food reviews and ratings |

## 🔄 Workflow Diagram
![Workflow Diagram](WorkflowDiagram.pdf)

## 🔥 Use Case Scenarios
- A student places an order and gets notified when it’s ready.
- A dorm resident orders food and receives an alert when delivered.
- An admin generates a monthly sales report to analyze peak order times.
- A user leaves a rating and review for a meal.
- Users discuss food quality using multi-level comments.
- A user interacts with the chatbot for order guidance.

## 🛠️ Challenges & Solutions
**Challenge:** Implementing recursive multi-level comments.  
**Solution:** Designed a recursive algorithm for smooth comment handling.

## 🚀 Future Improvements
- 📱 **Admin App** for better inventory & order management.
- 🔔 **Real-time Notifications** for order updates.
- 💳 **Payment Integration** for seamless transactions.

## 🎯 Conclusion
CampusServe enhances the efficiency of university CDS operations through automation and digital tools. With AI-powered assistance, review systems, and order tracking, it ensures a seamless experience. Future enhancements aim to introduce an admin app, real-time notifications, and payment integration to further optimize the system.
