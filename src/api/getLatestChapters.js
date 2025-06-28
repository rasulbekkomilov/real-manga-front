import { supabase } from "./supabaseClient"; // 💡 BU QATORNI QO‘SHING

export const getLatestChapters = async () => {
   const { data, error } = await supabase
      .from("chapter")
      .select(`
      id,
      number,
      slug,
      created_at,
      manga (
        title,
        cover_url
      )
    `)
      .order("created_at", { ascending: false })
      .limit(10);

   if (error) {
      console.error("Supabase error:", error.message);
      return [];
   }

   return data;
};
