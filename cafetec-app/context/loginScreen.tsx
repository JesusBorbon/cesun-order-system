import React, { createContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  const handleRegister = async () => {
    try {
      const response = await fetch("http://192.168.1.73:8080/register", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          password: password,
        }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Usuario creado. Ahora puedes iniciar sesión.");
        setIsRegistering(false);
      } else {
        const data = await response.json();
        Alert.alert("Error", data.error || "No se pudo registrar");
      }
    } catch (error) {
      Alert.alert("Error de conexión", "Error al conectar con el servidor");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.73:8080/login", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          password: password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser({ email: data.user_email, Token: data.token });
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "Error al conectar con el servidor");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user ? (
        children
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{isRegistering ? "Crear Cuenta" : "Login Cesun"}</Text>

          <TextInput
            placeholder="Correo institucional"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isRegistering ? handleRegister : handleLogin}
          >
            <Text style={styles.buttonText}>{isRegistering ? "Registrarme" : "Entrar"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue' }}>
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
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20
  },
  button: {
    width: '90%',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    width: "90%",
    borderRadius: 10,
    marginBottom: 15
  }
});
