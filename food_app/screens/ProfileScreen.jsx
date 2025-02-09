import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    location: "",
    Phone_Number: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("phone_number")
      if (phoneNumber) {
        const response = await axios.get(`http://192.168.135.50:8000/profile/${phoneNumber}`)
        setUserData(response.data)
        console.log("in the profile", response.data)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      Alert.alert("Error", "Failed to load user profile")
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`http://192.168.135.50:8000/profile/${userData.Phone_Number}`, userData)
      setUserData(response.data)
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "Failed to update profile")
    }
  }
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("phone_number");
      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      })
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const renderField = (label, key) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing && key !== "Phone_Number" ? (
        <TextInput
          style={styles.input}
          value={userData[key]}
          onChangeText={(text) => setUserData({ ...userData, [key]: text })}
        />
      ) : (
        <Text style={styles.fieldValue}>{userData[key]}</Text>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section with curved bottom */}
      <View style={styles.profileSection}>{/* Add profile image here if needed */}</View>

      {/* Profile Details */}
      <ScrollView style={styles.detailsSection}>
        {renderField("Name", "full_name")}
        {renderField("Email", "email")}
        {renderField("Location", "location")}
        {renderField("Phone Number", "Phone_Number")}

        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSaveProfile : handleEditProfile}>
            <Ionicons name={isEditing ? "save-outline" : "create-outline"} size={20} color="#fff" />
            <Text style={styles.editButtonText}>{isEditing ? "Save Profile" : "Edit Profile"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff4757" />
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Recommendation")}>
          <MaterialIcons name="recommend" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("OrderHistory")}>
        <MaterialIcons name="shopping-cart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ff4757',
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: '#ff4757',
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    padding: 3,
    marginBottom: -30,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  detailsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  fieldValue: {
    color: '#000',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  passwordDots: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  passwordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginRight: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ff4757',
  },
  logoutButtonText: {
    color: '#ff4757',
    marginLeft: 8,
    fontSize: 16,
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

export default ProfileScreen;