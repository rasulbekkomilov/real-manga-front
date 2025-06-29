import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import '../styles/signup.css'
const Signup = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState(null);

   const handleSignup = async (e) => {
      e.preventDefault();
      setError(null);

      const { data, error } = await supabase.auth.signUp({
         email,
         password,
      });

      if (error) {
         setError(error.message);
      } else {
         navigate("/");
      }
   };

   return (
      <div className="signup-container" style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
         <h2>Ro‘yxatdan o‘tish</h2>
         <form className="signup-form" onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               style={{ padding: "10px" }}
            />
            <input
               type="password"
               placeholder="Parol"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               style={{ padding: "10px" }}
            />
            <button
               type="submit"
               style={{
                  padding: "10px",
                  backgroundColor: "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
               }}
            >
               Ro‘yxatdan o‘tish
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
               <Link to="/login" style={{ color: "#0077cc", textDecoration: "none" }}>
               Hisobingiz bormi? Kirish sahifasiga o'ting
               </Link>
            </p>
         </form>
      </div>
   );
};

export default Signup;
