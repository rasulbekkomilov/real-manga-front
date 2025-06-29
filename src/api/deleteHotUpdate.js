// src/utils/deleteHotUpdate.js
import { supabase } from "../api/supabaseClient";

export const deleteHotUpdate = async (id) => {
   const { error } = await supabase
      .from("hot_updates")
      .delete()
      .eq("id", id);

   if (error) {
      console.error("❌ Hot Update o‘chirishda xatolik:", error.message);
      return false;
   }

   console.log("✅ Hot Update muvaffaqiyatli o‘chirildi");
   return true;
};
