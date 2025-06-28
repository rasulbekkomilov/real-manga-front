import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
   const [mangaList, setMangaList] = useState([]);

   useEffect(() => {
      const fetchManga = async () => {
         try {
            const res = await fetch("https://real-manga-back.onrender.com/api/manga");
            const data = await res.json();
            setMangaList(data);
         } catch (err) {
            console.error("❌ Ma'lumot olishda xato:", err);
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
