// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      const getUser = async () => {
         const { data: { user } } = await supabase.auth.getUser();
         setUser(user);

         if (user) checkIfAdmin(user.id);
      };

      const checkIfAdmin = async (uid) => {
         const { data, error } = await supabase
            .from("admin_users")
            .select("*")
            .eq("id", uid) // ✅ id ustuni bo‘yicha tekshiramiz
            .maybeSingle();

         if (error) {
            console.error("❌ Admin tekshirishda xato:", error.message);
            setIsAdmin(false);
         } else {
            setIsAdmin(!!data);
         }
      };


      getUser();

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
         const currentUser = session?.user || null;
         setUser(currentUser);
         if (currentUser) checkIfAdmin(currentUser.id);
         else setIsAdmin(false);
      });

      return () => listener.subscription.unsubscribe();
   }, []);

   return (
      <AuthContext.Provider value={{ user, setUser, isAdmin }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
