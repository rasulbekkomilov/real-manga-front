import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import '../styles/login.css'
import { Link } from "react-router-dom";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (error) {
         alert(error.message);
      } else {
         navigate("/");
      }
   };

   return (
      <div className="auth-page">
         <div className="auth-box">
            <h2>Kirish</h2>
            <form onSubmit={handleLogin}>
               <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
               <input
                  type="password"
                  placeholder="Parol"
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <button type="submit">Kirish</button>
            </form>
            <div className="auth-link">
               Akkauntingiz yo‘qmi? <Link to="/signup">Ro‘yxatdan o‘tish</Link>
            </div>
         </div>
      </div>
   );
};

export default Login;
