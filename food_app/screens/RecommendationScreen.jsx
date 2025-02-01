import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RecommendationScreen = () => {
  const navigation = useNavigation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1186; // Pass the required user_id

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post("http://192.168.135.50:8000/recommend/", {
        user_id: userId,
        num_recommendations: 5,
      });

      setRecommendations(response.data.recommended_items);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBurgerItem = ({ item }) => (
    <View style={styles.burgerCard}>
      <Image
        source={require("../assets/images/berger.png")}
        style={styles.burgerImage}
      />
      <Text style={styles.burgerName}>{item.menu_name}</Text>
      <Text style={styles.similarityScore}>
        Similarity Score: {item.similarity_score.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={recommendations}
        renderItem={renderBurgerItem}
        keyExtractor={(item) => item.menu_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.logoText}>Foodgo</Text>
                <Text style={styles.subText}>Order your favourite food!</Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput placeholder="Search" style={styles.searchInput} />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="menu" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color="#ff4757" />}
          </>
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="recommend" size={24} color="#ff4757" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="heart-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatListContent: {
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subText: {
    color: "#666",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: "#ff4757",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  burgerCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    margin: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  burgerImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  burgerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  similarityScore: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    height: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navButton: {
    padding: 10,
  },
});

export default RecommendationScreen;
