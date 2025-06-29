import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { deleteHotUpdate } from "../../api/deleteHotUpdate";
import '../../styles/add-hot-update.css'

const AddHotUpdate = () => {
   const [mangaList, setMangaList] = useState([]);
   const [selectedManga, setSelectedManga] = useState("");
   const [lastChapter, setLastChapter] = useState(null);
   const [hotUpdates, setHotUpdates] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchMangaList = async () => {
         const { data, error } = await supabase.from("manga").select("id, title");
         if (!error) setMangaList(data);
      };
      const fetchHotUpdates = async () => {
         const { data, error } = await supabase
            .from("hot_updates")
            .select("id, title, chapter_slug, cover_url");
         if (!error) setHotUpdates(data);
      };

      fetchMangaList();
      fetchHotUpdates();
   }, []);

   const handleMangaSelect = async (id) => {
      setSelectedManga(id);
      setLastChapter(null);

      const { data, error } = await supabase
         .from("chapter")
         .select("id, title, slug, number")
         .eq("manga_id", id)
         .order("number", { ascending: false })
         .limit(1);

      if (!error && data.length > 0) setLastChapter(data[0]);
   };

   const handleAddHotUpdate = async () => {
      if (!selectedManga || !lastChapter) return;

      setLoading(true);

      // cover url ni manga jadvalidan olamiz
      const { data: mangaData } = await supabase
         .from("manga")
         .select("slug, cover_url")
         .eq("id", selectedManga)
         .single();

      if (!mangaData) return;

      const { error } = await supabase.from("hot_updates").insert([
         {
            manga_id: selectedManga,
            chapter_id: lastChapter.id,
            title: `${lastChapter.title}`,
            chapter_slug: lastChapter.slug,
            manga_slug: mangaData.slug,
            cover_url: mangaData.cover_url,
         },
      ]);

      if (!error) {
         alert("✅ Yangi hot update qo‘shildi!");
         window.location.reload();
      } else {
         console.error("❌ Qo‘shishda xatolik:", error.message);
      }

      setLoading(false);
   };

   const handleDelete = async (id) => {
      const confirmed = window.confirm("Rostdan ham o‘chirmoqchimisiz?");
      if (!confirmed) return;

      const success = await deleteHotUpdate(id);
      if (success) {
         setHotUpdates((prev) => prev.filter((item) => item.id !== id));
      }
   };

   return (
      <div style={{ padding: "20px" }} className="add-hot-update-container">
         <h2>🔥 Yangi Hot Update qo‘shish</h2>

         <select
            value={selectedManga}
            onChange={(e) => handleMangaSelect(e.target.value)}
         >
            <option value="">-- Manga tanlang --</option>
            {mangaList.map((manga) => (
               <option key={manga.id} value={manga.id}>
                  {manga.title}
               </option>
            ))}
         </select>

         {lastChapter && (
            <div style={{ marginTop: "16px" }} className="chapter-info">
               <p>
                  <strong>Oxirgi bob:</strong> {lastChapter.title}
               </p>
               <button
                  onClick={handleAddHotUpdate}
                  disabled={loading}
                  className="add-button"
               >
                  {loading ? "Qo‘shilmoqda..." : "Qo‘shish"}
               </button>
            </div>
         )}

         <hr style={{ margin: "30px 0" }} />

         <h3>🧾 Qo‘shilgan hot update'lar</h3>
         <ul className="hot-list">
            {hotUpdates.map((item) => (
               <li key={item.id} style={{ marginBottom: "8px" }}>
                  {item.title}
                  <button
                     onClick={() => handleDelete(item.id)}
                     style={{
                        marginLeft: "12px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 10px",
                        cursor: "pointer",
                     }}
                  >
                     O‘chirish
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default AddHotUpdate;
