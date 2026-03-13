# House Selling Web Application

A modern web-based House Selling and Property Listing system where sellers can upload details of properties for sale or rent, and buyers can search and view these listings easily.

## Features

### 1. User Authentication
- User registration and login using localStorage
- Secure authentication with email and password

### 2. Seller Module
- Add property details (price, location, type, description, bedrooms, bathrooms, area)
- Upload multiple images via URLs
- Data saved to localStorage
- View and manage your own properties

### 3. Property Listing
- All properties displayed on the homepage using React components
- Each listing shows basic info and an image
- Responsive grid layout
- Sample properties included for demonstration

### 4. Property Search & Filters
Buyers can filter properties by:
- Location
- Price (max price)
- Rent/Sale type
- Number of bedrooms

### 5. Property Details View
- Full property details with image gallery
- Contact information
- Property owner can delete their listings

## Tech Stack

### Frontend:
- React.js
- HTML, CSS
- JavaScript (ES6+)
- Material-UI (MUI)

### Data Storage:
- localStorage (browser storage)
- No backend required - runs entirely in the browser

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   ├── PropertyCard.jsx    # Property card component
│   ├── PropertyFilters.jsx # Filter component
│   └── ProtectedRoute.jsx  # Route protection
├── context/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── HomePage.jsx        # Homepage with property listings
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Signup page
│   ├── AddProperty.jsx     # Add property form
│   ├── PropertyDetails.jsx # Property details page
│   └── MyProperties.jsx    # User's properties page
├── utils/
│   └── sampleData.js       # Sample property data
├── App.jsx                 # Main app component with routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Usage

1. **Sign Up/Login**: Create an account or log in to access seller features
2. **Browse Properties**: View all available properties on the homepage (includes sample data)
3. **Filter Properties**: Use filters to find properties matching your criteria
4. **View Details**: Click on any property to see full details and images
5. **Add Property**: Logged-in users can add new properties with images
6. **Manage Properties**: View and delete your own properties from "My Properties"

## Sample Data

The application comes with 6 sample properties to demonstrate functionality:
- Modern Downtown Apartment (New York, NY)
- Cozy Suburban House (Austin, TX)
- Luxury Penthouse Suite (San Francisco, CA)
- Beachfront Condo (Miami, FL)
- Historic Brownstone (Boston, MA)
- Mountain View Cabin (Denver, CO)

## Data Persistence

All data is stored in the browser's localStorage:
- User accounts and authentication
- Property listings
- User sessions

**Note**: Data will persist between browser sessions but is specific to each browser/device.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Features Included

✅ Home page with intro and navigation  
✅ User authentication (Login & Signup)  
✅ Property listing page with all properties  
✅ Reusable Property Card component  
✅ Property details page with React Router  
✅ Add Property page for logged-in users  
✅ "My Properties" page for user's listings  
✅ React Router v6 navigation  
✅ localStorage data persistence  
✅ Clean, modern UI with Material-UI  
✅ Protected routes  
✅ Functional components with hooks  
✅ Well-commented, beginner-friendly code  
✅ Sample data for demonstration  

## License

This project is open source and available for educational purposes.
