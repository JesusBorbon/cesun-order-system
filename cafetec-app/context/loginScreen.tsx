import React, { createContext, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';

interface UserType {
  email: string;
  Token?: string;
}

export const UserContext = createContext<{
  user: UserType | null;
  setUser: (user: UserType | null) => void;
} | undefined>(undefined);

export function LoginUser({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");

  const handleRegister = async () => {
    setMensaje("Cargando... intentando registrar.");
    try {
      console.log("Enviando petición de registro...");
      const response = await fetch("http://localhost:8081/register", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          password: password,
        }),
      });

      if (response.ok) {
        setMensaje("¡Éxito! Usuario creado. Ya puedes iniciar sesión.");
        setIsRegistering(false);
      } else {
        const errorText = await response.text();
        setMensaje("Error del servidor: " + errorText);
      }
    } catch (error) {
      console.log("Error detectado en catch:", error);
      setMensaje("Error de conexión. ¿Está encendido el servidor Go?");
    }
  };

  const handleLogin = async () => {
    setMensaje("Cargando... intentando entrar.");
    try {
      console.log("Enviando petición de login...");
      const response = await fetch("http://localhost:8081/login", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          password: password,
        }),
      });

      if (response.ok) {
        setMensaje("¡Login exitoso! Redirigiendo...");
        const data = await response.json();
        setUser({ email: data.user_email, Token: data.token });
      } else {
        const errorText = await response.text();
        setMensaje("Error al entrar: " + errorText);
      }
    } catch (error) {
      console.log("Error detectado en catch:", error);
      setMensaje("Error de red. El frontend no alcanza al backend.");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user ? (
        children
      ) : (
        <View style={styles.container}>
          <Image
            source={require('../assets/logo-cesun.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>{isRegistering ? "Crear Cuenta" : "Login Cesun"}</Text>

          {mensaje !== "" && (
            <Text style={styles.mensajeVisual}>{mensaje}</Text>
          )}

          <TextInput
            placeholder="Correo institucional"
            placeholderTextColor="#99A9C3"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#99A9C3"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8} // Suavizado al presionar el botón principal
            onPress={isRegistering ? handleRegister : handleLogin}
          >
            <Text style={styles.buttonText}>{isRegistering ? "Registrarme" : "Entrar"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5} // Efecto de desvanecimiento suave para el enlace de texto
            onPress={() => {
              setIsRegistering(!isRegistering);
              setMensaje("");
            }}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate aquí"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 25,
    // Sombra sutil para el logo si tiene fondo transparente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3465D9',
    marginBottom: 25,
    letterSpacing: 0.5, // Separa un poco las letras para mayor elegancia
  },
  mensajeVisual: {
    color: '#C955FF',
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  button: {
    width: '90%',
    backgroundColor: '#3465D9',
    borderRadius: 14, // Bordes ligeramente más suaves
    padding: 16,
    marginTop: 15,
    // Sombra más definida para dar relieve al botón
    elevation: 4,
    shadowColor: '#3465D9', // La sombra toma el color del botón
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  input: {
    borderColor: '#E2E8F0', // Borde gris muy suave cuando no está seleccionado
    borderWidth: 1.5,
    padding: 16,
    width: "90%",
    borderRadius: 12,
    marginBottom: 16,
    color: '#333333',
    backgroundColor: '#F8F9FB',
    fontSize: 16,
    // Sombra muy ligera para quitar lo plano al input
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  switchButton: {
    marginTop: 25,
    padding: 10, // Aumenta el área táctil para que sea más fácil de presionar
  },
  switchText: {
    color: '#3465D9',
    fontSize: 15,
    fontWeight: '600',
  }
});