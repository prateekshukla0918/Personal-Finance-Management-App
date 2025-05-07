import { FiArrowUp, FiArrowDown, FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'

function RecentTransactions() {
  const { transactions, categories } = useFinance()
  const navigate = useNavigate()
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  // Get category information
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: 'Uncategorized',
      color: '#6B7280'
    }
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Recent Transactions</h2>
        <button 
          onClick={() => navigate('/transactions')}
          className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
        >
          <span>View All</span>
          <FiEye className="ml-1 w-4 h-4" />
        </button>
      </div>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions yet</p>
          <button 
            onClick={() => navigate('/transactions')}
            className="mt-2 btn-primary"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map(transaction => {
            const category = getCategoryInfo(transaction.categoryId)
            
            return (
              <div key={transaction.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div 
                  className="p-2 rounded-full mr-3"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {transaction.type === 'income' ? (
                    <FiArrowUp 
                      className="h-5 w-5" 
                      style={{ color: category.color }} 
                    />
                  ) : (
                    <FiArrowDown 
                      className="h-5 w-5" 
                      style={{ color: category.color }} 
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700">
                    {transaction.description}
                  </h4>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                    <span 
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color 
                      }}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' 
                      ? 'text-success-600' 
                      : 'text-danger-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions