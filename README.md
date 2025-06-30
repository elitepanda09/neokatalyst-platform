# 🚀 neokatalyst - Digital Transformation Platform

A comprehensive digital transformation platform built with **React**, **FastAPI**, and **MongoDB** featuring business process automation, analytics, document management, e-commerce, and team collaboration.

## ✨ Features

### 🔐 **Authentication & User Management**
- JWT-based authentication with bcrypt password hashing
- User registration, login, and profile management
- Role-based access control
- Protected routes and session persistence

### 🤖 **Business Process Automation**
- Visual workflow builder with drag-and-drop interface
- Task creation, assignment, and tracking
- Multi-step approval processes
- Automated workflow execution

### 📊 **Real-time Analytics Dashboard**
- Comprehensive business metrics and KPIs
- Custom metrics creation and tracking
- Configurable dashboard widgets
- Real-time data visualization

### 📁 **Document Management System**
- Secure file upload with base64 storage
- Hierarchical folder organization
- Document versioning and collaboration
- Tag-based categorization system

### 🛒 **E-commerce Marketplace**
- Complete product catalog management
- Shopping cart and checkout system
- Order processing and tracking
- Inventory management

### 👥 **Team Collaboration**
- Real-time chat and messaging
- Multi-room communication system
- File sharing and team workspaces
- Activity tracking and notifications

## 🛠 Tech Stack

### Frontend
- **React 19** with React Router
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **FastAPI** with async/await
- **MongoDB** with Motor (async driver)
- **JWT** authentication
- **Pydantic** for data validation
- **bcrypt** for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/neokatalyst-platform.git
cd neokatalyst-platform
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo 'MONGO_URL="mongodb://localhost:27017"' > .env
echo 'DB_NAME="neokatalyst_dev"' >> .env
echo 'JWT_SECRET="your-super-secret-jwt-key-for-development"' >> .env

# Start backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

3. **Frontend Setup**
```bash
cd ../frontend
yarn install

# Create .env file
echo 'REACT_APP_BACKEND_URL=http://localhost:8001' > .env

# Start frontend server
yarn start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

## 🌐 Production Deployment

### Deploy to Vercel + Railway

This project is configured for deployment on:
- **Frontend**: Vercel (React app)
- **Backend**: Railway (FastAPI server)
- **Database**: MongoDB Atlas

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Workflow Endpoints
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List workflows
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List user tasks

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Dashboard metrics
- `POST /api/analytics/metrics` - Create custom metric
- `POST /api/analytics/widgets` - Create dashboard widget

### Document Endpoints
- `POST /api/documents` - Upload document
- `GET /api/documents` - List documents
- `POST /api/documents/folders` - Create folder

### E-commerce Endpoints
- `POST /api/products` - Create product
- `GET /api/products` - List products
- `POST /api/orders` - Create order

### Chat Endpoints
- `POST /api/chat/rooms` - Create chat room
- `POST /api/chat/messages` - Send message
- `GET /api/chat/rooms/{id}/messages` - Get messages

## 🧪 Testing

### Backend Tests
```bash
cd backend
python backend_test.py
```

### Frontend Tests
```bash
cd frontend
yarn test
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URL="your-mongodb-connection-string"
DB_NAME="neokatalyst_production"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL="your-backend-url"
```

## 📱 Mobile Support

The platform is fully responsive and works seamlessly on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Security Features

- 🔐 JWT-based authentication
- 🔒 bcrypt password hashing
- 🛡️ Protected API endpoints
- 🔒 CORS configuration
- ✅ Input validation and sanitization
- 🔐 Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@neokatalyst.com
- 📱 GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/neokatalyst-platform/issues)
- 📖 Documentation: [View docs](https://github.com/YOUR_USERNAME/neokatalyst-platform/wiki)

## 🎯 Roadmap

- [ ] AI/ML Integration
- [ ] Real-time WebSocket connections
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Multi-language support

---

**Built with ❤️ by the neokatalyst team**