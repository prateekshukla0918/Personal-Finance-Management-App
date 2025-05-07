import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'

function TransactionForm({ transaction = null, onSave, onCancel }) {
  const { categories, addTransaction, updateTransaction } = useFinance()
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  // Prefill form if editing an existing transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0],
        amount: transaction.amount.toString()
      })
    }
  }, [transaction])
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(cat => cat.type === formData.type)
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle transaction type change
  const handleTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      categoryId: '' // Reset category when type changes
    }))
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.description || !formData.amount || !formData.categoryId) {
      alert('Please fill in all required fields')
      return
    }
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    }
    
    if (transaction) {
      // Update existing transaction
      updateTransaction(transactionData)
    } else {
      // Add new transaction
      addTransaction(transactionData)
    }
    
    onSave()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          placeholder="e.g., Grocery shopping"
          required
        />
      </div>
      
      <div>
        <label htmlFor="amount" className="label">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input pl-7"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="label">Transaction Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`btn ${
              formData.type === 'income' 
                ? 'bg-success-500 text-white hover:bg-success-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`btn ${
              formData.type === 'expense' 
                ? 'bg-danger-500 text-white hover:bg-danger-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expense
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="categoryId" className="label">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select category</option>
          {filteredCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="date" className="label">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  )
}

export default TransactionForm