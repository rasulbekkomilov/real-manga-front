import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";

import "../styles/home.css";

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
         <HelmetProvider>
            <title>Real Manga | Eng so‘nggi manga va manhwa</title>
            <meta
               name="description"
               content="Real Manga saytida eng so‘nggi manga, manhwa va webtoonlarni o‘qing! O‘zbek tilida tarjimalar, yaxshi interfeys va doimiy yangiliklar."
            />
            <meta property="og:title" content="Real Manga | Eng so‘nggi manga va manhwa" />
            <meta
               property="og:description"
               content="Real Manga saytida eng mashhur va yangi manga, manhwa va webtoonlarni o‘qing. O‘zbek tilida tezkor tarjimalar va to‘liq kutubxona!"
            />
            <meta property="og:image" content={mangaList[0]?.cover_url || "/default-cover.jpg"} />
            <meta property="og:url" content="https://real-manga-front.vercel.app/" />
            <meta name="twitter:card" content="summary_large_image" />
         </HelmetProvider>

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
