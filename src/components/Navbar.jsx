// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../api/supabaseClient";
import '../styles/navbar.css'

const Navbar = () => {
   const { user, setUser, isAdmin } = useAuth();
   const navigate = useNavigate();

   const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
   };

   return (
      <nav style={{
         padding: "10px 20px",
         display: "flex",
         justifyContent: "space-between",
         alignItems: "center"
      }}>
         <Link to="/" style={{ fontWeight: "bold", fontSize: "22px" }}>RealManga</Link>

         <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {!user ? (
               <>
                  <Link to="/login">Kirish</Link>
                  <Link to="/signup">Ro‘yxatdan o‘tish</Link>
               </>
            ) : (
               <>
                  <span>{user.email}</span>

                  {isAdmin && (
                     <button
                        onClick={() => navigate("/admin")}
                        style={{
                           padding: "6px 12px",
                           background: "#444",
                           color: "white",
                           border: "none",
                           borderRadius: "6px",
                           cursor: "pointer"
                        }}
                     >
                        Admin
                     </button>
                  )}

                  <button
                     onClick={handleLogout}
                     style={{ padding: "6px 12px", cursor: "pointer" }}
                  >
                     Chiqish
                  </button>
               </>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
