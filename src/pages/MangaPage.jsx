import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import "../styles/manga-page.css";

const MangaPage = () => {
   const { slug } = useParams();
   const [manga, setManga] = useState(null);
   const [chapters, setChapters] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchMangaAndChapters = async () => {
         setLoading(true);

         const { data: mangaData, error: mangaError } = await supabase
            .from("manga")
            .select("*")
            .eq("slug", slug)
            .single();

         if (mangaError) {
            console.error("❌ Manga olishda xato:", mangaError.message);
            setLoading(false);
            return;
         }

         setManga(mangaData);

         const { data: chapterData, error: chapterError } = await supabase
            .from("chapter")
            .select("id, title, slug, number")
            .eq("manga_id", mangaData.id)
            .order("number", { ascending: true });

         if (chapterError) {
            console.error("❌ Boblarni olishda xato:", chapterError.message);
         } else {
            setChapters(chapterData || []);
         }

         setLoading(false);
      };

      fetchMangaAndChapters();
   }, [slug]);

   if (loading) return <div className="loading">⏳ Yuklanmoqda...</div>;
   if (!manga) return <div className="loading">❌ Manga topilmadi.</div>;

   return (
      <div className="manga-detail-page">
         <div className="manga-top">
            <img src={manga.cover_url} alt={manga.title} />
            <div className="manga-meta">
               <h1>{manga.title}</h1>
               <p className="status">{manga.status}</p>
               <p className="description">{manga.description}</p>
               {manga.genres && (
                  <div className="genres">
                     {manga.genres.map((g, i) => (
                        <span key={i}>#{g}</span>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <h2 className="chapter-heading">📚 Boblar</h2>
         <div className="chapter-list">
            {chapters.map((ch) => (
               <Link
                  to={`/manga/${slug}/${ch.slug}`}
                  key={ch.id}
                  className="chapter-btn"
               >
                  {ch.number}-bob
               </Link>
            ))}
         </div>
      </div>
   );
};

export default MangaPage;
