import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import "../styles/chapter-reader.css";

const ChapterRead = () => {
   const { slug, chapterSlug } = useParams();
   const [chapter, setChapter] = useState(null);
   const [pages, setPages] = useState([]);
   const [prevSlug, setPrevSlug] = useState(null);
   const [nextSlug, setNextSlug] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchChapter = async () => {
         setLoading(true);
         setError(null);

         // 1. manga_id ni olish
         const { data: mangaData, error: mangaError } = await supabase
            .from("manga")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

         if (mangaError || !mangaData) {
            setError("Manga topilmadi.");
            setLoading(false);
            return;
         }

         const mangaId = mangaData.id;

         // 2. Hozirgi bobni olish
         const { data: chapterData, error: chapterError } = await supabase
            .from("chapter")
            .select("*")
            .eq("slug", chapterSlug)
            .eq("manga_id", mangaId)
            .maybeSingle();

         if (chapterError || !chapterData) {
            setError("Bob topilmadi.");
            setLoading(false);
            return;
         }

         setChapter(chapterData);

         // 3. Sahifalarni olish
         const { data: pagesData, error: pagesError } = await supabase
            .from("chapter_pages")
            .select("image_url")
            .eq("chapter_id", chapterData.id)
            .order("page_number", { ascending: true });

         if (pagesError) {
            setError("Sahifalarni yuklashda xatolik.");
         } else {
            setPages(pagesData.map((p) => p.image_url));
         }

         // 4. Oldingi bob
         const { data: prev } = await supabase
            .from("chapter")
            .select("slug")
            .eq("manga_id", mangaId)
            .lt("number", chapterData.number)
            .order("number", { ascending: false })
            .limit(1);
         setPrevSlug(prev?.[0]?.slug || null);

         // 5. Keyingi bob
         const { data: next } = await supabase
            .from("chapter")
            .select("slug")
            .eq("manga_id", mangaId)
            .gt("number", chapterData.number)
            .order("number", { ascending: true })
            .limit(1);
         setNextSlug(next?.[0]?.slug || null);

         setLoading(false);
      };

      fetchChapter();
   }, [slug, chapterSlug]);

   if (loading) return <div className="reader">⏳ Yuklanmoqda...</div>;
   if (error) return <div className="reader error">❌ {error}</div>;

   return (
      <div className="reader">
         <h1 className="chapter-title">{chapter.title}</h1>

         <div className="pages">
            {pages.map((url, idx) => (
               <img key={idx} src={url} alt={`Sahifa ${idx + 1}`} loading="lazy" />
            ))}
         </div>

         <div className="nav-buttons">
            <Link
               to={prevSlug ? `/manga/${slug}/${prevSlug}` : "#"}
               className={`nav-button ${!prevSlug ? "disabled" : ""}`}
               onClick={(e) => !prevSlug && e.preventDefault()}
            >
               ⬅️ Oldingi bob
            </Link>

            <Link
               to={nextSlug ? `/manga/${slug}/${nextSlug}` : "#"}
               className={`nav-button ${!nextSlug ? "disabled" : ""}`}
               onClick={(e) => !nextSlug && e.preventDefault()}
            >
               Keyingi bob ➡️
            </Link>
         </div>

      </div>
   );
};

export default ChapterRead;
