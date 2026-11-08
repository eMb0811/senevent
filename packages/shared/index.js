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

export function getSupabase() {
  if (!supabase) {
    throw new Error("Supabase non initialise. Appelez initSupabase d'abord.");
  }
  return supabase;
}

export async function getEvenements() {
  const client = getSupabase();
  const { data, error } = await client
    .from("evenements")
    .select("*, profiles(nom)")
    .order("date_debut", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function creerEvenement(input) {
  const client = getSupabase();
  if (input.organisateur_id) {
    const { data: userData } = await client.auth.getUser();
    const email = userData?.user?.email ?? "utilisateur";
    const nom = userData?.user?.user_metadata?.nom || email.split("@")[0];
    await client.from("profiles").upsert(
      { id: input.organisateur_id, nom, role: "PUBLIC" },
      { onConflict: "id", ignoreDuplicates: true }
    );
  }

  const images = {
    concert: "https://placehold.co/400x250/1a3a5c/fff?text=Concert",
    expo: "https://placehold.co/400x250/ea7d2b/fff?text=Expo",
    conference: "https://placehold.co/400x250/3aa84d/fff?text=Conference",
    atelier: "https://placehold.co/400x250/cc1f1f/fff?text=Atelier",
    soutenance: "https://placehold.co/400x250/8a6d10/fff?text=Soutenance",
  };

  const payload = {
    ...input,
    image_url: input.image_url || images[input.categorie] || images.concert,
  };

  const { data, error } = await client
    .from("evenements")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function seConnecter(email, motDePasse) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password: motDePasse,
  });
  if (error) throw error;
  return data;
}

export async function sInscrire(email, motDePasse) {
  const client = getSupabase();
  const nom = email.split("@")[0];
  const { data, error } = await client.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { nom } },
  });
  if (error) throw error;

  if (data?.user && data?.session) {
    await client.from("profiles").upsert({
      id: data.user.id,
      nom,
      role: "PUBLIC",
    });
  }
  return data;
}

export async function seDeconnecter() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function estInscrit(evenementId, utilisateurId) {
  const { data, error } = await getSupabase()
    .from("inscriptions")
    .select("id")
    .eq("evenement_id", evenementId)
    .eq("utilisateur_id", utilisateurId);

  if (error) throw error;
  return Boolean(data && data.length > 0);
}

export async function inscrire(evenementId, utilisateurId) {
  const { data, error } = await getSupabase()
    .from("inscriptions")
    .insert({
      evenement_id: evenementId,
      utilisateur_id: utilisateurId,
    });

  if (error) throw error;
  return data;
}

export async function desinscrire(evenementId, utilisateurId) {
  const { error } = await getSupabase()
    .from("inscriptions")
    .delete()
    .eq("evenement_id", evenementId)
    .eq("utilisateur_id", utilisateurId);

  if (error) throw error;
}
