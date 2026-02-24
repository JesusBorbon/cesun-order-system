import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/context/CartContext'; // Importamos el carrito

interface HeaderProps {
  userName: string;
}

export const Header = ({ userName }: HeaderProps) => {
  const { totalItems } = useCart(); // Obtenemos el total de productos

  return (
    <View style={styles.header}>
      <View>
        <ThemedText style={styles.welcomeText}>Buen día, {userName}</ThemedText>
        <ThemedText type="title" style={styles.brandText}>Cesun Order</ThemedText>
      </View>
      <TouchableOpacity style={styles.cartButton}>
        <Ionicons name="cart-outline" size={28} color="#2D4F4F" />
        {/* Mostramos el contador solo si hay productos */}
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
  },
  welcomeText: { color: '#8A9A94', fontSize: 14 },
  brandText: { color: '#2D4F4F', fontSize: 28 },
  cartButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    position: 'relative', // Necesario para posicionar el badge
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
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});