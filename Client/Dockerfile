# Utilisez une image de base contenant Go
FROM golang:latest

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le code source dans l'image
COPY . .

# Compilez le code Go
RUN go build -o main .

# Définissez la commande par défaut pour exécuter l'application
CMD ["./main"]
