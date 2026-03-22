import './App.css';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import InfoBar from './components/InfoBar';
import About from './components/About';
import Services from './components/Services';
import Menu from './components/Menu';
import Pricing from './components/Pricing';
import Counter from './components/Counter';
import Blog from './components/Blog';
import Footer from './components/Footer';

const links = [
  { name: 'Home', path: 'home' },
  { name: 'Menu', path: 'menu' },
  { name: 'Services', path: 'services' },
  { name: 'Blog', path: 'blog' },
  { name: 'About', path: 'about' },
  { name: 'Contact', path: 'contact' },
];

const prices = [
  {img: '/images/pizza-1.jpg', name: 'Italian Pizza', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-2.jpg', name: 'Hawaiian Pizza', price: '$29', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-3.jpg', name: 'Greek Pizza', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-4.jpg', name: 'Bacon Crispy Thins', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-5.jpg', name: 'Hawaiian Special', price: '$49', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-6.jpg', name: 'Ultimate Overload', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-7.jpg', name: 'Bacon Pizza', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
  {img: '/images/pizza-8.jpg', name: 'Ham & Pineapple', price: '$20', desc: 'A small river named Duden flows by their place and supplies' },
];


const blogs = [
  { img: '/images/gallery-1.jpg', date: 'Sept 10, 2018', title: 'The Delicious Pizza', desc: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/gallery-2.jpg', date: 'Sept 10, 2018', title: 'The Delicious Pizza', desc: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/gallery-3.jpg', date: 'Sept 10, 2018', title: 'The Delicious Pizza', desc: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
];

const counters = [
  { target: 120, label: 'Pizza Branches' },
  { target: 35, label: 'Number of Awards' },
  { target: 15000, label: 'Happy Customers' },
  { target: 250, label: 'Staff' },
];

const slides = [
  { label: 'Delicious', title: 'Italian Cuizine', bg: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600' },
  { label: 'Crunchy', title: 'Italian Pizza', bg: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600' },
  { label: 'Welcome', title: 'Best Pizza Recipe', bg: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1600' },
];


const menuData = {
  pizza: [
    { img: '/images/pizza-1.jpg', name: 'Italian Pizza', desc: 'Far far away, behind the word mountains', price: '$2.90' },
    { img: '/images/pizza-2.jpg', name: 'Greek Pizza', desc: 'Far far away, behind the word mountains', price: '$2.90' },
    { img: '/images/pizza-3.jpg', name: 'Caucasian Pizza', desc: 'Far far away, behind the word mountains', price: '$2.90' },
    { img: '/images/pizza-4.jpg', name: 'American Pizza', desc: 'Far far away, behind the word mountains', price: '$2.90' },
    { img: '/images/pizza-5.jpg', name: 'Tomatoe Pie', desc: 'Far far away, behind the word mountains', price: '$2.90' },
    { img: '/images/pizza-6.jpg', name: 'Margherita', desc: 'Far far away, behind the word mountains', price: '$2.90' },
  ],
  drinks: [
    { img: '/images/drink-1.jpg', name: 'Lemonade Juice', desc: 'Fresh lemonade with ice', price: '$2.90' },
    { img: '/images/drink-2.jpg', name: 'Pineapple Juice', desc: 'Fresh pineapple juice', price: '$2.90' },
    { img: '/images/drink-3.jpg', name: 'Soda Drinks', desc: 'Assorted sodas', price: '$2.90' },
    { img: '/images/drink-4.jpg', name: 'Orange Juice', desc: 'Fresh orange juice', price: '$2.90' },
    { img: '/images/drink-5.jpg', name: 'Mango Shake', desc: 'Fresh mango milkshake', price: '$2.90' },
    { img: '/images/drink-6.jpg', name: 'Strawberry Juice', desc: 'Fresh strawberry juice', price: '$2.90' },
  ],
  burgers: [
    { img: '/images/burger-1.jpg', name: 'Classic Burger', desc: 'Beef patty with fresh veggies', price: '$3.90' },
    { img: '/images/burger-2.jpg', name: 'Cheese Burger', desc: 'Double cheese with beef patty', price: '$4.50' },
    { img: '/images/burger-3.jpg', name: 'BBQ Burger', desc: 'Smoky BBQ sauce burger', price: '$4.90' },
  ],
  pasta: [
    { img: '/images/pasta-1.jpg', name: 'Pasta Carbonara', desc: 'Creamy sauce with bacon', price: '$3.50' },
    { img: '/images/pasta-2.jpg', name: 'Pasta Bolognese', desc: 'Rich meat sauce pasta', price: '$3.90' },
    { img: '/images/pasta-3.jpg', name: 'Pasta Alfredo', desc: 'Creamy white sauce pasta', price: '$3.70' },
  ],
};

const services = [
  { icon: '🥗', title: 'Healthy Foods', desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life.' },
  { icon: '🏍️', title: 'Fastest Delivery', desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life.' },
  { icon: '👨‍🍳', title: 'Original Recipes', desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life.' },
];

function App() {
  return (
      <div>
       
            <div>
      <Navbar links={links}/>
      <HeroSlider HeroSlider={slides}/>
      <InfoBar />
      <div id="about"><About /></div>
      <div id="services"><Services services={services}/></div>
      <div id="menu"><Menu menuData={menuData} /></div>
      <div id="pricing"><Pricing items={prices} /></div>
      <Counter count={counters} />
      <div id="blog"><Blog props={blogs}/></div>
      <div id="contact"><Footer /></div>
    </div>
  
      </div>
  );
}

export default App;