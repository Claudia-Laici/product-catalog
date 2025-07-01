const listaOggetti = [
  {
    id: 1,
    name: "Filamenti",
    description: "Filamenti di plastica",
    price: 25.99,
    quantita: 1,
    imageUrl: "assets/filamenti.jpg",
  },
  {
    id: 2,
    name: "Inserti",
    description: "Inserti Filettati",
    price: 4.99,
    quantita: 1,
    imageUrl: "assets/inserti.jpg",
  },
  {
    id: 3,
    name: "Piatto",
    description: "Piatto",
    price: 35.99,
    quantita: 1,
    imageUrl: "assets/piatto.jpg",
  },
  {
    id: 4,
    name: "Stampante",
    description: "Stampante",
    price: 399.99,
    quantita: 1,
    imageUrl: "assets/stampante.jpg",
  },
];

const carrello = [];


// Funzione per mostrare notifica toast
function mostraNotifica(messaggio, tipo = "success") {
  // Rimuovi notifica esistente se presente
  const esistente = document.querySelector(".toast-notification");
  if (esistente) {
    esistente.remove();
  }

  // Crea elemento notifica
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${tipo}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${tipo === "success" ? "✅" : "❌"}</span>
      <span class="toast-message">${messaggio}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Aggiungi al body
  document.body.appendChild(toast);

  // Anima l'entrata
  setTimeout(() => {
    toast.classList.add("toast-show");
  }, 100);

  // Rimuovi automaticamente dopo 3 secondi
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.remove("toast-show");
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, 3000);
}




// Funzione per aggiungere un articolo al carrello
function aggiungiAlCarrello(id) {
  const articolo = listaOggetti.find((item) => item.id === id);
  const input = document.getElementById(`quantita-${id}`);
  const quantita = parseInt(input.value) || 1;
  const index = carrello.findIndex((item) => item.id === id);
  if (index !== -1) {
    carrello[index].quantita = quantita;
  } else {
    carrello.push({
      id: articolo.id,
      name: articolo.name,
      quantita: quantita,
      price: articolo.price,
      imageUrl: articolo.imageUrl,
    });

    mostraNotifica(`Aggiunto ${articolo.name} x${quantita} al carrello`);
  }

  aggiornaLista();
}

