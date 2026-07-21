-- Tout le monde peut lire les événements (même anonyme)
CREATE POLICY "evenements_select_public"
ON public.evenements
FOR SELECT
USING (true);

-- Un utilisateur authentifié peut créer un événement
-- et doit être l'organisateur de celui-ci
CREATE POLICY "evenements_insert_auth"
ON public.evenements
FOR INSERT
TO authenticated
WITH CHECK (organisateur_id = auth.uid());

-- Seul l'organisateur peut modifier son événement
CREATE POLICY "evenements_update_owner"
ON public.evenements
FOR UPDATE
TO authenticated
USING (organisateur_id = auth.uid());

-- Seul l'organisateur peut supprimer son événement
CREATE POLICY "evenements_delete_owner"
ON public.evenements
FOR DELETE
TO authenticated
USING (organisateur_id = auth.uid());

-- =========================
-- PROFILES
-- =========================

-- Lecture publique
CREATE POLICY "profiles_select_public"
ON public.profiles
FOR SELECT
USING (true);

-- Un utilisateur peut créer son propre profil uniquement
CREATE POLICY "profiles_insert_self"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Un utilisateur peut modifier uniquement son profil
CREATE POLICY "profiles_update_self"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- =========================
-- INSCRIPTIONS
-- =========================

-- Lecture publique
CREATE POLICY "inscriptions_select_public"
ON public.inscriptions
FOR SELECT
USING (true);

-- Un utilisateur ne peut s'inscrire qu'en son nom
CREATE POLICY "inscriptions_insert_self"
ON public.inscriptions
FOR INSERT
TO authenticated
WITH CHECK (utilisateur_id = auth.uid());

-- Un utilisateur ne peut supprimer que ses propres inscriptions
CREATE POLICY "inscriptions_delete_self"
ON public.inscriptions
FOR DELETE
TO authenticated
USING (utilisateur_id = auth.uid());
