import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { isAdminUser } from "../utils/isAdminUser";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
   const { user } = useAuth();
   const [allowed, setAllowed] = useState(null);

   useEffect(() => {
      const checkAdmin = async () => {
         if (user) {
            const isAdmin = await isAdminUser(user.id);
            setAllowed(isAdmin);
         } else {
            setAllowed(false);
         }
      };
      checkAdmin();
   }, [user]);

   if (allowed === null) return <p>Tekshirilmoqda...</p>;
   if (!allowed) return <Navigate to="/" />;

   return children;
};

export default ProtectedAdminRoute;
