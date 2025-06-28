import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import AdminPanel from "./pages/AdminPanel";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import MangaPage from "./pages/MangaPage";
import AddChapter from './components/admin/AddChapter';
import AddManga from './components/admin/AddManga';
import ChapterRead from './pages/ChapterRead';

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/manga/:slug" element={<MangaPage />} />
         <Route path="*" element={<h1>404 - Not Found</h1>} />

         <Route path="/manga/:slug/:chapterSlug" element={<ChapterRead />} />
         <Route
            path="/admin"
            element={
               <ProtectedAdminRoute>
                  <AdminPanel />
               </ProtectedAdminRoute>
            }
         />
         <Route path="/admin/add-manga" element={<AddManga />} />
         <Route path="/admin/add-chapter" element={<AddChapter />} />
      </Routes>
   );
};

export default AppRoutes;
