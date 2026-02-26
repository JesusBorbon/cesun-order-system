import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../constants/Products';

export default function HomeScreen() {
  const { addToCart, totalItems } = useCart();

  // Estado manual para saber qué categoría está seleccionada
  const [categoriaActual, setCategoriaActual] = useState('Todo');

  // Filtramos los productos según la categoría elegida
  const productosFiltrados = categoriaActual === 'Todo'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === categoriaActual);

  const renderProducto = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price}.00</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>  +  </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado Azul Cesun */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Bienvenido a</Text>
          <Text style={styles.headerTitle}>Cafetería Cesun</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} activeOpacity={0.8}>
          <Text style={styles.cartText}>🛒 {totalItems}</Text>
        </TouchableOpacity>
      </View>

      {/* BARRA DE CATEGORÍAS (Nav de filtros) */}
      <View style={styles.navContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollNav}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoriaActual(cat)}
              style={[
                styles.categoryTab,
                categoriaActual === cat && styles.categoryTabActive
              ]}
            >
              <Text style={[
                styles.categoryTabText,
                categoriaActual === cat && styles.categoryTabTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Pide y espera la señal para recoger.
        </Text>
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProducto}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    backgroundColor: '#3465D9',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerSubtitle: { color: '#E0E7FF', fontSize: 14 },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  cartButton: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20 },
  cartText: { color: '#3465D9', fontWeight: 'bold' },

  // Estilos de la nueva Barra de Navegación/Filtros
  navContainer: {
    marginTop: 15,
    height: 50,
  },
  scrollNav: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryTabActive: {
    backgroundColor: '#3465D9', // Se vuelve azul al estar activo
    borderColor: '#3465D9',
  },
  categoryTabText: {
    color: '#64748B',
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },

  banner: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#C955FF',
  },
  bannerText: { color: '#64748B', fontSize: 13 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  cardInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  productCategory: { fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 5 },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#C955FF' },
  addButton: { backgroundColor: '#3465D9', borderRadius: 12, padding: 10, marginLeft: 15},
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 20},
});