import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { isAdminUser } from "../utils/isAdminUser";

const Navbar = () => {
   const { theme, toggleTheme } = useTheme();
   const { user, logout } = useAuth();
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      const check = async () => {
         if (user) {
            const admin = await isAdminUser(user.id);
            setIsAdmin(admin);
         } else {
            setIsAdmin(false);
         }
      };
      check();
   }, [user]);

   return (
      <nav className="navbar" style={styles.navbar(theme)}>
         <div className="nav-left">
            <Link to="/" style={styles.logo}>📚 MangaReader</Link>
         </div>

         <div className="nav-right" style={styles.right}>
            <button onClick={toggleTheme} style={styles.themeButton}>
               {theme === "light" ? "🌙" : "☀️"}
            </button>

            {!user && (
               <>
                  <Link to="/login" style={styles.link}>Login</Link>
                  <Link to="/signup" style={styles.link}>Signup</Link>
               </>
            )}

            {user && (
               <>
                  <span style={styles.email}>{user.email}</span>
                  {isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
                  <button onClick={logout} style={styles.logout}>Logout</button>
               </>
            )}
         </div>
      </nav>
   );
};

const styles = {
   navbar: (theme) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: theme === "light" ? "#f4f4f4" : "#222",
      color: theme === "light" ? "#000" : "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 999,
   }),
   logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      textDecoration: "none",
      color: "inherit",
   },
   right: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
   },
   link: {
      textDecoration: "none",
      color: "inherit",
      fontWeight: "500",
   },
   logout: {
      padding: "0.4rem 0.8rem",
      background: "#f87171",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
   },
   themeButton: {
      fontSize: "1.2rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
   },
   email: {
      fontSize: "0.9rem",
      opacity: 0.8,
   },
};

export default Navbar;
