package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var requestData string // Variable pour stocker les données de la requête

func main() {
	errenvload := godotenv.Load()
	if errenvload != nil {
		log.Fatal("Erreur lors du chargement du fichier .env")
	}

	http.HandleFunc("/", authMiddleware(handleRequest))
	http.HandleFunc("/page", handlePageRequest)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		apiKey := os.Getenv("API_KEY") // Récupérer la clé d'API depuis le fichier env

		// Vérifier la clé d'API dans l'en-tête de la requête
		if r.Header.Get("API-Key") != apiKey {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	// Lire le corps de la requête
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Stocker les données de la requête
	requestData = string(body)

	// Répondre avec un statut 200 OK
	w.WriteHeader(http.StatusOK)
}

func handlePageRequest(w http.ResponseWriter, r *http.Request) {
	// Générer la réponse HTML de la page
	html := `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Ma page web</title>
		</head>
		<body>
			<h1>Bienvenue sur ma page web</h1>
			<p>Données de la requête :</p>
			<pre>%s</pre>
		</body>
		</html>
	`

	// Définir le type de contenu de la réponse
	w.Header().Set("Content-Type", "text/html")

	// Écrire la réponse HTML dans le corps de la réponse
	fmt.Fprintf(w, html, requestData)
}
