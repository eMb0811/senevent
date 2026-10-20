import { createClient } from "@supabase/supabase-js";

export let supabase = null;

export function initSupabase(url, anonKey) {
  if (!supabase) {
    if (!url || !anonKey) {
      throw new Error("Variables Supabase manquantes.");
    }
    supabase = createClient(url, anonKey);
  }
  return supabase;
}

export async function getEvenements() {
  if (!supabase) {
    throw new Error("Supabase non initialise. Appelez initSupabase d'abord.");
  }
  const { data, error } = await supabase
    .from("evenements")
    .select("*, profiles(nom)")
    .order("date_debut", { ascending: true });

  if (error) throw error;
  return data;
}
