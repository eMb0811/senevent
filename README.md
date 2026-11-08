# SénEvent — Catalogue d'événements à Dakar

Application Web (React + Vite) et Mobile (React Native + Expo Router) partageant une logique métier commune via le package `@senevent/shared` et adossée à Supabase (PostgreSQL, Auth, Row Level Security).

## Architecture du Monorepo

- `apps/web` : Application Web SPA (React, React Router, Vite)
- `apps/mobile` : Application Mobile native (React Native, Expo Router, EAS)
- `packages/shared` : Logique métier partagée (`@senevent/shared` : client Supabase, authentification, événements, inscriptions)
- `supabase/migrations` : Schéma PostgreSQL, politiques RLS et données initiales

## En ligne

- Application web : https://senevent-equipe-1.vercel.app
- Deploiement continu : chaque merge sur main met la production a jour, chaque Pull Request recoit une URL de previsualisation.
- Application Android (APK) : https://expo.dev/accounts/mouhamet-barry/projects/senevent/builds/9c7e4a12-6b3d-4e8f-a1b2-5d8e9f0c3a21
- Version mobile : 1.0.0 (profil EAS "preview")

## Lancer le projet en local

- npm install a la racine
- Web : apps/web, creer .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY), npm run dev
- Mobile : apps/mobile, creer .env (EXPO_PUBLIC_...), npx expo start
