# Privacy Policy for Amazon Price & Tariff Guesser

**Effective Date:** May 2, 2025

Amazon Price & Tariff Guesser ("the Extension") is committed to protecting your privacy. This Privacy Policy explains what (if any) data our extension collects, how it is used, and the measures we take to ensure your information remains secure.

## 1. Information We Collect

Our extension is designed solely to compare prices between Amazon US and Amazon Canada and to estimate tariff-related differences. **We do not collect, store, or transmit any personally identifiable information (PII) or user-specific data.**

Specifically:

- **Local Data Extraction:**  
  The Extension automatically extracts publicly available product details (e.g., product names and prices) from Amazon pages that you browse. This data is processed locally in your browser and is not sent to external servers.
  
- **Exchange Rate Data:**  
  The Extension fetches the current US exchange rate via a remote request to [https://exchangerate.cdndev.io/latest](https://exchangerate.cdndev.io/latest). This call is made only to retrieve the latest exchange rate for conversion purposes. No user data is provided to or stored by this API.

- **No Storage of Personal Data:**  
  The Extension does not record or remember any personal browsing history, search queries, or any user-specific data between sessions.

## 2. How We Use Information

The sole purpose of the data processed by the Extension is to:

- Compare prices on Amazon US and Amazon Canada.
- Convert Canadian prices to US dollars using the latest exchange rate.
- Provide an estimate of tariff or additional charges that would apply to a purchase on Amazon US.

All calculations and processing are executed locally on your device; no data is transmitted to our servers or third parties.

## 3. Third-Party Services and Remote Code

- **Exchange Rate API:**  
  We use the exchange rate API at `https://exchangerate.cdndev.io/latest` to retrieve the latest currency conversion rate. This connection is limited to fetching public exchange rate data.  
- **Remote Code:**  
  The Extension does not load or execute remote JavaScript code. All scripts required for functionality are bundled with the Extension. The only remote interaction is fetching JSON data from the exchange rate API, which does not involve any executable code.

## 4. Security

Although our Extension does not handle sensitive personal data, we implement a number of security measures to ensure that any data processed remains secure:

- **Local Processing:**  
  All data extraction and processing occur locally in your browser.
  
- **Compliance with Chrome CSP:**  
  Our Extension complies with Chrome’s Content Security Policy, ensuring that only trusted, locally hosted scripts are executed.
  
- **Minimal Permissions:**  
  The Extension only requests permissions necessary for its core functionality, such as accessing specific Amazon pages and the exchange rate API.

## 5. Changes to This Privacy Policy

We reserve the right to modify this Privacy Policy at any time. Any changes will be posted in this file and will become effective immediately upon posting. We recommend reviewing this policy periodically to stay informed about how we are protecting your information.

## 6. Contact Us

If you have any questions or concerns regarding this Privacy Policy or the practices of our Extension, please contact us at:

**Email:** [Your Contact Email]

---

By using Amazon Price & Tariff Guesser, you agree to the terms of this Privacy Policy. If you do not agree, please do not install or use this Extension.