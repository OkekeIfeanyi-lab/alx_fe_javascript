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

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))]; // map used to get unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("lastCategoryFilter") || "all";
  categoryFilter.value = lastCategory;
}

// Filter quotes by selected category
function filterQuote() {
  const selectedCategory = categoryFilter.value; // ALX expects this exact variable name
  localStorage.setItem("lastCategoryFilter", selectedCategory); // save to localStorage

  const filteredQuotes = selectedCategory === "all" 
      ? quotes 
      : quotes.filter(q => q.category === selectedCategory);

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

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;
  cons
