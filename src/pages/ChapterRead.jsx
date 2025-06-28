import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "../api/supabaseClient";

const ChapterRead = () => {
   const { slug, chapterSlug } = useParams();
   const [chapter, setChapter] = useState(null);
   const [pages, setPages] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchChapter = async () => {
         setLoading(true);

         const { data: chapterData, error: chapterError } = await supabase
            .from("chapter")
            .select("*")
            .eq("slug", chapterSlug)
            .single();

         if (chapterError) {
            console.error("❌ Bobni olishda xatolik:", chapterError.message);
            setLoading(false);
            return;
         }

         setChapter(chapterData);

         const { data: pagesData, error: pagesError } = await supabase
            .from("chapter_pages")
            .select("page_number, image_url")
            .eq("chapter_id", chapterData.id)
            .order("page_number", { ascending: true });

         if (pagesError) {
            console.error("❌ Sahifalarni olishda xatolik:", pagesError.message);
         } else {
            setPages(pagesData || []);
         }

         setLoading(false);
      };

      fetchChapter();
   }, [slug, chapterSlug]);

   if (loading) return <p>Yuklanmoqda...</p>;
   if (!chapter) return <p>Bob topilmadi.</p>;

   return (
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
         <Helmet>
            <title>{chapter.title} | Real Manga</title>
            <meta
               name="description"
               content={`"${chapter.title}" bobini o‘qing. Real Manga saytida eng so‘nggi boblar o‘zbek tilida!`}
            />
            <meta property="og:title" content={`${chapter.title} | Real Manga`} />
            <meta
               property="og:description"
               content={`"${chapter.title}" bobini Real Manga’da o‘qing. Tezkor tarjimalar va yuqori sifatdagi sahifalar!`}
            />
            <meta
               property="og:image"
               content={pages[0]?.image_url || "https://real-manga-front.vercel.app/default-chapter.png"}
            />
            <meta
               property="og:url"
               content={`https://real-manga-front.vercel.app/manga/${slug}/${chapterSlug}`}
            />
            <meta name="twitter:card" content="summary_large_image" />
         </Helmet>

         <h1 style={{ marginBottom: "20px" }}>{chapter.title}</h1>

         {pages.length > 0 ? (
            <div>
               {pages.map((page, index) => (
                  <img
                     key={index}
                     src={page.image_url}
                     alt={`Sahifa ${page.page_number}`}
                     style={{
                        width: "100%",
                        marginBottom: "20px",
                        borderRadius: "6px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
                     }}
                  />
               ))}
            </div>
         ) : (
            <p>Sahifalar topilmadi.</p>
         )}
      </div>
   );
};

export default ChapterRead;
