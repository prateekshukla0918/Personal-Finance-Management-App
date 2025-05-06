import { useFinance } from '../context/FinanceContext'
import BalanceCard from '../components/dashboard/BalanceCard'
import ExpensesChart from '../components/dashboard/ExpensesChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import SavingsGoalsCard from '../components/dashboard/SavingsGoalsCard'

function Dashboard() {
  const { transactions } = useFinance()
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to FinTrack!</h2>
          <p className="text-gray-600 mb-6">
            Start tracking your finances by adding your first transaction.
          </p>
          <button
            onClick={() => window.location.href = '/transactions'}
            className="btn-primary"
          >
            Add Your First Transaction
          </button>
        </div>
      ) : (
        <>
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BalanceCard />
            <ExpensesChart />
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RecentTransactions />
            </div>
            <div>
              <BudgetProgress />
            </div>
          </div>
          
          {/* Third row */}
          <div>
            <SavingsGoalsCard />
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard