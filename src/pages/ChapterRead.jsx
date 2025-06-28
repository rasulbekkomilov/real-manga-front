import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

const ChapterRead = () => {
   const { slug, chapterSlug } = useParams(); // `slug` = manga slug, `chapterSlug` = chapter slug
   const [chapter, setChapter] = useState(null);
   const [pages, setPages] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchChapterData = async () => {
         setLoading(true);

         // 1. Chapter'ni olish
         const { data: chapterData, error: chapterError } = await supabase
            .from("chapter")
            .select("*")
            .eq("slug", chapterSlug)
            .single();

         if (chapterError || !chapterData) {
            console.error("❌ Bob topilmadi:", chapterError?.message);
            setLoading(false);
            return;
         }

         setChapter(chapterData);

         // 2. Chapterning sahifalarini olish
         const { data: pagesData, error: pagesError } = await supabase
            .from("chapter_pages")
            .select("page_number, image_url")
            .eq("chapter_id", chapterData.id)
            .order("page_number", { ascending: true });

         if (pagesError) {
            console.error("❌ Sahifalarni olishda xato:", pagesError.message);
         } else {
            setPages(pagesData || []);
         }

         setLoading(false);
      };

      fetchChapterData();
   }, [chapterSlug]);

   if (loading) return <p>⏳ Yuklanmoqda...</p>;
   if (!chapter) return <p>❌ Bob topilmadi.</p>;

   return (
      <div style={{ padding: "20px" }}>
         <Link to={`/manga/${slug}`} style={{ textDecoration: "none", color: "#007bff" }}>
            ⬅️ Orqaga
         </Link>

         <h2 style={{ marginTop: "20px" }}>{chapter.number} - {chapter.title}</h2>

         {pages.length > 0 ? (
            <div>
               {pages.map((page) => (
                  <img
                     key={page.page_number}
                     src={page.image_url}
                     alt={`Page ${page.page_number}`}
                     style={{
                        width: "100%",
                        maxWidth: "800px",
                        display: "block",
                        margin: "20px auto",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        borderRadius: "8px"
                     }}
                  />
               ))}
            </div>
         ) : (
            <p>📭 Bu bob uchun sahifalar yo‘q.</p>
         )}
      </div>
   );
};

export default ChapterRead;
