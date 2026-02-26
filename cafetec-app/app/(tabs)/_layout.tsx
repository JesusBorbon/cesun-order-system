import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Cambiamos el verde por el Azul de Cesun para los iconos activos
  const activeColor = '#3465D9';
  const inactiveColor = '#94A3B8'; // Gris azulado suave para lo no seleccionado

  return (
    <Tabs
      screenOptions={{
        // Color de los iconos y texto cuando están seleccionados
        tabBarActiveTintColor: activeColor,
        // Color cuando no están seleccionados
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
                  height: 110,
                  paddingBottom: 20,
                  paddingTop: 10,
                  backgroundColor: '#FFFFFF',
                  borderTopWidth: 0,
                  elevation: 15,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                  marginTop: 5,
                }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="fast-food" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color }) => <Ionicons size={26} name="cart" color={color} />,
        }}
      />
    </Tabs>
  );
}