// Funzione per creare gli articoli nel main (ora accetta array filtrato)
function creaArticoli(articoliDaMostrare = listaOggetti) {
  const main = document.querySelector("main");
  main.innerHTML = ""; // Pulisce SEMPRE il contenuto precedente

  if (articoliDaMostrare.length === 0) {
    main.innerHTML = "<p>Nessun prodotto trovato</p>";
    return;
  }

  for (let articolo of articoliDaMostrare) {
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

// Switch theme
document.getElementById("theme-toggle").addEventListener("click", function () {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  this.textContent = newTheme === "light" ? "🌙" : "☀️";
});

// Barra di ricerca - ora cerca nell'array e ricostruisce il DOM
function ricerca() {
  const input = document.getElementById("search-input");
  const filter = input.value.toLowerCase().trim();

  let articoliFiltrati;

  if (filter === "") {
    // Se la ricerca è vuota, mostra tutti gli articoli
    articoliFiltrati = listaOggetti;
  } else {
    // Filtra l'array in base al nome e alla descrizione
    articoliFiltrati = listaOggetti.filter(
      (articolo) => articolo.name.toLowerCase().includes(filter) /* || 
      articolo.description.toLowerCase().includes(filter) */
    );
  }

  // Ricostruisce il DOM con gli articoli filtrati
  creaArticoli(articoliFiltrati);
}

// Funzione per calcolare prezzo totale dato prezzo e quantità
function calcolaQuantita(id) {
  const input = document.querySelector(`#quantita-${id}`);
  const quantita = parseInt(input.value, 10) || 1;

  const articolo = listaOggetti.find((item) => item.id === id);
  articolo.quantita = quantita;

  const prezzoTotale = (articolo.price * quantita).toFixed(2);

  // Aggiorna il DOM
  const prezzoEl = document.querySelector(`#prezzo-${id}`);
  prezzoEl.textContent = `Totale: €${prezzoTotale}`;
}

// Funzione per aggiornare la lista carrello
function aggiornaLista() {
  const ulCart = document.querySelector("aside ul");
  ulCart.innerHTML = "";

  let totale = 0;

  for (let articolo of carrello) {
    const liCart = document.createElement("li");
    liCart.innerHTML = `
      <div class="carrello-item">
        <img src="${articolo.imageUrl}" alt="${articolo.name}" class="thumb">
        <div>
          <strong>${articolo.name}</strong><br>
          Quantità: ${articolo.quantita}
        </div>
        <button onclick="eliminaProdotto(${articolo.id})">Elimina</button>
      </div>
    `;

    ulCart.appendChild(liCart);
    totale += articolo.price * articolo.quantita;
  }

  const totalElement = document.querySelector("aside p");
  if (carrello.length === 0) {
    totalElement.textContent = "Carrello vuoto";
  } else {
    totalElement.textContent = `Totale carrello: €${totale.toFixed(2)}`;
  }
}

function eliminaProdotto(id) {
  const index = carrello.findIndex((item) => item.id === id);
  if (index !== -1) {
    carrello.splice(index, 1);
    aggiornaLista();
  }
}

// Aggiungi un event listener per il pulsante di login

// Gestione Modal Login
function openLoginModal() {
  const modal = document.getElementById("login-modal");
  modal.classList.add("show");
  modal.style.display = "flex";

  // Focus sul primo input
  setTimeout(() => {
    document.getElementById("username").focus();
  }, 300);
}

function closeLoginModal() {
  const modal = document.getElementById("login-modal");
  /*  modal.classList.remove("show");  */ // Sostituisce la pagina login con il login a sinistra nel mentre carica la pagina quando si fa il login se ci mette troppo tempo.

  // Aspetta la fine dell'animazione prima di nascondere
  setTimeout(() => {
    modal.style.display = "none";
    // Reset form
    document.getElementById("login-form").reset();
  }, 300);
}

// Esegui all'avvio del DOM
document.addEventListener("DOMContentLoaded", function () {
  aggiornaLista();
  creaArticoli(); // Prima crea gli articoli

  // POI aggiungi gli event listeners per la ricerca
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (searchInput) {
    searchInput.addEventListener("input", ricerca);
    searchInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        ricerca();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", ricerca);
  }

  // Pulsante Login
  const loginButton = document.getElementById("ButtonLogin");
  if (loginButton) {
    loginButton.addEventListener("click", openLoginModal);
  }

  // Chiudi modal
  const closeModal = document.getElementById("close-modal");
  const cancelLogin = document.getElementById("cancel-login");
  const modal = document.getElementById("login-modal");

  if (closeModal) {
    closeModal.addEventListener("click", closeLoginModal);
  }

  if (cancelLogin) {
    cancelLogin.addEventListener("click", closeLoginModal);
  }

  // Chiudi cliccando fuori dal modal
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeLoginModal();
      }
    });
  }

  // Gestione form login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username && password) {
        // Simula autenticazione (sostituisci con la tua logica)
        if (password.length >= 4) {
          mostraNotifica(`Benvenuto ${username}!`, "success");
          closeLoginModal();

          // Opzionale: cambia il pulsante login in logout
          loginButton.innerHTML = '<i class="fa-solid fa-user-check"></i>';
          loginButton.title = `Collegato come ${username}`;
        } else {
          mostraNotifica("Password troppo corta (min 4 caratteri)", "error");
        }
      } else {
        mostraNotifica("Compila tutti i campi", "error");
      }
    });
  }

  // Chiudi modal con tasto ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const modal = document.getElementById("login-modal");
      if (modal && modal.classList.contains("show")) {
        closeLoginModal();
      }
    }
  });
});
