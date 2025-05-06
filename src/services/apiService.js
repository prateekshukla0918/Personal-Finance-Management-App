// In a real app, you'd use environment variables for these
const FIXER_API_KEY = 'YOUR_FIXER_API_KEY'
const FIXER_API_URL = 'https://api.apilayer.com/fixer'

// Fetch exchange rates using fetch
export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${FIXER_API_URL}/latest?base=${baseCurrency}`, {
      method: 'GET',
      headers: {
        'apikey': FIXER_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    throw error
  }
}

// Convert currency
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates || !rates[toCurrency]) {
    throw new Error(`No conversion rate available for ${toCurrency}`)
  }

  if (fromCurrency === toCurrency) {
    return amount
  }

  return amount * rates[toCurrency]
}
