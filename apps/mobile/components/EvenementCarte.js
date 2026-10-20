import { Link } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function EvenementCarte({ evenement }) {
  const prix =
    evenement.prix === 0
      ? "Gratuit"
      : `${evenement.prix} FCFA`;

  return (
    <Link href={`/evenement/${evenement.id}`} asChild>
      <Pressable style={styles.carte}>
        {evenement.image_url && (
          <Image
            source={{ uri: evenement.image_url }}
            style={styles.image}
          />
        )}
        <View style={styles.contenu}>
          <Text style={styles.titre}>{evenement.titre}</Text>
          <Text style={styles.lieu}>{evenement.lieu_nom}</Text>
          <View style={styles.pied}>
            <Text style={styles.categorie}>{evenement.categorie}</Text>
            <Text style={styles.prix}>{prix}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 160,
  },
  contenu: {
    padding: 12,
  },
  titre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a3a5c",
    marginBottom: 4,
  },
  lieu: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  pied: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categorie: {
    fontSize: 12,
    color: "#ea7d2b",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  prix: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a3a5c",
  },
});
