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
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type Order struct {
	ID        string    `json:"id"`
	UserEmail string    `json:"user_email"`
	Items     []string  `json:"items"`
	Total     float64   `json:"total"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
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
		w.Write([]byte("Servidor en línea 🚀"))
	})
	http.HandleFunc("/show-orders", showOrderHandler)

	fmt.Println("Servidor escuchando en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
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