// Load quotes from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    category: "Programming",
  },
  { text: "Simplicity is the soul of efficiency.", category: "Tech" },
  { text: "Consistency beats motivation.", category: "Life" },
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available.";
    quoteDisplay.appendChild(p);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);

  // Optional: save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuoteIndex", randomIndex);
}

// Function to add a new quote
function createAddQuoteForm() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please fill in both fields");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote();
}

// Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
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
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid JSON format");
      }
    } catch (err) {
      alert("Error reading JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Display a random quote on page load
showRandomQuote();
