let activeInterval = null;
let activeCompany = null;

document.getElementById('startTracking').addEventListener('click', function() {
    const companySelect = document.getElementById('company');
    const selectedCompany = companySelect.value;
    const [ticker, exchange] = selectedCompany.split(':');
    const priceDisplay = document.getElementById('stock-price');

    if (activeCompany === selectedCompany) {
        return;
    }
    if (activeInterval) {
        clearInterval(activeInterval);
    }

    priceDisplay.textContent = "Fetching stock price...";
    activeCompany = selectedCompany;

    async function fetchStockPrice() {
        try {
            const response = await fetch(`/get-stock-price?ticker=${ticker}&exchange=${exchange}`);
            const data = await response.json();

            if (data.price) {
                priceDisplay.textContent = `Current price of ${ticker}: ₹${data.price.toFixed(2)}`;
            } else {
                priceDisplay.textContent = 'Unable to fetch the stock price.';
            }
        } catch (error) {
            console.error('Error fetching stock price:', error);
            priceDisplay.textContent = 'Error fetching stock price.';
        }
    }

    fetchStockPrice();

    activeInterval = setInterval(fetchStockPrice, 5000);
});