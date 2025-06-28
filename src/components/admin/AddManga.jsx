import { useState } from "react";
import axios from "axios";
import "../../styles/add-manga.css";

const genreOptions = [
   "Action", "Adventure", "Fantasy", "Romance", "Comedy",
   "Drama", "Horror", "Sci-Fi", "Slice of Life", "Mystery"
];

const AddManga = () => {
   const [title, setTitle] = useState("");
   const [slug, setSlug] = useState("");
   const [description, setDescription] = useState("");
   const [status, setStatus] = useState("ongoing");
   const [cover, setCover] = useState(null);
   const [genres, setGenres] = useState([]);
   const [loading, setLoading] = useState(false);

   const handleGenreChange = (e) => {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setGenres(selected);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!title || !slug || !description || !cover || genres.length === 0) {
         return alert("Barcha maydonlarni to‘ldiring");
      }

      setLoading(true);
      try {
         const formData = new FormData();
         formData.append("file", cover);
         formData.append("fileName", cover.name);

         const uploadRes = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
            headers: {
               Authorization: `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ":")}`,
            },
         });

         const cover_url = uploadRes.data.url;

         await axios.post("http://localhost:5000/api/add-manga", {
            title,
            slug,
            description,
            status,
            genres,
            cover_url,
         });

         alert("✅ Manga muvaffaqiyatli qo‘shildi");
         setTitle("");
         setSlug("");
         setDescription("");
         setStatus("ongoing");
         setCover(null);
         setGenres([]);
      } catch (err) {
         console.error(err);
         alert("❌ Xatolik yuz berdi.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="admin-form">
         <h2>📚 Yangi manga qo‘shish</h2>
         <form onSubmit={handleSubmit}>
            <label>Nomi:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Slug (URL uchun):</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />

            <label>Tavsifi:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />

            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
               <option value="ongoing">Ongoing</option>
               <option value="completed">Completed</option>
            </select>

            <label>Janr(lar):</label>
            <select multiple value={genres} onChange={handleGenreChange}>
               {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                     {genre}
                  </option>
               ))}
            </select>

            <label>Cover rasmi:</label>
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />

            <button type="submit" disabled={loading}>
               {loading ? "⏳ Yuklanmoqda..." : "Qo‘shish"}
            </button>
         </form>
      </div>
   );
};

export default AddManga;
