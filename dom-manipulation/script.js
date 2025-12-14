// ------------------- Task 1–3: Dynamic Quote Generator -------------------

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Tech" },
  { text: "Consistency beats motivation.", category: "Life" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";

  filtered.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;

    const small = document.createElement("small");
    small.textContent = `Category: ${q.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  });
}

function showRandomQuote() {
  if (quotes.length === 0) return;
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.innerHTML = `"${random.text}" - ${random.category}`;
}

// ------------------- Server Sync & Conflict Resolution -------------------

const SERVER_API = "https://jsonplaceholder.typicode.com/posts";

/**
 * ✅ REQUIRED BY ALX
 * Fetch data from mock server
 */
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_API);
  const data = await response.json();

  return data.map(item => ({
    text: item.title || item.body,
    category: item.userId ? `User ${item.userId}` : "General"
  }));
}

/**
 * ✅ REQUIRED BY ALX
 * Sync quotes and resolve conflicts
 */
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Server takes precedence
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuote();

    showNotification("Quotes updated from server");
  } catch (error) {
    console.error("Sync error:", error);
  }
}

/**
 * ✅ REQUIRED BY ALX
 * Post data to mock server
 */
async function postQuoteToServer(quote) {
  await fetch(SERVER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

// ------------------- UI Notification -------------------

function showNotification(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.position = "fixed";
  div.style.top = "10px";
  div.style.right = "10px";
  div.style.background = "#fff3cd";
  div.style.border = "1px solid #333";
  div.style.padding = "10px";
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// ------------------- Add Quote -------------------

function createAddQuoteForm() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const quote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (!quote.text || !quote.category) return;

  quotes.push(quote);
  saveQuotes();
  postQuoteToServer(quote);

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuote();
}

// ------------------- Periodic Sync -------------------

setInterval(syncQuotes, 60000);

// ------------------- Initialize -------------------

syncQuotes();
populateCategories();
filterQuote();

newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuote);
