import TransactionList from '../components/transactions/TransactionList'

function Transactions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
      <TransactionList />
    </div>
  )
}

export default Transactions