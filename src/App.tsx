import { useState, useEffect } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import styles from "./pages/Accueil.module.css";
import EtatChargement from "./components/EtatChargement";
import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import NouvelEvenement from "./pages/NouvelEvenement";
import Detail from "./pages/Detail";
import Auth from "./pages/Auth";
import NavBar from "./components/NavBar";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Écouter les changements de session
    const { data: subscription } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

const charger = async () => {
  try {
    setChargement(true);
    setErreur(null);

    const { data, error } = await supabase
      .from("evenements")
      .select("*")
      .order("date_debut", { ascending: true });

    if (error) throw error;

    setEvenements(data);
  } catch (e) {
    setErreur(e.message);
  } finally {
    setChargement(false);
  }
};
  useEffect(() => {
    charger();
  }, []);


  return (
    <BrowserRouter>
      <NavBar session={session} />

      <Routes>
        <Route
          path="/"
          element={
            <Accueil
              evenements={evenements}
              chargement={chargement}
              erreur={erreur}
              onReessayer={charger}
            />
          }
        />

        <Route
          path="/nouveau"
          element={
            <NouvelEvenement
              onAjoutReussi={charger}
            />
          }
        />

        <Route
          path="/evenement/:id"
          element={
            <Detail evenements={evenements} />
          }
        />

        <Route
          path="/auth"
          element={<Auth />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
