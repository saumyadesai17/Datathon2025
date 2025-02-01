
import { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"

export default function DetailScreen({ route, navigation }) {
  const [quantity, setQuantity] = useState(1)
  const [spiciness, setSpiciness] = useState(2)
  const { burger } = route.params

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
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{burger.rating}</Text>
            <Text style={styles.time}>• 25 mins</Text>
          </View>
        </View>

        <Text style={styles.description}>
          The {burger.name} is a classic fast food burger that makes a punch of flavor in every bite. Made with a juicy
          beef patty cooked to perfection, it's topped with melted American cheese, crispy lettuce, ripe tomato, and
          crunchy pickles.
        </Text>

        {/* Spiciness Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Spicy</Text>
          <View style={styles.sliderRow}>
            <Text>Mild</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={4}
              value={spiciness}
              onValueChange={setSpiciness}
              minimumTrackTintColor="#ff4757"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#ff4757"
            />
            <Text>Hot</Text>
          </View>
        </View>

        {/* Portion Selector */}
        <View style={styles.portionContainer}>
          <Text style={styles.portionLabel}>Portion</Text>
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
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${(8.24 * quantity).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>ORDER NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
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

