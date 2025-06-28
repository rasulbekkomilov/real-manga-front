import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";

const Signup = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleSignup = async (e) => {
      e.preventDefault();
      const { error } = await supabase.auth.signUp({
         email,
         password,
      });

      if (error) {
         alert(error.message);
      } else {
         alert("Email orqali tasdiqlash yuborildi!");
         navigate("/login");
      }
   };

   return (
      <form onSubmit={handleSignup} className="auth-form">
         <h2>Signup</h2>
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
         <button type="submit">Ro‘yxatdan o‘tish</button>
      </form>
   );
};

export default Signup;
