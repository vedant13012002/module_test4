
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
let cryptoData = []; // Array to store fetched cryptocurrency data

document.addEventListener('DOMContentLoaded', () => {
  fetchDataAsyncAwait(); 
  setupEventListeners(); 
});

// Fetch data using async/await
async function fetchDataAsyncAwait() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    cryptoData = data; 
    populateTable(cryptoData); 
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data using .then
function fetchDataThen() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      cryptoData = data; 
      populateTable(cryptoData); 
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function populateTable(data) {
  const tableBody = document.getElementById('cryptoTableBody');
  tableBody.innerHTML = '';

  data.forEach((crypto, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${crypto.image}" class="coin-icon"></td>
      <td class="coin-name">${crypto.name}</td>
      <td>${crypto.symbol.toUpperCase()}</td>
      <td class="price">$${crypto.current_price.toFixed(2)}</td>
      <td class="market-cap">$${crypto.market_cap.toLocaleString()}</td>
      <td class="percentage">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
    `;
    tableBody.appendChild(row);
  });
}

function setupEventListeners() {
  // Event listener for search input
  document.getElementById('searchInput').addEventListener('input', function() {
    const searchText = this.value.trim().toLowerCase();
    filterTable(searchText);
  });
}

function filterTable(searchText) {
  const filteredData = cryptoData.filter(crypto => {
    const name = crypto.name.toLowerCase();
    const symbol = crypto.symbol.toLowerCase();
    return name.includes(searchText) || symbol.includes(searchText);
  });
  populateTable(filteredData);
}

function sortTable(criteria) {
  if (criteria === 'marketCap') {
    cryptoData.sort((a, b) => b.market_cap - a.market_cap);
  } else if (criteria === 'percentage') {
    cryptoData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  }
  populateTable(cryptoData);
}
