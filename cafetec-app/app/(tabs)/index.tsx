import React, { useState, useMemo } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Header } from '@/components/navigation/Header';
import { CategoryBar } from '@/components/navigation/CategoryBar';
import { ProductList } from '@/components/products/ProductList';
import { PRODUCTS } from '@/constants/Products';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todo');

  // Lógica "Pro": Filtramos solo cuando es necesario
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todo') {
      // Si quieres "randoms", podrías usar: [...PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, 4)
      return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F7F9F8" />
      <View style={styles.content}>
        <Header userName="Estudiante" />

        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductList products={filteredProducts} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9F8' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
});