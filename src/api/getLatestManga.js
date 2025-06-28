import { supabase } from "./supabaseClient";

export const getLatestManga = async () => {
   const { data, error } = await supabase
      .from("manga")
      .select("id, title, slug, cover_url, status")
      .order("created_at", { ascending: false })
      .limit(10);

   if (error) {
      console.error("❌ Manga olishda xato:", error);
      return [];
   }

   return data;
};
