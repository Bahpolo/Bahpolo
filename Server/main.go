package main

import (
	"log"
	"time"
)

func main() {
	for {
		log.Println("Message de journalisation")

		// Pause d'une minute
		time.Sleep(time.Minute)
	}
}
