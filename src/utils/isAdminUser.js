import { supabase } from "../api/supabaseClient";

export const isAdminUser = async (userId) => {
   const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .single();

   return !!data && !error;
};
