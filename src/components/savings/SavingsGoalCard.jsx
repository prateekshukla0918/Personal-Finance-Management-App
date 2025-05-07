import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { FiTarget, FiCalendar, FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi'
import SavingsGoalForm from './SavingsGoalForm'

function SavingsGoalCard({ goal }) {
  const { updateSavingsGoal, deleteSavingsGoal } = useFinance()
  
  const [showForm, setShowForm] = useState(false)
  const [showContributeForm, setShowContributeForm] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')
  
  const percentComplete = (goal.currentAmount / goal.targetAmount) * 100
  
  const getDaysUntilTarget = () => {
    if (!goal.targetDate) return null
    const targetDate = new Date(goal.targetDate)
    const today = new Date()
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilTarget = getDaysUntilTarget()

  const handleDelete = () => {
    // Use window.confirm instead of confirm
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      deleteSavingsGoal(goal.id)
    }
  }

  const handleFormSave = () => {
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
  }

  const handleContribute = () => {
    const amount = parseFloat(contributeAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + amount
    }
    updateSavingsGoal(updatedGoal)
    setShowContributeForm(false)
    setContributeAmount('')
  }

  let progressColor = '#9CA3AF'
  if (percentComplete >= 75) {
    progressColor = '#10B981'
  } else if (percentComplete >= 50) {
    progressColor = '#3B82F6'
  } else if (percentComplete >= 25) {
    progressColor = '#F59E0B'
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setShowForm(true)}
            className="p-1.5 text-gray-600 hover:text-primary-500 rounded-full hover:bg-gray-100"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-600 hover:text-danger-500 rounded-full hover:bg-gray-100"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            ${goal.currentAmount.toFixed(2)}
          </span>
          <span className="font-medium text-gray-800">
            ${goal.targetAmount.toFixed(2)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(percentComplete, 100)}%`,
              backgroundColor: progressColor 
            }}
          />
        </div>
        
        <div className="flex justify-end mt-1">
          <span 
            className="text-xs font-medium"
            style={{ color: progressColor }}
          >
            {percentComplete.toFixed(0)}% complete
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {goal.description && (
          <p className="text-sm text-gray-600">{goal.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <FiTarget className="mr-1 h-4 w-4" />
            <span>
              ${(goal.targetAmount - goal.currentAmount).toFixed(2)} left
            </span>
          </div>
          
          {goal.targetDate && (
            <div className="flex items-center text-gray-600">
              <FiCalendar className="mr-1 h-4 w-4" />
              <span>
                {daysUntilTarget > 0 
                  ? `${daysUntilTarget} days left` 
                  : 'Target date passed'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        {showContributeForm ? (
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="input pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                />
              </div>
              <button 
                onClick={handleContribute}
                className="btn-primary"
              >
                Add
              </button>
            </div>
            <button
              onClick={() => setShowContributeForm(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowContributeForm(true)}
            className="btn-primary w-full flex items-center justify-center"
          >
            <FiDollarSign className="mr-1 h-4 w-4" />
            Contribute to Goal
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Savings Goal
              </h3>
            </div>
            <div className="p-6">
              <SavingsGoalForm
                goal={goal}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavingsGoalCard
