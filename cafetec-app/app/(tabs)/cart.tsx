import { ThemedText } from '@/components/themed-text';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
    const { cart, totalPrice, removeFromCart } = useCart();

    // Renderizado de cada fila del carrito
    const renderItem = ({ item }: { item: any }) => {
        // 1. Aseguramos que el precio sea un número (Esto evita el TypeError)
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;

        // 2. Calculamos el subtotal de esta fila
        const itemTotal = price * quantity;

        return (
            <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemDetails}>
                        {quantity} x ${price.toFixed(2)}
                    </ThemedText>
                </View>
                <View style={styles.rightSection}>
                    <ThemedText style={styles.itemTotal}>
                        ${itemTotal.toFixed(2)}
                    </ThemedText>
                    <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ThemedText type="title" style={styles.header}>Mi Pedido</ThemedText>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
                        <ThemedText style={styles.emptyText}>Tu carrito está vacío</ThemedText>
                    </View>
                }
            />

            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <ThemedText style={styles.totalLabel}>Total a pagar:</ThemedText>
                        <ThemedText style={styles.totalAmount}>${totalPrice.toFixed(2)}</ThemedText>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => console.log("Enviando pedido a Go Backend...", cart)}
                    >
                        <ThemedText style={styles.checkoutText}>Confirmar Pedido</ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20, paddingTop: 60 },
    header: { marginBottom: 20, color: '#1F2937' },
    listContent: { paddingBottom: 100 },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemDetails: { color: '#6B7280', fontSize: 14 },
    rightSection: { alignItems: 'flex-end' },
    itemTotal: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
    deleteButton: { padding: 5 },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#9CA3AF', marginTop: 10, fontSize: 18 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    totalLabel: { fontSize: 18, color: '#4B5563' },
    totalAmount: { fontSize: 24, fontWeight: '800', color: '#111827' },
    checkoutButton: {
        backgroundColor: '#5F8575',
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    checkoutText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
