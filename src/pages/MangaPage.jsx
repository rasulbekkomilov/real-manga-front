import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import "../styles/manga-page.css"; // CSS alohida faylda
import { Helmet } from "react-helmet-async";

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
            console.error("Manga olishda xato:", mangaError.message);
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
            console.error("Chapter olishda xato:", chapterError.message);
         } else {
            setChapters(chapterData || []);
         }

         setLoading(false);
      };

      fetchMangaAndChapters();
   }, [slug]);

   if (loading) return <p className="loading">⏳ Yuklanmoqda...</p>;
   if (!manga) return <p className="loading">❌ Manga topilmadi</p>;

   return (
      <div className="manga-page-container">
         <Helmet><title>{manga.title} - Real Manga</title></Helmet>
         <div className="manga-header">
            <img src={manga.cover_url} alt={manga.title} className="manga-cover" />
            <div className="manga-info">
               <h1 className="manga-title">{manga.title}</h1>
               <p className="manga-description">{manga.description}</p>
               <p><strong>Status:</strong> {manga.status}</p>
               {manga.genres && (
                  <div className="manga-genres">
                     {manga.genres.map((genre, i) => (
                        <span key={i} className="genre-badge">#{genre}</span>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <h2 className="chapter-list-title">📖 Boblar</h2>
         <div className="chapter-list">
            {chapters.length > 0 ? (
               chapters.map((chapter) => (
                  <Link
                     to={`/manga/${slug}/${chapter.slug}`}
                     key={chapter.id}
                     className="chapter-card"
                  >
                     <div className="chapter-number">Bob {chapter.number}</div>
                     <div className="chapter-title">{chapter.title}</div>
                  </Link>
               ))
            ) : (
               <p>Boblar topilmadi.</p>
            )}
         </div>
      </div>
   );
};

export default MangaPage;
