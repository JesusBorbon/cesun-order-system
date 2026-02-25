import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importamos el router
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  userName: string;
}

export const Header = ({ userName }: HeaderProps) => {
  const { totalItems } = useCart();
  const router = useRouter(); // Inicializamos el router

  return (
    <View style={styles.header}>
      <View>
        <ThemedText style={styles.welcomeText}>Buen día, {userName}</ThemedText>
        <ThemedText type="title" style={styles.brandText}>Cesun Order</ThemedText>
      </View>

      {/* CORRECCIÓN: Usamos router.push en lugar de llamar al componente directamente */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push('/cart')}
      >
        <Ionicons name="cart-outline" size={28} color="#2D4F4F" />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{totalItems}</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcomeText: { color: '#8A9A94', fontSize: 14 },
  brandText: { color: '#2D4F4F', fontSize: 28, fontWeight: 'bold' },
  cartButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
