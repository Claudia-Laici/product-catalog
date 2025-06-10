let listaOggetti = [];

function aggiungiProdotto() {
    let input = document.getElementById("input-ricerca");
    let valore = input.value.trim();
    let inputQuantita = document.getElementById("input-quantita");
    let quantita = inputQuantita.value.trim() || "1"; // Default 1 se vuoto

    if (valore !== "") {
        // Crea un oggetto con prodotto e quantità
        listaOggetti.push({
            prodotto: valore,
            quantita: quantita
        });
        
        // Pulisci i campi input
        input.value = "";
        inputQuantita.value = "";
        
        aggiornaLista();
    } else {
        alert("Inserisci un prodotto");
    }

    console.log(listaOggetti);
}

function aggiornaLista() {
    let ul = document.getElementById("lista");
    ul.innerHTML = "";

    for (let item of listaOggetti) {
        let li = document.createElement("li");
        // Usa innerHTML invece di textContent per aggiungere HTML
        li.innerHTML = `${item.prodotto} - Quantità: ${item.quantita} 
                       <button onclick="eliminaProdotto('${item.prodotto}', '${item.quantita}')">Elimina</button>
                       <button onclick="modificaQuantita('${item.prodotto}', '${item.quantita}')">Modifica</button>`;
        ul.appendChild(li);
    }
}

function eliminaProdotto(prodotto, quantita) {  // Riceve i parametri!
    
     let indice = listaOggetti.findIndex(elemento => elemento.prodotto === prodotto && elemento.quantita === quantita); // Trova l'indice dell'elemento con quel prodotto e quantità
    
    if (indice !== -1) {  // Se l'elemento è stato trovato
        listaOggetti.splice(indice, 1);  // Rimuovi 1 elemento alla posizione 'indice'
        aggiornaLista();
    }
}

function modificaQuantita(prodotto, quantita) {  // Riceve i parametri!
    // Trova l'indice dell'elemento con quel prodotto e quantità
    let nuovaQuantita = prompt("Inserisci la nuova quantità");
    
    let indice = listaOggetti.findIndex(elemento => elemento.prodotto === prodotto && elemento.quantita === quantita);
    
    if (indice !== -1) {  // Se l'elemento è stato trovato
        listaOggetti[indice].quantita = nuovaQuantita;  // Aggiorna la quantità
        aggiornaLista();
    }
}


function eliminaTutti() {
    listaOggetti = [];
    aggiornaLista();
}
