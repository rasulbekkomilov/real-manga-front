// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
   const [hotUpdates, setHotUpdates] = useState([]);
   const [mangaList, setMangaList] = useState([]);

   useEffect(() => {
      const fetchHotUpdates = async () => {
         const { data, error } = await supabase
            .from("hot_updates")
            .select("id, title, chapter_slug, manga_slug, cover_url")
            .order("created_at", { ascending: false });

         if (error) {
            console.error("🔥 Hot Updates Error:", error);
         } else {
            setHotUpdates(data);
         }
      };

      const fetchMangaList = async () => {
         const { data, error } = await supabase
            .from("manga")
            .select("id, title, slug, cover_url")
            .order("created_at", { ascending: false });

         if (error) {
            console.error("📚 Manga Error:", error);
         } else {
            setMangaList(data);
         }
      };

      fetchHotUpdates();
      fetchMangaList();
   }, []);

   return (
      <div className="home-page">
         {/* HOT UPDATES BO'LIMI */}
         {hotUpdates.length > 0 && (
            <section className="hot-updates">
               <h2>🔥 Yangi boblar</h2>
               <div className="grid hot-grid">
                  {hotUpdates.map((item) => (
                     <Link
                        key={item.id}
                        to={`/manga/${item.manga_slug}/${item.chapter_slug}`}
                        className="hot-card"
                     >
                        <img src={item.cover_url} alt={item.title} />
                        <p>{item.title} - bob   </p>
                     </Link>
                  ))}
               </div>
            </section>
         )}
         {/* BARCHA MANGA RO'YXATI */}
         <section className="full-list">
            <h2>📚 Barcha manga va manhwa</h2>
            <div className="grid manga-grid">
               {mangaList.map((manga) => (
                  <Link
                     key={manga.id}
                     to={`/manga/${manga.slug}`}
                     className="card manga-card"
                  >
                     <div className="cover">
                        <img src={manga.cover_url} alt={manga.title} />
                        <div className="overlay">
                           <span>Ko‘rish</span>
                        </div>
                        <h3>{manga.title}</h3>
                     </div>
                  </Link>
               ))}
            </div>
         </section>
      </div>
   );
};

export default Home;
