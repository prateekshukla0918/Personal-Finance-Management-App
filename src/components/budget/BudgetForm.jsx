import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'

function BudgetForm({ categoryId = null, onSave, onCancel }) {
  const { 
    categories, 
    budgets, 
    updateBudget, 
    getSuggestedBudgets 
  } = useFinance()
  
  // Filter to just expense categories
  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  
  // Form state
  const [formData, setFormData] = useState({
    categoryId: categoryId || '',
    amount: '',
  })
  
  // Pre-fill form if editing existing budget
  useEffect(() => {
    if (categoryId && budgets[categoryId]) {
      setFormData({
        categoryId,
        amount: budgets[categoryId].toString(),
      })
    }
  }, [categoryId, budgets])
  
  // Get suggested budget for selected category
  const suggestedBudgets = getSuggestedBudgets()
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Use suggested budget
  const useSuggestedBudget = () => {
    if (formData.categoryId && suggestedBudgets[formData.categoryId]) {
      setFormData(prev => ({ 
        ...prev, 
        amount: suggestedBudgets[formData.categoryId].toString() 
      }))
    }
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.categoryId || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }
    
    updateBudget(formData.categoryId, parseFloat(formData.amount))
    onSave()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="categoryId" className="label">
          Expense Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="input"
          disabled={!!categoryId}
          required
        >
          <option value="">Select category</option>
          {expenseCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="amount" className="label">
          Budget Amount
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
      
      {formData.categoryId && suggestedBudgets[formData.categoryId] && (
        <div className="p-3 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-700">
            Suggested budget based on your spending habits: 
            <span className="font-medium ml-1">
              ${suggestedBudgets[formData.categoryId].toFixed(2)}
            </span>
          </p>
          <button
            type="button"
            onClick={useSuggestedBudget}
            className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Use suggested amount
          </button>
        </div>
      )}
      
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
          {categoryId ? 'Update' : 'Set'} Budget
        </button>
      </div>
    </form>
  )
}

export default BudgetForm