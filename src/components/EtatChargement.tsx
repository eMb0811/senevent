import styles from "./EtatChargement.module.css";

const EtatChargement = ({ chargement, erreur, onReessayer }) => {
  if (chargement) {
    return <p className={styles.chargement}>Chargement...</p>;
  }

  if (erreur) {
    return (
      <div className={styles.erreur}>
        <p>Erreur: {erreur}</p>
        <button onClick={onReessayer} className={styles.bouton}>
          Réessayer
        </button>
      </div>
    );
  }

  return null;
};

export default EtatChargement;
