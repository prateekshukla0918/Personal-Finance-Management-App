import { useFinance } from '../../context/FinanceContext'

function BudgetProgress() {
  const { getBudgetStatus, categories } = useFinance()
  
  const budgetStatus = getBudgetStatus()
  const budgetCategories = Object.keys(budgetStatus)
  
  // Filter to just show expense categories that have a budget
  const expenseCategories = categories.filter(
    cat => cat.type === 'expense' && budgetCategories.includes(cat.id)
  )
  
  // Sort categories by percentage spent (high to low)
  const sortedCategories = [...expenseCategories].sort((a, b) => {
    const statusA = budgetStatus[a.id]
    const statusB = budgetStatus[b.id]
    return statusB.percentage - statusA.percentage
  })
  
  // Show only top 4 categories
  const topCategories = sortedCategories.slice(0, 4)
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Budget Progress</h2>
      </div>
      
      {topCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No budgets set yet</p>
          <button className="mt-2 btn-primary" onClick={() => window.location.href = '/budget'}>
            Create a Budget
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {topCategories.map(category => {
            const status = budgetStatus[category.id]
            
            let progressColor = category.color
            if (status.percentage >= 90) {
              progressColor = '#EF4444' // Danger red
            } else if (status.percentage >= 75) {
              progressColor = '#F59E0B' // Warning yellow
            }
            
            return (
              <div key={category.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ${status.spent.toFixed(2)} / ${status.budget.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${status.percentage}%`,
                      backgroundColor: progressColor 
                    }}
                  />
                </div>
                
                <div className="flex justify-end mt-1">
                  <span 
                    className="text-xs font-medium"
                    style={{ color: progressColor }}
                  >
                    {status.percentage.toFixed(0)}%
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

export default BudgetProgress