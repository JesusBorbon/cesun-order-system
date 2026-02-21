import React from 'react';
import { StyleSheet, FlatList, ScrollView, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar'; // Para controlar la barra de estado
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['Todo', 'Cafetería', 'Snacks', 'Papelería', 'Bebidas'];
const PRODUCTS = [
  { id: '1', name: 'Latte Vainilla', price: '$45', category: 'Cafetería', icon: 'cafe-outline' },
  { id: '2', name: 'Cuaderno Profesional', price: '$65', category: 'Papelería', icon: 'book-outline' },
  { id: '3', name: 'Sándwich Integral', price: '$55', category: 'Cafetería', icon: 'fast-food-outline' },
  { id: '4', name: 'Pluma Gel Negra', price: '$15', category: 'Papelería', icon: 'pencil-outline' },
];

export default function HomeScreen() {
  return (
    // SafeAreaView evita que el contenido se pegue a la cámara o notch
    <SafeAreaView style={styles.container}>
      {/* Esto hará que la barra de la hora sea transparente con iconos oscuros */}
      <StatusBar style="dark" backgroundColor="#F7F9F8" translucent={false} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.welcomeText}>Buen día, Estudiante</ThemedText>
            <ThemedText type="title" style={styles.brandText}>Cesun Order</ThemedText>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={28} color="#2D4F4F" />
          </TouchableOpacity>
        </View>

        {/* Selector de Categorías */}
        <View style={{ height: 50, marginBottom: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity key={index} style={[styles.categoryBadge, index === 0 && styles.activeCategory]}>
                <ThemedText style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>{cat}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={PRODUCTS}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.productRow}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={40} color="#5F8575" />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.productName}>{item.name}</ThemedText>
              <ThemedText style={styles.productCategory}>{item.category}</ThemedText>
              <ThemedText type="subtitle" style={styles.productPrice}>{item.price}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F8', // Fondo principal claro
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
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
  },
  categoriesList: { alignItems: 'center', gap: 10 },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E7E4',
  },
  activeCategory: { backgroundColor: '#5F8575', borderColor: '#5F8575' },
  categoryText: { color: '#5F8575', fontSize: 14 },
  activeCategoryText: { color: '#FFFFFF' },
  productRow: { justifyContent: 'space-between', marginBottom: 15 },
  productCard: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F4F2',
  },
  iconContainer: {
    backgroundColor: '#F0F7F4',
    padding: 20,
    borderRadius: 60,
    marginBottom: 10,
  },
  productName: { fontSize: 15, color: '#2D4F4F', textAlign: 'center' },
  productCategory: { fontSize: 12, color: '#8A9A94', marginBottom: 5 },
  productPrice: { color: '#5F8575', fontSize: 18 },
});