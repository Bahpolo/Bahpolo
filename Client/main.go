package main

import (
	"github.com/joho/godotenv"
	"github.com/mssola/user_agent"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

func main() {
	errenvload := godotenv.Load()
	if errenvload != nil {
		log.Fatal("Erreur lors du chargement du fichier .env")
	}

	targetProtocol := os.Getenv("TARGET_PROTOCOL")
	targetUrl := os.Getenv("TARGET_URL")
	targetPort := os.Getenv("TARGET_PORT")

	startPort := os.Getenv("PORT")

	// Créez un URL cible où les requêtes seront redirigées
	targetURL, err := url.Parse(targetProtocol + "://" + targetUrl + ":" + targetPort)
	if err != nil {
		log.Fatal(err)
	}

	// Créez le reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Configurez les en-têtes pour préserver l'adresse IP d'origine de la requête
	proxy.Director = func(req *http.Request) {
		req.URL.Scheme = targetURL.Scheme
		req.URL.Host = targetURL.Host
		req.URL.Path = targetURL.Path + req.URL.Path
		req.Host = targetURL.Host
	}

	// Ajoutez le logging des adresses IP
	proxy.Transport = &loggingTransport{}

	// Lancez le serveur
	log.Println("Serveur démarré sur le port " + startPort)
	log.Fatal(http.ListenAndServe(":"+startPort, proxy))
}

type loggingTransport struct {
	Transport http.RoundTripper
}

func (t *loggingTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	ip, _, err := net.SplitHostPort(req.RemoteAddr)
	if err != nil {
		log.Printf("Erreur lors de l'extraction de l'adresse IP: %v", err)
	} else {
		logUserAgent(ip, req.UserAgent())
	}

	if t.Transport == nil {
		t.Transport = http.DefaultTransport
	}
	return t.Transport.RoundTrip(req)
}

func logUserAgent(ip, userAgentStr string) {
	ua := user_agent.New(userAgentStr)

	browserName, browserVersion := ua.Browser()
	osInfo := ua.OSInfo()
	osName := osInfo.Name
	osVersion := osInfo.Version

	log.Printf("Connexion de l'adresse IP : %s - Navigateur : %s %s - Système d'exploitation : %s %s - Date et heure de connexion : %s",
		ip, browserName, browserVersion, osName, osVersion, time.Now().Format("2006-01-02 15:04:05"))
}
