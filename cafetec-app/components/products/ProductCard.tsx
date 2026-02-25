import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
// 1. Importamos el hook del carrito
import { useCart } from '@/context/CartContext';

interface Product {
  id: string; // Añadimos ID para que el carrito sepa cuál es cuál
  name: string;
  price: string;
  category: string;
  icon: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  // 2. Extraemos la función addToCart del contexto
  const { addToCart } = useCart();

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={product.icon as any} size={40} color="#5F8575" />
      </View>
      <ThemedText type="defaultSemiBold" style={styles.name}>{product.name}</ThemedText>
      <ThemedText style={styles.category}>{product.category}</ThemedText>

      <View style={styles.footer}>
        <ThemedText type="subtitle" style={styles.price}>{product.price}</ThemedText>

        {/* 3. Conectamos el botón con la función */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // LIMPIEZA DE DATOS:
            // 1. Quitamos el símbolo '$' y cualquier espacio
            // 2. Lo convertimos a número decimal
            const cleanPrice = parseFloat(product.price.replace('$', '').trim()) || 0;

            // 3. Mandamos el producto con el precio ya como NÚMERO
            addToCart({
              ...product,
              price: cleanPrice
            } as any); // Usamos as any temporalmente para que TS no se queje del cambio string -> number
          }}
        >
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F4F2',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#F0F7F4',
    padding: 20,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: { fontSize: 15, color: '#2D4F4F', textAlign: 'center' },
  category: { fontSize: 12, color: '#8A9A94', marginBottom: 5 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  price: { color: '#5F8575', fontSize: 18 },
  addButton: {
    backgroundColor: '#5F8575',
    padding: 5,
    borderRadius: 10,
    // Un pequeño feedback visual para el usuario
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  }
});
