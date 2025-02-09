import { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"

const RecommendationScreen = () => {
  const navigation = useNavigation()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(null)

  useEffect(() => {
    getPhoneNumber()
  }, [])

  const getPhoneNumber = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("phone_number")
      if (storedPhoneNumber) {
        setPhoneNumber(storedPhoneNumber)
        fetchRecommendations(storedPhoneNumber)
      } else {
        Alert.alert("Error", "Please login first")
        navigation.navigate("SignIn")
      }
    } catch (error) {
      console.error("Error retrieving phone number:", error)
      setLoading(false)
    }
  }

  const fetchRecommendations = async (phone) => {
    try {
      const response = await axios.post("http://192.168.135.50:8000/recommend/", {
        Phone_Number: phone,
        num_recommendations: 2,
      })

      setRecommendations(response.data.recommended_items)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      Alert.alert("Error", "Failed to fetch recommendations")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchRecommendations(phoneNumber)
  }, [phoneNumber, fetchRecommendations]) // Added fetchRecommendations to dependencies

  const renderBurgerItem = ({ item, index }) => (
    <TouchableOpacity style={styles.burgerCard}>
      <Image
        source={
          index === 0
            ? require("../assets/images/berger.png")
            : require("../assets/images/hot-chocolate.jpg")
        }
        style={styles.burgerImage}
      />
      <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]} style={styles.gradientOverlay}>
        <Text style={styles.burgerName}>{item.menu_name}</Text>
        {/* <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.similarity_score.toFixed(1)}</Text>
        </View> */}
      </LinearGradient>
    </TouchableOpacity>
  )
  

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={recommendations}
        renderItem={renderBurgerItem}
        keyExtractor={(item) => item.menu_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff4757"]} />}
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
                <TextInput placeholder="Search for food..." style={styles.searchInput} />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.saleTxt}>Today's Picks</Text>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff4757" />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No recommendations available</Text>
            </View>
          )
        }
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="recommend" size={24} color="#ff4757" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("OrderHistory")}>
        <MaterialIcons name="shopping-cart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4757",
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
    fontSize: 16,
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
    margin: 5,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  burgerImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 10,
  },
  burgerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
  },
  saleTxt: {
    color: "#333",
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "bold",
  },
})

export default RecommendationScreen

