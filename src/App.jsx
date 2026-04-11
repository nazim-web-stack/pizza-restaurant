import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import InfoBar from './components/InfoBar';
import About from './components/About';
import Services from './components/Services';
import Menu from './components/Menu';
import OrderPage from './components/OrderPage';
import Pricing from './components/Pricing';
import Counter from './components/Counter';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import { useState } from 'react';
import AdminPanel from "./pages/AdminPanel";


const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Order", path: "/order" },
  { name: "Pricing", path: "/pricing" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const blogs = [
  {
    id: 1,
    img: "/images/pizza-1.jpg",
    title: "Introducing Our New Spicy Chicken Pizza",
    date: "March 25, 2026",
    desc: "Experience the perfect blend of spicy chicken, fresh veggies, and our signature cheese. A must-try for spice lovers!",
    fullContent: "Full article: Our new spicy chicken pizza is made with marinated chicken, jalapenos, bell peppers, and triple cheese blend. Available in medium and large sizes. Order now and get 20% off on first order!",
    link: "/blog/1"
  },
  {
    id: 2,
    img: "/images/weekendspecial.jpg",
    title: "Weekend Special: Buy 1 Get 1 Free",
    date: "March 20, 2026",
    desc: "This weekend only! Buy any large pizza and get another free. Valid for dine-in and takeaway.",
    fullContent: "Full article: Offer valid from Friday to Sunday. Choose any two large pizzas, pay for the higher-priced one. Don't miss out!",
    link: "/blog/2"
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    title: "Live Cricket Screening at Our Restaurant",
    date: "March 15, 2026",
    desc: "Watch live cricket matches with friends and family. Enjoy special combo offers during matches.",
    fullContent: "Full article: Every match day, we have special deals. Large pizza + 4 drinks + fries = just $25. Come and enjoy!",
    link: "/blog/3"
  }
]

const counters = [
  { target: 5, label: 'Branches' },
  { target: 12, label: 'Number of Awards' },
  { target: 2500, label: 'Happy Customers' },
  { target: 25, label: 'Staff' }
]

const slides = [
  { label: 'Delicious', title: 'Italian Cuizine', bg: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600' },
  { label: 'Crunchy', title: 'Italian Pizza', bg: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600' },
  { label: 'Welcome', title: 'Best Pizza Recipe', bg: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1600' },
];


const services = [
  { icon: '🥗', title: 'Healthy Foods', desc: 'We use only the freshest ingredients sourced daily. No artificial flavors, no compromises — just pure, delicious food for you and your family.' },
  { icon: '🏍️', title: 'Fastest Delivery', desc: 'Order online and get your food delivered hot and fresh to your doorstep within 30 minutes. We deliver across Stoke-on-Trent, 7 days a week.' },
  { icon: '👨‍🍳', title: 'Original Recipes', desc: 'Our chefs bring authentic Pakistani and Italian recipes passed down through generations. Every bite tells a story of tradition and passion.' },
];





function ProtectedAdmin() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <AdminPanel />;
}

function ProtectedUserDashboard() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'user') {
    return <Navigate to="/" replace />;
  }
  return <CustomerDashboard />;
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '');

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('customerId');
    setIsLoggedIn(false);
    setUserRole('');
    window.location.href = '/';
  };


  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar
         links={links}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Routes */}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <HeroSlider slides={slides} />
              <InfoBar />
              <About />
              <Services services={services} />
              <Menu />
              <Pricing />
              <Counter count={counters} />
              <Blog blogs={blogs} />
              <Footer />
            </>
          }
        />

        {/* Other Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services services={services} />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog blogs={blogs} />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/dashboard" element={<ProtectedUserDashboard />} />
      </Routes>

      {/* Login Modal */}
       {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(role) => {
            setIsLoggedIn(true);
            setUserRole(role);
            setShowLogin(false);
          }}
        />
      )}
    </BrowserRouter>
  );
}

export default App;