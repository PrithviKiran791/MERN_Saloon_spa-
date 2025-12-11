🚀 MERN Salon Spa - Tech Stack Overview
Frontend Stack
Core Framework:

React 19.1.1 - UI library
TypeScript - Type-safe JavaScript
Vite - Fast build tool and dev server
Styling & UI:

Tailwind CSS 4.x - Utility-first CSS framework
Shadcn UI - Reusable component library with custom animations
Warp Background, Typing Text, Writing Text, Ripple effects
Lucide React - Icon library
State Management:

Zustand - Lightweight state management
Form Handling:

React Hook Form - Performant form management
Zod - Schema validation
Routing:

React Router DOM 7.x - Client-side routing
Animations:

Motion (Framer Motion) - Advanced animations
GSAP - Professional animations
Custom Shadcn animations - Ripple, typing, warp effects
Maps & Location:

Leaflet (CDN) - Interactive maps
OpenStreetMap - Map tiles and geocoding (Nominatim API)
HTTP & Data:

Axios - HTTP client
Day.js - Date formatting
js-cookie - Cookie management
UI Enhancements:

Sonner - Toast notifications
React DatePicker - Date selection
Backend Stack
Runtime:

Node.js - JavaScript runtime
Express.js - Web framework

Backend Stack
Runtime:

Node.js - JavaScript runtime
Express.js - Web framework
Database:

MongoDB - NoSQL database
Mongoose - MongoDB ODM
Authentication:

JWT tokens (stored in cookies)
Role-based access (user/owner)

Project Structure 

📦 MERN_Saloon_spa-
├── 🎨 client/vite-project/          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Route pages
│   │   │   ├── public/             # Login, Register, Home
│   │   │   └── private/            # User & Owner dashboards
│   │   ├── store/                  # Zustand state
│   │   ├── hooks/                  # Custom hooks
│   │   └── utils/                  # Helper functions
│   └── public/                     # Static assets
│
└── 🔧 Server/                       # Express Backend
    ├── models/                      # MongoDB schemas
    ├── routes/                      # API endpoints
    ├── middleware/                  # Auth middleware
    └── config/                      # Database 
    
    Key Features Implemented
✅ User Features:

Dashboard with salon browsing
Appointment booking system
Profile management
Location-based salon search
✅ Owner Features:

Salon management (CRUD)
Appointment management
Interactive map for salon location
Customer view
✅ UI/UX:

Animated homepage with typing effects
Ripple background animations
Smooth transitions and hover effects
Responsive design
✅ Technical:

Protected routes with JWT
Form validation with Zod
Real-time map integration
Cookie-based authentication