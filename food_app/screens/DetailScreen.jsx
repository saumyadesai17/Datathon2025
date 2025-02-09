import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreen({ route, navigation }) {
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const { burger } = route.params;

  // Fetch phone number from AsyncStorage
  useEffect(() => {
    const getPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("phone_number");
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        }
      } catch (error) {
        console.error("Error retrieving phone number:", error);
      }
    };

    getPhoneNumber();
  }, []);

  // Function to Place Order
  const placeOrder = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.135.50:8000/add_order/${phoneNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          burger_name: burger.name,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Order placed successfully!");
      } else {
        Alert.alert("Error", data.detail || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Burger Image */}
      <Image source={burger.image} style={styles.burgerImage} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{burger.name}</Text>
        </View>

        <Text style={styles.description}>
          The {burger.name} is a classic fast food burger that makes a punch of flavor in every bite. Made with a juicy
          beef patty cooked to perfection, it's topped with melted American cheese, crispy lettuce, ripe tomato, and crunchy pickles.
        </Text>

        {/* Portion Selector */}
        <View style={styles.portionContainer}>
          <Text style={styles.portionLabel}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity onPress={() => quantity > 1 && setQuantity(quantity - 1)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
            <Text style={styles.orderButtonText}>ORDER NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
  },
  burgerImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  titleRow: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 5,
    color: "#666",
  },
  time: {
    color: "#666",
    marginLeft: 5,
  },
  description: {
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  portionContainer: {
    marginBottom: 20,
  },
  portionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    color: "#ff4757",
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: "#666",
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4757",
  },
  orderButton: {
    backgroundColor: "#362822",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

