package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"

    "cloud.google.com/go/firestore"
    firebase "firebase.google.com/go/v4"
    "golang.org/x/crypto/bcrypt"
    "google.golang.org/api/iterator"
    "google.golang.org/api/option"
)

type Order struct {
    ID        string    `json:"id" firestore:"id"`
    UserEmail string    `json:"user_email" firestore:"user_email"`
    Items     []string  `json:"items" firestore:"items"`
    Total     float64   `json:"total" firestore:"total"`
    Status    string    `json:"status" firestore:"status"`
    CreatedAt time.Time `json:"created_at" firestore:"created_at"`
}

type User struct {
    UserEmail string  `json:"user_email" firestore:"user_email"`
    Token     *string `json:"token,omitempty" firestore:"token,omitempty"`
    Password  string  `json:"password" firestore:"password"`
}

var client *firestore.Client

func enableCORS(w *http.ResponseWriter, r *http.Request) bool {
    (*w).Header().Set("Access-Control-Allow-Origin", "*")
    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")

    if r.Method == "OPTIONS" {
       (*w).WriteHeader(http.StatusOK)
       return true
    }
    return false
}

func main() {
    ctx := context.Background()
    sa := option.WithServiceAccountFile("serviceAccount.json")

    app, err := firebase.NewApp(ctx, nil, sa)
    if err != nil {
       log.Fatalf("Error inicializando Firebase: %v", err)
    }

    client, err = app.Firestore(ctx)
    if err != nil {
       log.Fatalf("Error conectando a Firestore: %v", err)
    }
    defer client.Close()

    http.HandleFunc("/create-order", createOrderHandler)
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
       w.Write([]byte("Servidor en línea"))
    })
    http.HandleFunc("/show-orders", showOrderHandler)
    http.HandleFunc("/login", loginUserHandler)
    http.HandleFunc("/register", registerUserHandler)

    fmt.Println("Servidor escuchando en http://localhost:8081")
    log.Fatal(http.ListenAndServe(":8081", nil))
}

func loginUserHandler(w http.ResponseWriter, r *http.Request) {
    if enableCORS(&w, r) {
       return
    }
    if r.Method != http.MethodPost {
       http.Error(w, "Metodo no valido", http.StatusMethodNotAllowed)
       return
    }

    ctx := r.Context()
    var req User

    // Leemos el JSON de forma segura
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "JSON inválido", http.StatusBadRequest)
        return
    }

    // Validamos que no venga vacío
    if req.UserEmail == "" {
        http.Error(w, "Email es obligatorio", http.StatusBadRequest)
        return
    }

    docRef := client.Collection("Users").Doc(req.UserEmail)
    docSnap, err := docRef.Get(ctx)
    if err != nil {
       http.Error(w, "Usuario no encontrado", http.StatusNotFound)
       return
    }

    var userData User
    if err := docSnap.DataTo(&userData); err != nil {
        http.Error(w, "Error al leer perfil de usuario", http.StatusInternalServerError)
        return
    }


    if err := bcrypt.CompareHashAndPassword([]byte(userData.Password), []byte(req.Password)); err != nil {
       http.Error(w, "Credenciales incorrectas", http.StatusUnauthorized)
       return
    }

    // Generate and assign the token
    token := "token_generado_para_" + req.UserEmail
    userData.Token = &token

    _, err = docRef.Set(ctx, userData)
    if err != nil {
       http.Error(w, "Error actualizando token", http.StatusInternalServerError)
       return
    }

    // Respondemos con los datos del usuario
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(userData)
}

func registerUserHandler(w http.ResponseWriter, r *http.Request) {
    if enableCORS(&w, r) {
       return
    }
    if r.Method != http.MethodPost {
       http.Error(w, "Metodo no valido", http.StatusMethodNotAllowed)
       return
    }

    var req User
    // Leemos el JSON
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Error leyendo datos: formato JSON inválido", http.StatusBadRequest)
        return
    }

    // doesn't admit white input
    if req.UserEmail == "" || req.Password == "" {
        http.Error(w, "Email y contraseña son obligatorios", http.StatusBadRequest)
        return
    }

    // Pass Encrypt
    hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
    if err != nil {
        http.Error(w, "Error encriptando contraseña", http.StatusInternalServerError)
        return
    }

    // Save to fireStore
    _, err = client.Collection("Users").Doc(req.UserEmail).Set(r.Context(), User{
        UserEmail: req.UserEmail,
        Password: string(hash),
    })

    if err != nil {
       http.Error(w, "Error guardando en BD", http.StatusInternalServerError)
       return
    }

    // Enviamos respuesta de éxito para que el frontend no se quede cargando
    w.WriteHeader(http.StatusCreated)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"mensaje": "Usuario registrado exitosamente"})
}

func createOrderHandler(w http.ResponseWriter, r *http.Request) {
    if enableCORS(&w, r) {
       return
    }

    if r.Method != http.MethodPost {
       http.Error(w, "Método no válido", http.StatusMethodNotAllowed)
       return
    }

    var newOrder Order
    if err := json.NewDecoder(r.Body).Decode(&newOrder); err != nil {
       http.Error(w, "Error leyendo datos", http.StatusBadRequest)
       return
    }

    newOrder.CreatedAt = time.Now()
    newOrder.Status = "pending"

    _, err := client.Collection("orders").Doc(newOrder.ID).Set(r.Context(), newOrder)
    if err != nil {
       http.Error(w, "Error guardando en BD", http.StatusInternalServerError)
       return
    }

    w.WriteHeader(http.StatusCreated)
    fmt.Fprintf(w, "Orden %s creada con exito", newOrder.ID)
}

func showOrderHandler(w http.ResponseWriter, r *http.Request) {
    if enableCORS(&w, r) {
       return
    }

    if r.Method != http.MethodGet {
       http.Error(w, "Metodo no valido", http.StatusMethodNotAllowed)
       return
    }

    iter := client.Collection("orders").Documents(r.Context())
    defer iter.Stop()

    var orders []Order
    for {
       doc, err := iter.Next()
       if err == iterator.Done {
          break
       }
       if err != nil {
          http.Error(w, "Error leyendo la base de datos", http.StatusInternalServerError)
          return
       }
       var o Order
       doc.DataTo(&o)
       orders = append(orders, o)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(orders)
}