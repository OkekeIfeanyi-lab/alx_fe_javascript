// ------------------- Task 1–4: Dynamic Quote Generator -------------------

// Load quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Tech" },
  { text: "Consistency beats motivation.", category: "Life" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ------------------- Task 4: Server Sync & Conflict Resolution -------------------
const SERVER_API = "https://jsonplaceholder.typicode.com/posts";

// ALX expects this exact function
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_API);
    const serverData = await response.json();

    const serverQuotes = serverData.map(item => ({
      text: item.title || item.body,
      category: item.userId ? `User ${item.userId}` : "General"
    }));

    // Server data takes precedence
    const mergedQuotes = [...serverQuotes];

    quotes.forEach(localQuote => {
      const exists = serverQuotes.some(
        sq => sq.text === localQuote.text && sq.category === localQuote.category
      );
      if (!exists) mergedQuotes.push(localQuote);
    });

    quotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuote();
    showNotification("Quotes synced with server");
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Periodically sync every 60 seconds
setInterval(syncQuotes, 60000);

// Notification helper
function showNotification(msg) {
  const notif = document.createElement("div");
  notif.textContent = msg;
  notif.style.background = "#ffc";
  notif.style.padding = "10px";
  notif.style.border = "1px solid #333";
  notif.style.position = "fixed";
  notif.style.top = "10px";
  notif.style.right = "10px";
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ------------------- Task 1: Random Quote -------------------
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  displaySingleQuote(filteredQuotes[randomIndex]);
}

// Display a single quote
function displaySingleQuote(quote) {
  quoteDisplay.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  sessionStorage.setItem("lastQuoteIndex", quotes.indexOf(quote));
}

// ------------------- Task 2: LocalStorage & JSON -------------------

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format");
      }
    } catch {
      alert("Error reading JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ------------------- Task 3: Category Filtering -------------------

// Populate categories dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuote() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";
  if (filteredQuotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available.";
    quoteDisplay.appendChild(p);
    return;
  }

  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;

    const small = document.createElement("small");
    small.textContent = `Category: ${q.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  });
}

// ------------------- Add new quote -------------------
function createAddQuoteForm() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  postQuoteToServer(newQuote); // Send to server

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuote();
}

// Post new quote to server (mock)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// ------------------- Initialize -------------------
populateCategories();
filterQuote();
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuote);
