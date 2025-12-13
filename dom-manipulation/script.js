// ------------------- Task 4: Server Sync & Conflict Resolution -------------------

const SERVER_API = "https://jsonplaceholder.typicode.com/posts";

// Function ALX expects
async function syncQuotes() {
  try {
    const response = await fetch(SERVER_API);
    const serverData = await response.json();

    // Convert server data into quote format
    const serverQuotes = serverData.map(item => ({
      text: item.title || item.body,
      category: item.userId ? `User ${item.userId}` : "General"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Conflict resolution: server data takes precedence
function resolveConflicts(serverQuotes) {
  const mergedQuotes = [...serverQuotes];

  quotes.forEach(localQuote => {
    const exists = serverQuotes.some(
      sq => sq.text === localQuote.text && sq.category === localQuote.category
    );
    if (!exists) mergedQuotes.push(localQuote);
  });

  quotes = mergedQuotes;
  saveQuotes();           // update localStorage
  populateCategories();
  filterQuote();

  showNotification("Quotes synced with server"); // notify user
}

// Post new quote to server (mock)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Periodically check for new quotes from server every 60 seconds
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
