package main

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var requestData string

type PageData struct {
	RequestData  string
	ResponseData string
}

func main() {
	errenvload := godotenv.Load()
	if errenvload != nil {
		log.Fatal("Erreur lors du chargement du fichier .env")
	}

	http.HandleFunc("/", handlePageRequest)
	http.HandleFunc("/dashboard", handleDashboardRequest)
	http.HandleFunc("/api", authMiddleware(handleRequest))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	startPort := os.Getenv("PORT")

	log.Fatal(http.ListenAndServe(":"+startPort, nil))
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		apiKey := os.Getenv("API_KEY")
		if r.Header.Get("key") != apiKey {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

func connectDB() (*sql.DB, error) {
	dbHost := os.Getenv("DATABASE_HOST")
	dbPort := os.Getenv("DATABASE_PORT")
	dbUser := os.Getenv("DATABASE_USER")
	dbPassword := os.Getenv("DATABASE_PASSWORD")
	dbName := os.Getenv("DATABASE_NAME")
	db, err := sql.Open("mysql", ""+dbUser+":"+dbPassword+"@tcp("+dbHost+":"+dbPort+")/"+dbName+"")
	if err != nil {
		return nil, err
	}
	return db, nil
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	requestData = string(body)

	db, err := connectDB()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO logs (request_data, additional_info) VALUES (?, ?)")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(requestData, "")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func handlePageRequest(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT request_data, additional_info FROM logs")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var responseData string
	for rows.Next() {
		var col1, col2 string
		err := rows.Scan(&col1, &col2)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		responseData += fmt.Sprintf("Request Data: %s, Additional Info: %s\n", col1, col2)
	}

	data := PageData{
		RequestData:  requestData,
		ResponseData: responseData,
	}

	tmpl, err := template.ParseFiles("./template/index.html")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
func handleDashboardRequest(w http.ResponseWriter, r *http.Request) {

	data := PageData{}

	tmpl, err := template.ParseFiles("./template/dashboard.html")
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
