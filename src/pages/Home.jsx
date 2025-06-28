import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";
import "../styles/home.css"; // CSS faylini alohida yozamiz quyida

const Home = () => {
   const [mangaList, setMangaList] = useState([]);

   useEffect(() => {
      const fetchManga = async () => {
         const { data, error } = await supabase
            .from("manga")
            .select("id, title, slug, cover_url");

         if (error) {
            console.error("❌ Manga olishda xatolik:", error.message);
         } else {
            setMangaList(data);
         }
      };

      fetchManga();
   }, []);

   return (
      <div className="home-container">
         <h1 className="home-title">📚 Manga & Manhwa Kutubxonasi</h1>

         <div className="manga-grid">
            {mangaList.map((manga) => (
               <Link to={`/manga/${manga.slug}`} key={manga.id} className="manga-card">
                  <div className="card-img-container">
                     <img src={manga.cover_url} alt={manga.title} />
                  </div>
                  <div className="card-title">{manga.title}</div>
               </Link>
            ))}
         </div>
      </div>
   );
};

export default Home;
