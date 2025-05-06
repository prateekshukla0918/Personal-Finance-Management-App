import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi'

function Settings() {
  const { currency, setCurrency, exchangeRates, setExchangeRates } = useFinance()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' }
  ]

  const fetchExchangeRates = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()

      if (!data.rates) throw new Error('Invalid data format')

      setExchangeRates(data.rates)
      setSuccess(true)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error fetching exchange rates:', err)
      setError('Failed to fetch exchange rates. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value)
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your financial data? This action cannot be undone.')) {
      localStorage.removeItem('financeData')
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Currency Settings</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="label">
              Base Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
              className="input"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={fetchExchangeRates}
              disabled={loading}
              className={`btn flex items-center ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <FiRefreshCw className="h-4 w-4 mr-2" />
                  Update Exchange Rates
                </>
              )}
            </button>

            {error && (
              <div className="mt-2 text-sm text-danger-500 flex items-center">
                <FiX className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}

            {success && (
              <div className="mt-2 text-sm text-success-600 flex items-center">
                <FiCheck className="h-4 w-4 mr-1" />
                Exchange rates updated successfully
              </div>
            )}
          </div>

          {Object.keys(exchangeRates).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Exchange Rates</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(exchangeRates).map(([currency, rate]) => (
                    <div key={currency} className="text-sm">
                      <span className="font-medium">{currency}:</span> {rate.toFixed(4)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your financial data below. You can export your data for backup
            or clear all data to start fresh.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const data = localStorage.getItem('financeData')
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `fintrack-backup-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
              className="btn-secondary"
            >
              Export All Data
            </button>

            <button onClick={handleClearData} className="btn-danger">
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">About FinTrack</h2>
        <p className="text-gray-600 text-sm">
          FinTrack is a personal finance management application designed to help you
          track your income, expenses, and savings goals.
        </p>
        <p className="text-gray-600 text-sm mt-2">Version 1.0.0</p>
      </div>
    </div>
  )
}

export default Settings
