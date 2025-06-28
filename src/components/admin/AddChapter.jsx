import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/add-chapter.css";

const AddChapter = () => {
   const [mangaList, setMangaList] = useState([]);
   const [selectedManga, setSelectedManga] = useState("");
   const [chapterTitle, setChapterTitle] = useState("");
   const [chapterSlug, setChapterSlug] = useState("");
   const [chapterNumber, setChapterNumber] = useState("");
   const [images, setImages] = useState([]);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      const fetchManga = async () => {
         const { data, error } = await supabase.from("manga").select("id, title");
         if (error) {
            console.error("❌ Manga olishda xato:", error.message);
         } else {
            setMangaList(data);
         }
      };
      fetchManga();
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!selectedManga || !chapterTitle || !chapterSlug || !chapterNumber || images.length === 0) {
         return alert("⚠️ Barcha maydonlarni to‘ldiring.");
      }

      setLoading(true);
      try {
         const uploadedUrls = [];

         for (const image of images) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("fileName", image.name);

            const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
               headers: {
                  Authorization: `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ":")}`,
               },
            });

            uploadedUrls.push(res.data.url);
         }

         // Backendga POST yuborish
         const response = await axios.post("http://localhost:5000/api/add-chapter", {
            manga_id: selectedManga,
            chapter_title: chapterTitle,
            chapter_slug: chapterSlug,
            chapter_number: parseInt(chapterNumber),
            image_urls: uploadedUrls,
         });

         console.log("✅ Backenddan javob:", response.data);

         alert("✅ Bob muvaffaqiyatli qo‘shildi!");
         setChapterTitle("");
         setChapterSlug("");
         setChapterNumber("");
         setImages([]);
         navigate("/admin");
      } catch (err) {
         console.error("❌ Bob qo‘shishda xatolik:", err);
         alert("❌ Bob qo‘shishda xatolik yuz berdi.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="admin-form">
         <h2>➕ Yangi bob qo‘shish</h2>
         <form onSubmit={handleSubmit}>
            <label htmlFor="manga">Manga tanlang:</label>
            <select
               id="manga"
               value={selectedManga}
               onChange={(e) => setSelectedManga(e.target.value)}
               required
            >
               <option value="">-- Tanlang --</option>
               {mangaList.map((manga) => (
                  <option key={manga.id} value={manga.id}>
                     {manga.title}
                  </option>
               ))}
            </select>

            <label htmlFor="chapter-title">Bob nomi:</label>
            <input
               id="chapter-title"
               type="text"
               value={chapterTitle}
               onChange={(e) => setChapterTitle(e.target.value)}
               required
            />

            <label htmlFor="chapter-slug">Slug (URL uchun):</label>
            <input
               id="chapter-slug"
               type="text"
               value={chapterSlug}
               onChange={(e) => setChapterSlug(e.target.value)}
               required
            />

            <label htmlFor="chapter-number">Bob raqami:</label>
            <input
               id="chapter-number"
               type="number"
               value={chapterNumber}
               onChange={(e) => setChapterNumber(e.target.value)}
               required
            />

            <label htmlFor="images">Bob sahifa rasmlari:</label>
            <input
               id="images"
               type="file"
               accept="image/*"
               multiple
               onChange={(e) => setImages([...e.target.files])}
               required
            />

            <button type="submit" disabled={loading}>
               {loading ? "⏳ Yuklanmoqda..." : "📤 Bobni qo‘shish"}
            </button>
         </form>
      </div>
   );
};

export default AddChapter;
