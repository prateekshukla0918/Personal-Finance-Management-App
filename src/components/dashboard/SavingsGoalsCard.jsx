import { useNavigate } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import { FiTarget, FiEye } from 'react-icons/fi'

function SavingsGoalsCard() {
  const { savingsGoals } = useFinance()
  const navigate = useNavigate()
  
  // Show only active goals (not completed)
  // Sort by percentage completion (highest first)
  const activeGoals = [...savingsGoals]
    .filter(goal => goal.currentAmount < goal.targetAmount)
    .sort((a, b) => {
      const percentA = (a.currentAmount / a.targetAmount) * 100
      const percentB = (b.currentAmount / b.targetAmount) * 100
      return percentB - percentA
    })
    .slice(0, 3)
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Savings Goals</h2>
        <button 
          onClick={() => navigate('/savings')}
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          <span>View All</span>
          <FiEye className="ml-1 w-4 h-4" />
        </button>
      </div>
      
      {activeGoals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="flex justify-center mb-2">
            <FiTarget className="h-10 w-10 text-gray-400" />
          </div>
          <p>No savings goals yet</p>
          <button 
            onClick={() => navigate('/savings')}
            className="mt-2 btn-primary"
          >
            Create a Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.map(goal => {
            const percentComplete = (goal.currentAmount / goal.targetAmount) * 100
            
            let progressColor = '#3B82F6' // Default blue
            if (percentComplete >= 75) {
              progressColor = '#10B981' // Success green
            } else if (percentComplete >= 50) {
              progressColor = '#3B82F6' // Primary blue
            } else if (percentComplete >= 25) {
              progressColor = '#F59E0B' // Warning yellow
            } else {
              progressColor = '#9CA3AF' // Gray
            }
            
            return (
              <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{goal.name}</h3>
                  <span className="text-sm text-gray-600">
                    {percentComplete.toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${percentComplete}%`,
                      backgroundColor: progressColor 
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ${goal.currentAmount.toFixed(2)}
                  </span>
                  <span className="text-gray-700 font-medium">
                    ${goal.targetAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SavingsGoalsCard