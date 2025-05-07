import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiSearch } from 'react-icons/fi'
import TransactionForm from './TransactionForm'

function TransactionList() {
  const { 
    transactions, 
    categories, 
    deleteTransaction,
    exportTransactionsToCSV
  } = useFinance()
  
  // State for selected transaction and modal
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date') // 'date', 'amount'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Get category information
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: 'Uncategorized',
      color: '#6B7280'
    }
  }
  
  // Handle transaction deletion
  const handleDelete = (id) => {
    setTransactionToDelete(id)
    setShowDeleteConfirm(true)
  }
  
  // Confirm deletion
  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete)
      setShowDeleteConfirm(false)
      setTransactionToDelete(null)
    }
  }
  
  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setTransactionToDelete(null)
  }
  
  // Handle transaction edit
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setShowForm(true)
  }
  
  // Handle form save and cancel
  const handleFormSave = () => {
    setShowForm(false)
    setSelectedTransaction(null)
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedTransaction(null)
  }
  
  // Export transactions to CSV
  const handleExport = () => {
    const csv = exportTransactionsToCSV()
    if (!csv) {
      alert('No transactions to export')
      return
    }
    
    // Create a blob and download the file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = transaction.description.toLowerCase().includes(searchLower)
      
      // Filter by type
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      
      // Filter by category
      const matchesCategory = categoryFilter === 'all' || transaction.categoryId === categoryFilter
      
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount
      }
      return 0
    })
  
  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})
  
  // Sort dates for display
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return sortOrder === 'asc' 
      ? new Date(a) - new Date(b)
      : new Date(b) - new Date(a)
  })
  
  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <button
          onClick={() => {
            setSelectedTransaction(null)
            setShowForm(true)
          }}
          className="btn-primary"
        >
          Add New Transaction
        </button>
        <button
          onClick={handleExport}
          className="btn-secondary"
          disabled={transactions.length === 0}
        >
          Export to CSV
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="text-lg font-medium mb-4">Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {/* Type filter */}
          <div>
            <label className="label">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div>
            <label className="label">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <label className="label">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input flex-1"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn-secondary px-2"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transaction form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
            </div>
            <div className="p-6">
              <TransactionForm
                transaction={selectedTransaction}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Are you sure you want to delete this transaction?</p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={cancelDelete}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Transactions list */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <h3 className="text-sm font-medium text-gray-500">
                  {formatDate(date)}
                </h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {groupedTransactions[date].map(transaction => {
                  const category = getCategoryInfo(transaction.categoryId)
                  
                  return (
                    <div 
                      key={transaction.id} 
                      className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div 
                        className="p-2 rounded-full mr-3 flex-shrink-0"
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
                        <h4 className="text-gray-800 font-medium">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center mt-1">
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color 
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right mr-4">
                        <p className={`font-semibold ${
                          transaction.type === 'income' 
                            ? 'text-success-600' 
                            : 'text-danger-500'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          ${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleEdit(transaction)}
                          className="p-1.5 text-gray-600 hover:text-primary-500 rounded-full hover:bg-gray-100"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1.5 text-gray-600 hover:text-danger-500 rounded-full hover:bg-gray-100"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionList