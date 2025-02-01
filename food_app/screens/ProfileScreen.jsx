import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with back button and settings */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* Profile Section with curved bottom */}
      <View style={styles.profileSection}>
        {/* Profile Image */}
        {/* <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/images/profile-pic.jpg')}
            style={styles.profileImage}
          /> 
        </View> */}
      </View>

      {/* Profile Details */}
      <ScrollView style={styles.detailsSection}>
        {/* Profile Fields */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>Sophia Patel</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>sophiapatel@gmail.com</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Location</Text>
          <Text style={styles.fieldValue}>Vasai</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Phone Number</Text>
          <Text style={styles.fieldValue}>9322764396</Text>
        </View>

        {/* <View style={styles.field}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.passwordDots}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.passwordDot} />
            ))}
          </View>
        </View> */}

        {/* Action Buttons */}
        {/* <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Payment Details</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Order history</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity> */}

        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ff4757" />
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} 
        onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} 
        onPress={() => navigation.navigate('Recommendation')}
        >
            
          <MaterialIcons name="recommend" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="heart-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}
        onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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