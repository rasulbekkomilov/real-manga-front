import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
   const { theme, toggleTheme } = useTheme();
   const [isOpen, setIsOpen] = useState(false);

   return (
      <nav className="navbar">
         <div className="navbar-container">
            <Link to="/" className="logo">
               <span>📖 RealManga</span>
            </Link>

            <div className={`nav-links ${isOpen ? "open" : ""}`}>
               <Link to="/">Bosh sahifa</Link>
               <Link to="/login">Kirish</Link>
               <Link to="/signup">Ro‘yxatdan o‘tish</Link>
               <button onClick={toggleTheme} className="theme-toggle">
                  {theme === "dark" ? "🌞" : "🌙"}
               </button>
            </div>

            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
               ☰
            </button>
         </div>
      </nav>
   );
};

export default Navbar;
