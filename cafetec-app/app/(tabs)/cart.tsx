import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCart } from '../../context/CartContext'; // Ajusta la ruta si es necesario
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>{item.quantity} x ${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#C955FF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Pedido</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar:</Text>
              <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.8}
              onPress={() => {
                /* Aquí irá la lógica para enviar a Go */
                alert("Pedido confirmado. ¡Atento a la señal del cocinero!");
              }}
            >
              <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Mismo fondo que HomeScreen
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3465D9', // Azul Cesun
    marginBottom: 25,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  itemDetail: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  deleteButton: {
    marginTop: 8,
    padding: 5,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: '#64748B',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  confirmButton: {
    backgroundColor: '#3465D9', // Azul Cesun reemplaza al verde
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3465D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#94A3B8',
  }
});