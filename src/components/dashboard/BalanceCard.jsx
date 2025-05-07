import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { useFinance } from '../../context/FinanceContext'

function BalanceCard() {
  const { totalIncome, totalExpenses, getBalance } = useFinance()

  const balance = getBalance()

  return (
    <div className="card">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Balance Overview</h2>

        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-1">
            <span className={balance >= 0 ? 'text-success-600' : 'text-danger-500'}>
              ${balance.toFixed(2)}
            </span>
          </h3>
          <p className="text-sm text-gray-500">Current Balance</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-success-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-full mr-3">
                <FiArrowUp className="h-4 w-4 text-success-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Income</h4>
                <p className="text-success-600 font-semibold">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-danger-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-full mr-3">
                <FiArrowDown className="h-4 w-4 text-danger-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Expenses</h4>
                <p className="text-danger-500 font-semibold">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard
