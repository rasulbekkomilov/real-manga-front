import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const genreOptions = [
   "Action", "Adventure", "Comedy", "Drama", "Fantasy",
   "Horror", "Isekai", "Mystery", "Romance", "School Life",
   "Sci-Fi", "Slice of Life", "Supernatural"
];

const AddManga = () => {
   const [title, setTitle] = useState("");
   const [slug, setSlug] = useState("");
   const [description, setDescription] = useState("");
   const [status, setStatus] = useState("ongoing");
   const [coverImage, setCoverImage] = useState(null);
   const [genres, setGenres] = useState([]);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!title || !slug || !description || !status || !coverImage || genres.length === 0) {
         return alert("⚠️ Barcha maydonlarni to‘ldiring.");
      }

      setLoading(true);

      try {
         // 1. Cover image yuklash
         const formData = new FormData();
         formData.append("file", coverImage);
         formData.append("fileName", coverImage.name);

         const imageRes = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
            headers: {
               Authorization: `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ":")}`,
            },
         });

         const imageUrl = imageRes.data.url;

         // 2. Backendga yuborish
         const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/add-manga`, {
            title,
            slug,
            description,
            status,
            cover_url: imageUrl,
            genres, // massiv holida yuboriladi
         });

         alert("✅ Manga muvaffaqiyatli qo‘shildi!");
         navigate("/admin");
      } catch (err) {
         console.error("❌ Xatolik:", err);
         alert("❌ Manga qo‘shishda xatolik yuz berdi.");
      } finally {
         setLoading(false);
      }
   };

   const handleGenreChange = (e) => {
      const { value, checked } = e.target;
      if (checked) {
         setGenres([...genres, value]);
      } else {
         setGenres(genres.filter((g) => g !== value));
      }
   };

   return (
      <div className="admin-form">
         <h2>➕ Yangi Manga qo‘shish</h2>
         <form onSubmit={handleSubmit}>
            <label>Manga nomi:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Slug:</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />

            <label>Izoh:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
               <option value="ongoing">Davom etmoqda</option>
               <option value="completed">Yakunlangan</option>
            </select>

            <label>Janrlar:</label>
            <div className="genres-checkboxes">
               {genreOptions.map((genre) => (
                  <label key={genre}>
                     <input
                        type="checkbox"
                        value={genre}
                        checked={genres.includes(genre)}
                        onChange={handleGenreChange}
                     />
                     {genre}
                  </label>
               ))}
            </div>

            <label>Cover rasm:</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} required />

            <button type="submit" disabled={loading}>
               {loading ? "⏳ Yuklanmoqda..." : "📤 Manga qo‘shish"}
            </button>
         </form>
      </div>
   );
};

export default AddManga;
