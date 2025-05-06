import BudgetList from '../components/budget/BudgetList'

function Budget() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">Budget Planning</h1>
      <BudgetList />
    </div>
  )
}

export default Budget