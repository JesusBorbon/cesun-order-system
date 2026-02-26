import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Para la navegación rápida
import { PRODUCTS } from '../../constants/Products';
import { useCart } from '../../context/CartContext';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  // Sacamos addToCart para agregar y totalItems para el contador
  const { addToCart, totalItems } = useCart();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return [];

    return PRODUCTS.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      return nameMatch || categoryMatch;
    });
  }, [searchQuery]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price}.00</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={() => addToCart(item)}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        {/* Cabecera con Título y Contador */}
        <View style={styles.topRow}>
          <Text style={styles.title}>Explorar</Text>

          {/* El acumulador de productos (Contador) */}
          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.8}
            onPress={() => router.push('/cart')}
          >
            <Text style={styles.cartText}>🛒 {totalItems}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="¿Qué se te antoja hoy?"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ... resto de la lógica de la lista (igual que antes) ... */}
      {searchQuery === '' ? (
        <View style={styles.centerContent}>
          <Ionicons name="fast-food-outline" size={80} color="#E2E8F0" />
          <Text style={styles.emptyText}>Busca cafés, snacks o artículos de papelería</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No encontramos nada que coincida con "{searchQuery}"</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  searchHeader: {
    backgroundColor: '#FFF',
    padding: 25,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3465D9', // Azul Cesun
  },
  cartButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cartText: {
    color: '#3465D9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  listContainer: {
    padding: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  productCategory: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C955FF',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3465D9',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 15,
  },
});