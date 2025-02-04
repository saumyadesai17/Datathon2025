import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation('')
    const burgers = [
      {
        id: '1',
        name: 'Cheeseburger',
        rating: 4.9,
        image: require('../assets/images/berger.png')
      },
      {
        id: '2',
        name: 'French Fries',
        rating: 4.8,
        image: require('../assets/images/fries.jpg')
      },
      {
        id: '3',
        name: 'Chicken Sandwich',
        rating: 4.7,
        image: require('../assets/images/chicken_sandwich.jpg')
      },
      {
        id: '4',
        name: 'Veggie Burger',
        rating: 4.6,
        image: require('../assets/images/veggie_burger.jpg')
      },
      {
        id: '5',
        name: 'BBQ Bacon Burger',
        rating: 4.9,
        image: require('../assets/images/bbq_bacon_burger.jpg')
      },
      {
        id: '6',
        name: 'Crispy Chicken Tenders',
        rating: 4.7,
        image: require('../assets/images/chicken_tenders.jpg')
      },
      {
        id: '7',
        name: 'Spicy Nacho Fries',
        rating: 4.5,
        image: require('../assets/images/nacho_fries.jpg')
      },
    ];

  const renderBurgerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.burgerCard}
      onPress={() => navigation.navigate('Detail', { burger: item })}
    >
      <Image source={item.image} style={styles.burgerImage} />
      <Text style={styles.burgerName}>{item.name}</Text>
      {/* <Text style={styles.restaurantName}>{item.restaurant}</Text> */}
      <View style={styles.ratingContainer}>
        {/* <Ionicons name="star" size={16} color="#FFD700" /> */}
        {/* <Text style={styles.rating}>{item.rating}</Text> */}
        {/* <TouchableOpacity 
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
            // Add heart/favorite functionality here
          }}
        >
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
    <FlatList
      data={burgers}
      renderItem={renderBurgerItem}
      keyExtractor={item => item.id}
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
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      }
      ListFooterComponent={<View style={styles.footer} />}
    />

    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="#ff4757" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navButton}          
        onPress={() => navigation.navigate('Recommendation')}
      >
        <MaterialIcons name="recommend" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}
      onPress={() => navigation.navigate("OrderHistory")}
      >
        <MaterialIcons name="shopping-cart" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 80, // Add padding to ensure content is visible above bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    color: '#666',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#ff4757',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommContainer: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  recomm: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  burgerCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  burgerImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  burgerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  heartButton: {
    padding: 4,
  },
  footer: {
    height: 20, // Add some space at the bottom of the list
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
});

export default HomeScreen;