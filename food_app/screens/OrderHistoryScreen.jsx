import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { MaterialIcons } from "@expo/vector-icons"

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()

  const fetchOrders = useCallback(async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("phone_number")
      if (!phoneNumber) {
        Alert.alert("Error", "Phone number not found. Please login.")
        return
      }

      const response = await fetch(`http://192.168.135.50:8000/get_orders/${phoneNumber}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
      } else {
        Alert.alert("Error", data.detail || "Failed to fetch orders.")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchOrders()
  }, [fetchOrders])

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Ionicons name="fast-food-outline" size={24} color="#ff4757" />
        <Text style={styles.burgerName}>{item.name}</Text>
      </View>
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={18} color="#666" />
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.time}>Ordered At: {item.ordered_time}</Text>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ff4757" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Orders</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4757" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ccc" />
          <Text style={styles.noOrders}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff4757"]} />}
        />
      )}

<View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Recommendation")}>
          <MaterialIcons name="recommend" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} >
        <MaterialIcons name="shopping-cart" size={24} color="#ff4757" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrders: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  burgerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  orderDetails: {
    marginLeft: 32,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantity: {
    fontSize: 16,
    color: "#444",
    marginLeft: 8,
  },
  time: {
    fontSize: 14,
    color: "#777",
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
  },
  centerButton: {
    backgroundColor: '#ff4757',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
})

