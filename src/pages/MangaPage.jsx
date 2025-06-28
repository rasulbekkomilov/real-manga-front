import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet"; // ← Qo‘shildi
import { supabase } from "../api/supabaseClient";

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

   if (loading) return <p>Yuklanmoqda...</p>;
   if (!manga) return <p>Manga topilmadi.</p>;

   return (
      <div style={{ padding: "20px" }}>
         <Helmet>
            <title>{manga.title} | Real Manga</title>
            <meta name="description" content={manga.description.slice(0, 160)} />
            <meta property="og:title" content={manga.title} />
            <meta property="og:description" content={manga.description.slice(0, 160)} />
            <meta property="og:image" content={manga.cover_url} />
            <meta property="og:url" content={`https://real-manga-front.vercel.app/manga/${slug}`} />
            <meta name="twitter:card" content="summary_large_image" />
         </Helmet>

         <h1>{manga.title}</h1>
         <img
            src={manga.cover_url}
            alt={manga.title}
            style={{ maxWidth: "300px", marginBottom: "20px" }}
         />
         <p><strong>Status:</strong> {manga.status}</p>
         <p><strong>Tavsif:</strong> {manga.description}</p>

         {manga.genres && (
            <p>
               <strong>Janrlar:</strong>{" "}
               {manga.genres.map((genre, i) => (
                  <span key={i} style={{ marginRight: "8px" }}>
                     #{genre}
                  </span>
               ))}
            </p>
         )}

         <h2 style={{ marginTop: "30px" }}>Boblar:</h2>
         {chapters.length > 0 ? (
            <ul>
               {chapters.map((chapter) => (
                  <li key={chapter.id}>
                     <Link to={`/manga/${slug}/${chapter.slug}`}>
                        {chapter.number} - {chapter.title}
                     </Link>
                  </li>
               ))}
            </ul>
         ) : (
            <p>Boblar yo‘q</p>
         )}
      </div>
   );
};

export default MangaPage;
