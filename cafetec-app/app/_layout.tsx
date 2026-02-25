import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CartProvider } from '@/context/CartContext';
import { LoginUser } from '@/context/loginScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 1. LoginUser es la base. Si user es null, mostrará el formulario de Login/Registro.
    <LoginUser>
      {/* 2. CartProvider: El carrito solo existe si hay alguien logueado */}
      <CartProvider>
        {/* 3. El tema (Dark/Light) se aplica a la navegación */}
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

          <Stack>
            {/* Pantalla principal de la App (Tabs) */}
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />


          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </CartProvider>
    </LoginUser>
  );
}
