import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import SavingsGoalCard from '../components/savings/SavingsGoalCard'
import SavingsGoalForm from '../components/savings/SavingsGoalForm'

function SavingsGoals() {
  const { savingsGoals } = useFinance()
  const [showForm, setShowForm] = useState(false)
  
  // Group goals by completion status
  const activeGoals = savingsGoals.filter(goal => 
    goal.currentAmount < goal.targetAmount
  )
  
  const completedGoals = savingsGoals.filter(goal => 
    goal.currentAmount >= goal.targetAmount
  )
  
  // Handle form save and cancel
  const handleFormSave = () => {
    setShowForm(false)
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Savings Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add New Goal
        </button>
      </div>
      
      {/* New goal form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Savings Goal
              </h3>
            </div>
            <div className="p-6">
              <SavingsGoalForm
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Active goals */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Goals</h2>
        
        {activeGoals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No active goals</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 btn-primary"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map(goal => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>
      
      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map(goal => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default SavingsGoals