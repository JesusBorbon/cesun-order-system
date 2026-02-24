import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  icon: string;
}

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.productRow}
      showsVerticalScrollIndicator={false}
      // Cada objeto de la lista se renderiza usando nuestro componente modular
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20, // Espacio al final para que no choque con las pestañas
  },
  productRow: {
    justifyContent: 'space-between',
  },
});