const shortenBtn = document.getElementById("shortenBtn");
const urlInput = document.getElementById("urlInput");
const resultDiv = document.getElementById("result");
const shortLink = document.getElementById("shortLink");
const copyBtn = document.getElementById("copyBtn");
const errorMsg = document.getElementById("errorMsg");

// TODO: Replace this with your actual API Gateway base URL
const API_BASE_URL = "https://49ywb1k7w4.execute-api.us-east-1.amazonaws.com/Prod";

shortenBtn.addEventListener("click", async () => {
  const longUrl = urlInput.value.trim();
  if (!longUrl) {
    showError("Please enter a valid URL.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: longUrl }),
    });

    if (!response.ok) throw new Error("Failed to shorten URL");

    const data = await response.json();
    const fullShortUrl = `${API_BASE_URL.replace('/Prod','')}/${data.id}`;

    shortLink.href = fullShortUrl;
    shortLink.textContent = fullShortUrl;
    resultDiv.classList.remove("hidden");
    errorMsg.classList.add("hidden");
  } catch (err) {
    showError("Something went wrong. Try again!");
    console.error(err);
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(shortLink.href);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  resultDiv.classList.add("hidden");
}
