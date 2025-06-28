import { Link } from "react-router-dom";

const AdminPanel = () => {
   return (
      <div className="admin-panel">
         <h2>👨‍💻 Admin Panel</h2>

         <div className="admin-actions">
            <Link to="/admin/add-manga" className="admin-btn">
               ➕ Manga qo‘shish
            </Link>

            <Link to="/admin/add-chapter" className="admin-btn">
               📘 Bob qo‘shish
            </Link>

            {/* Keyinchalik tahrirlash, o‘chirish funksiyalari qo‘shiladi */}
         </div>
      </div>
   );
};

export default AdminPanel;
