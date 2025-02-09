// import React from 'react';
import { useEffect,React } from "react"
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
          navigation.replace("SignIn")
        }, 10000)
      }, [navigation]) // Added navigation to dependencies
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Foodgo</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/berger.png')}
          style={styles.burgerImage}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/berger2.png')}
          style={[styles.burgerImage, styles.secondBurger]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4757',
    justifyContent: 'space-between',
    paddingTop: '20%', // Reduced from 40% to match image
  },
  logo: {
    marginTop: '70%', // Increased margin to match the Foodgo text style
    fontSize: 42, // Increased font size
    color: '#ffffff',
    fontWeight: 'bold',
    fontStyle: 'italic', // Added to match the Foodgo text style
    alignSelf: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: -90,
    right: 0,
    justifyContent: 'center',
    paddingBottom: 0,
  },
  burgerImage: {
    width: 180, // Fixed width for better control
    height: 180, // Fixed height for better control
    marginHorizontal: -20, // Negative margin to overlap burgers
  },
  secondBurger: {
    marginLeft: -40, // Additional overlap for second burger
        position: 'relative',
        bottom:-15,

  }
});