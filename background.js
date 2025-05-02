// Helper function: Try multiple regex patterns to extract the Canadian price.
function extractCanadaPrice(html) {
  const patterns = [
    // Pattern 1: Common core price layout.
    /<div[^>]+id="corePrice_feature_div"[\s\S]*?<span class="a-offscreen">\$(\d+(?:\.\d+)?)<\/span>/i,
    // Pattern 2: A generic layout of a-price container.
    /<span[^>]+class="a-price aok-align-center"[^>]*>[\s\S]*?<span class="a-offscreen">\$(\d+(?:\.\d+)?)<\/span>/i,
    // Pattern 3: Generic search for any span with class "a-offscreen" and a price.
    /<span[^>]+class="a-offscreen">\$([\d,]+(?:\.\d+)?)<\/span>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Remove commas if any (e.g., "1,234.56") and parse as float.
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return null;
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.itemDetails) {
    // First, fetch the latest exchange rate.
    // In our sample, the API returns JSON that looks like:
    // { "data": { "CAD": 1.5589602108 } }
    // Assuming that value represents "1 USD = [value] CAD", we convert by:
    // USD = CAD price / [value]
    let exchangeRate = null;
    try {
  const rateResponse = await fetch('https://exchangerate.cdndev.io/latest');
  const rateJson = await rateResponse.json();
  
  // Adjusted to match the new JSON structure
  if (rateJson && rateJson.success && rateJson.rates && rateJson.rates.CAD) {
    exchangeRate = parseFloat(rateJson.rates.CAD);
    console.log(`Exchange rate fetched: 1 USD = ${exchangeRate} CAD`);
  } else {
    console.warn("Exchange rate API did not return expected data.");
  }
} catch (error) {
  console.error("Error fetching exchange rate:", error);
}

    // Process each item: fetch its Canada page, extract the CAD price,
    // and then convert it to USD using the exchange rate.
    const updatedItems = await Promise.all(
      message.itemDetails.map(async (item) => {
        if (item.canadaURL) {
          try {
            const response = await fetch(item.canadaURL);
            const html = await response.text();
            const canadaPrice = extractCanadaPrice(html);
            if (canadaPrice !== null) {
              console.log(`Extracted Canada price for "${item.name}": $${canadaPrice}`);
              let convertedUSD = null;
              if (exchangeRate !== null && exchangeRate > 0) {
                // Convert CAD to USD using the fetched exchange rate.
                convertedUSD = parseFloat((canadaPrice / exchangeRate).toFixed(2));
                console.log(
                  `Converted $${canadaPrice} CAD for "${item.name}" to USD: $${convertedUSD}`
                );
              } else {
                console.warn(`Exchange rate not available for conversion on "${item.name}"`);
              }
              return { ...item, canadaPrice, convertedUSDPrice: convertedUSD };
            } else {
              console.warn(`Canada price element not found for item: ${item.name}`);
              return { ...item, canadaPrice: null, convertedUSDPrice: null };
            }
          } catch (error) {
            console.error(`Error fetching Canada page for "${item.name}":`, error);
            return { ...item, canadaPrice: null, convertedUSDPrice: null };
          }
        }
        return item;
      })
    );

    console.log("Updated items with Canada and converted USD prices:", updatedItems);
    chrome.tabs.sendMessage(sender.tab.id, { updatedItems });
  }
});