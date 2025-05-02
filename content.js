// --- Scraping and Sending Data ---
function init() {
  console.log("plugin loaded");

  // Select product anchors in the cart.
  const cartItems = document.querySelectorAll("a.a-link-normal.sc-product-link.sc-product-title.aok-block");
  const itemDetails = [];

  cartItems.forEach((item) => {
    console.log("item found");

    // Extract the product title from the nested element.
    const productNameElement = item.querySelector('.a-truncate-full');
    let productName = productNameElement ? productNameElement.innerText.trim() : item.textContent.trim();

    // Extract the ASIN from the href attribute.
    const href = item.getAttribute("href");
    let asin = null;
    if (href) {
      const asinMatch = href.match(/\/gp\/product\/([A-Z0-9]+)/);
      if (asinMatch && asinMatch[1]) {
        asin = asinMatch[1];
      }
    }

    // Construct the Canada URL using the ASIN.
    let canadaURL = asin ? `https://www.amazon.ca/dp/${asin}?psc=1` : null;

    // Locate the container that holds the U.S. price.
    const container = item.closest(".sc-item-content-group");
    let priceUSD = null;
    if (container) {
      const priceElement = container.querySelector("div.sc-item-price-block span.a-offscreen");
      if (priceElement) {
        const priceText = priceElement.textContent.trim();
        priceUSD = parseFloat(priceText.replace("$", ""));
      } else {
        console.warn("Price element not found for:", productName);
      }
    } else {
      console.warn("Container element not found for:", productName);
    }

    if (productName && priceUSD !== null && !isNaN(priceUSD)) {
      itemDetails.push({ name: productName, priceUSD, canadaURL });
    }
  });

  console.log("Collected item details:", itemDetails);
  chrome.runtime.sendMessage({ itemDetails });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// --- Receiving Updated Items and Displaying the Converted USD Price ---
chrome.runtime.onMessage.addListener((message) => {
  if (message.updatedItems) {
    message.updatedItems.forEach((item, index) => {
      // Locate the product anchor for the current item.
      const productAnchor = document.querySelectorAll("a.a-link-normal.sc-product-link.sc-product-title.aok-block")[index];
      if (productAnchor) {
        const priceInfoElement = document.createElement("div");
        if (item.canadaPrice !== null && item.convertedUSDPrice !== null) {
          priceInfoElement.textContent = `Canadian Price in USD: $${item.convertedUSDPrice}`;
          // Optional styling for clarity:
          priceInfoElement.style.color = "green";
          priceInfoElement.style.fontWeight = "bold";
          priceInfoElement.style.marginTop = "4px";
        } else {
          priceInfoElement.textContent = "Canadian price conversion not available";
          priceInfoElement.style.color = "red";
        }
        productAnchor.appendChild(priceInfoElement);
      }
    });
  }
});