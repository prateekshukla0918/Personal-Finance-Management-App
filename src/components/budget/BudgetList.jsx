import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { FiEdit2, FiAlertTriangle } from 'react-icons/fi'
import BudgetForm from './BudgetForm'

function BudgetList() {
  const { 
    categories, 
    budgets, 
    getBudgetStatus, 
    expensesByCategory // Directly accessing expensesByCategory
  } = useFinance()
  
  // State for selected category and modal
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showForm, setShowForm] = useState(false)
  
  // Get budget status and expenses
  const budgetStatus = getBudgetStatus()
  
  // Filter to just expense categories
  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  
  // Get list of categories with a budget
  const categoriesWithBudget = expenseCategories.filter(cat => 
    budgets[cat.id] !== undefined
  )
  
  // Get list of categories without a budget
  const categoriesWithoutBudget = expenseCategories.filter(cat => 
    budgets[cat.id] === undefined
  )
  
  // Handle edit budget
  const handleEdit = (categoryId) => {
    setSelectedCategory(categoryId)
    setShowForm(true)
  }
  
  // Handle form save and cancel
  const handleFormSave = () => {
    setShowForm(false)
    setSelectedCategory(null)
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedCategory(null)
  }
  
  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Monthly Budgets</h2>
        <button
          onClick={() => {
            setSelectedCategory(null)
            setShowForm(true)
          }}
          className="btn-primary"
        >
          Add New Budget
        </button>
      </div>
      
      {/* Budget form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCategory ? 'Edit Budget' : 'Add New Budget'}
              </h3>
            </div>
            <div className="p-6">
              <BudgetForm
                categoryId={selectedCategory}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Budgets with progress */}
      {categoriesWithBudget.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No budgets set yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesWithBudget.map(category => {
            const status = budgetStatus[category.id]
            if (!status) return null
            
            let statusColor = 'bg-success-500'
            let textColor = 'text-success-600'
            let percentage = status.percentage
            
            if (percentage >= 90) {
              statusColor = 'bg-danger-500'
              textColor = 'text-danger-500'
            } else if (percentage >= 75) {
              statusColor = 'bg-warning-500'
              textColor = 'text-warning-600'
            } else if (percentage >= 50) {
              statusColor = 'bg-primary-500'
              textColor = 'text-primary-600'
            }
            
            return (
              <div key={category.id} className="card">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <button 
                    onClick={() => handleEdit(category.id)}
                    className="p-1.5 text-gray-600 hover:text-primary-500 rounded-full hover:bg-gray-100"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    Spent ${status.spent.toFixed(2)}
                  </span>
                  <span className="font-medium">
                    Budget ${status.budget.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${statusColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${textColor}`}>
                    {percentage.toFixed(0)}% used
                  </span>
                  
                  {status.remaining < 0 && (
                    <div className="flex items-center text-xs text-danger-500">
                      <FiAlertTriangle className="mr-1 h-3 w-3" />
                      <span>Over budget by ${Math.abs(status.remaining).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {status.remaining >= 0 && (
                    <span className="text-sm text-gray-600">
                      ${status.remaining.toFixed(2)} remaining
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Categories without budgets */}
      {categoriesWithoutBudget.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Categories Without Budgets
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesWithoutBudget.map(category => {
              const spent = expensesByCategory[category.id] || 0
              
              return (
                <div 
                  key={category.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setShowForm(true)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">
                      {category.name}
                    </h4>
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Current spending: ${spent.toFixed(2)}
                  </p>
                  <p className="text-xs text-primary-600 mt-2">
                    Click to set a budget
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetList
