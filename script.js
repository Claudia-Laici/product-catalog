const listaOggetti = [
  {
    id: 1,
    name: "Filamenti",
    description: "Filamenti di plastica",
    price: 25.99,
    quantita: 1,
    imageUrl: "",
  },
  {
    id: 2,
    name: "Inserti",
    description: "Inserti Filettati",
    price: 4.99,
    quantita: 1,
    imageUrl: "",
  },
  {
    id: 3,
    name: "Piatto",
    description: "Piatto",
    price: 35,
    quantita: 1,
    imageUrl: "",
  },
  {
    id: 4,
    name: "Stampante",
    description: "Stampante",
    price: 399,
    quantita: 1,
    imageUrl: "",
  },
];

const carrello = [];

// Funzione per aggiungere un articolo al carrello
function aggiungiAlCarrello(id) {
  const articolo = listaOggetti.find((item) => item.id === id);
  const input = document.getElementById(`quantita-${id}`); // 🔁 ottiene la quantità dal DOM
  const quantita = parseInt(input.value) || 1;

  const index = carrello.findIndex((item) => item.id === id);
  if (index !== -1) {
    carrello[index].quantita += quantita;
  } else {
    carrello.push({
      id: articolo.id,
      name: articolo.name,
      quantita: quantita,
      price: articolo.price,
    });
  }

  alert`(${articolo.name} è stato aggiunto al carrello)`;
  aggiornaLista();
}

// Funzione per creare gli articoli nel main
function creaArticoli() {
  const main = document.querySelector("main");
  for (let articolo of listaOggetti) {
    const div = document.createElement("div");
    div.classList.add("articolo");
    div.setAttribute("data-id", articolo.id);

    div.innerHTML = `
      <h2>${articolo.name}</h2>
      <img src="${articolo.imageUrl}" alt="${articolo.name}">
      <p>${articolo.description}</p>
      <p>Prezzo unitario: €${articolo.price}</p>
      
      <label>Quantità:
        <input 
          type="number" 
          id="quantita-${articolo.id}" 
          value="${articolo.quantita}" 
          min="1" 
          onchange="calcolaQuantita(${articolo.id})"
        >
      </label>
      
      <p id="prezzo-${articolo.id}">Totale: €${articolo.price}</p>

      <button onclick="aggiungiAlCarrello(${articolo.id})">Aggiungi al carrello</button>
    `;

    main.appendChild(div);
  }
}

// Funzione per calcolare prezzo totale dato prezzo e quantità
function calcolaQuantita(id) {
  const input = document.querySelector(`#quantita-${id}`);
  const quantita = parseInt(input.value, 10) || 1;

  const articolo = listaOggetti.find((item) => item.id === id);
  articolo.quantita = quantita; // 🔁 aggiorna la quantità anche nell’oggetto

  const prezzoTotale = (articolo.price * quantita).toFixed(2);

  // Aggiorna il DOM
  const prezzoEl = document.querySelector(`#prezzo-${id}`);
  prezzoEl.textContent = `Totale: €${prezzoTotale}`;
}

// Funzione placeholder per aggiornare la lista carrello (può essere migliorata)
function aggiornaLista() {
  const ulCart = document.querySelector("aside ul");
  ulCart.innerHTML = ""; // Pulisce il contenuto precedente

  let totale = 0;

  for (let articolo of carrello) {
    const liCart = document.createElement("li");
    liCart.innerHTML = `
      ${articolo.name} - Quantità: ${articolo.quantita}
      <button onclick="eliminaProdotto(${articolo.id})">Elimina</button>
    `;
    ulCart.appendChild(liCart);
    totale += articolo.price * articolo.quantita;
  }

  const totalElement = document.querySelector("aside p");
  totalElement.textContent = `Totale carrello: €${totale.toFixed(2)}`;
}

function eliminaProdotto(id) {
  const index = carrello.findIndex((item) => item.id === id);
  if (index !== -1) {
    carrello.splice(index, 1);
    aggiornaLista();
  }
}

// Esegui all’avvio
document.addEventListener("DOMContentLoaded", function () {
  aggiornaLista();
  creaArticoli();
});
