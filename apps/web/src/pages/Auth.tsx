import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  const navigate = useNavigate();

  const soumettre = async (event: React.FormEvent) => {
    event.preventDefault();
    setErreur(null);
    setMessage(null);
    setEnCours(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: motDePasse,
          options: {
            data: { nom },
          },
        });

        if (error) throw error;

        // Si l'utilisateur existe déjà, Supabase renvoie une liste d'identités vide
        if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
          throw new Error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter.");
        }

        // Si une session est créée immédiatement
        if (data.session && data.user) {
          const { error: e2 } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              nom,
              role: "PUBLIC",
            });

          if (e2) throw e2;
          navigate("/");
        } else {
          setMessage(
            "Compte créé avec succès ! Veuillez vérifier votre boîte email pour confirmer votre compte avant de vous connecter."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: motDePasse,
        });

        if (error) throw error;
        navigate("/");
      }
    } catch (e: any) {
      let msg = e.message;
      if (msg?.includes("Email not confirmed")) {
        msg = "Votre adresse email n'est pas encore confirmée. Veuillez vérifier le lien reçu dans votre boîte de réception.";
      } else if (msg?.includes("Invalid login credentials")) {
        msg = "Adresse email ou mot de passe incorrect.";
      } else if (msg?.includes("Email address") && msg?.includes("is invalid")) {
        msg = "L'adresse email saisie n'est pas valide.";
      } else if (msg?.includes("User already registered") || msg?.includes("already registered")) {
        msg = "Un compte existe déjà avec cette adresse email. Veuillez vous connecter.";
      }
      setErreur(msg);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={soumettre}>
      <h2>
        {mode === "signup"
          ? "Créer un compte"
          : "Se connecter"}
      </h2>

      {message && (
        <p className={styles.succes}>{message}</p>
      )}

      {mode === "signup" && (
        <label className={styles.champ}>
          Nom d'affichage
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>
      )}

      <label className={styles.champ}>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className={styles.champ}>
        Mot de passe
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          minLength={6}
          required
        />
      </label>

      {erreur && (
        <p className={styles.erreur}>{erreur}</p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className={styles.bouton}
      >
        {enCours
          ? "..."
          : mode === "signup"
          ? "Créer le compte"
          : "Se connecter"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signup" ? "login" : "signup");
          setErreur(null);
          setMessage(null);
        }}
        className={styles.basculer}
      >
        {mode === "signup"
          ? "Déjà un compte ? Se connecter"
          : "Pas encore de compte ? Créer"}
      </button>
    </form>
  );
};

export default Auth;
