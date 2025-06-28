import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";

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
      <form onSubmit={handleLogin} className="auth-form">
         <h2>Login</h2>
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
   );
};

export default Login;
