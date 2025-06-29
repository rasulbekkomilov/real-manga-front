import { supabase } from "./supabaseClient";

export const getChapterBySlug = async (slug) => {
   // 1. Chapterni manga bilan birga olish
   const { data: chapter, error: chapterError } = await supabase
      .from("chapter")
      .select(`
      id,
      number,
      slug,
      manga (title)`)
      .eq("slug", slug)
      .single();

   if (chapterError || !chapter) {
      console.error("Chapter error:", chapterError?.message);
      return null;
   }

   // 2. Sahifalar (rasmlar) ro'yxati
   const { data: pages, error: imageError } = await supabase
      .from("chapter_images")
      .select("image_url, page_number")
      .eq("chapter_id", chapter.id)
      .order("page_number", { ascending: true });

   if (imageError) {
      console.error("Images error:", imageError.message);
      return null;
   }

   return {
      mangaTitle: chapter.manga.title,
      chapterNumber: chapter.number,
      pages,
   };
};
