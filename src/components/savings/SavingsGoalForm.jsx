import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'

function SavingsGoalForm({ goal = null, onSave, onCancel }) {
  const { addSavingsGoal, updateSavingsGoal } = useFinance()
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
  })
  
  // Prefill form if editing an existing goal
  useEffect(() => {
    if (goal) {
      setFormData({
        ...goal,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
      })
    } else {
      setFormData(prev => ({
        ...prev,
        currentAmount: '0',
      }))
    }
  }, [goal])
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.targetAmount) {
      alert('Please fill in all required fields')
      return
    }
    
    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
    }
    
    if (goal) {
      // Update existing goal
      updateSavingsGoal(goalData)
    } else {
      // Add new goal
      addSavingsGoal(goalData)
    }
    
    onSave()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">
          Goal Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          placeholder="e.g., New Car, Vacation, Emergency Fund"
          required
        />
      </div>
      
      <div>
        <label htmlFor="targetAmount" className="label">
          Target Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
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
        <label htmlFor="currentAmount" className="label">
          Current Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            className="input pl-7"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave at 0 if you're just starting to save for this goal
        </p>
      </div>
      
      <div>
        <label htmlFor="targetDate" className="label">
          Target Date (Optional)
        </label>
        <input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          className="input"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          placeholder="Add more details about your goal"
          rows="3"
        ></textarea>
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
          {goal ? 'Update' : 'Add'} Goal
        </button>
      </div>
    </form>
  )
}

export default SavingsGoalForm