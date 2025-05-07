import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Initial state
const initialState = {
  transactions: [],
  categories: [
    { id: 'income', name: 'Income', type: 'income', color: '#10B981' },
    { id: 'salary', name: 'Salary', type: 'income', color: '#10B981' },
    { id: 'investment', name: 'Investment', type: 'income', color: '#10B981' },
    { id: 'food', name: 'Food & Dining', type: 'expense', color: '#EF4444' },
    { id: 'rent', name: 'Rent & Housing', type: 'expense', color: '#EF4444' },
    { id: 'utilities', name: 'Utilities', type: 'expense', color: '#F59E0B' },
    { id: 'transportation', name: 'Transportation', type: 'expense', color: '#F59E0B' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#8B5CF6' },
    { id: 'shopping', name: 'Shopping', type: 'expense', color: '#EC4899' },
    { id: 'healthcare', name: 'Healthcare', type: 'expense', color: '#3B82F6' },
    { id: 'other', name: 'Other', type: 'expense', color: '#6B7280' }
  ],
  budgets: {},
  savingsGoals: [],
  currency: 'USD',
  exchangeRates: {},
}

const loadState = () => {
  try {
    const savedState = localStorage.getItem('financeData')
    return savedState ? JSON.parse(savedState) : initialState
  } catch (e) {
    console.error('Error loading state from localStorage:', e)
    return initialState
  }
}

function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      }
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.categoryId]: action.payload.amount
        }
      }
    case 'DELETE_BUDGET':
      const updatedBudgets = { ...state.budgets }
      delete updatedBudgets[action.payload]
      return { ...state, budgets: updatedBudgets }
    case 'ADD_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: [...state.savingsGoals, action.payload]
      }
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        )
      }
    case 'DELETE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter(goal => goal.id !== action.payload)
      }
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_EXCHANGE_RATES':
      return { ...state, exchangeRates: action.payload }
    case 'RESET_DATA':
      return initialState
    default:
      return state
  }
}

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(state))
  }, [state])

  const addTransaction = transaction => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        ...transaction,
        id: transaction.id || uuidv4(),
        date: transaction.date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    })
  }

  const updateTransaction = transaction => {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: {
        ...transaction,
        updatedAt: new Date().toISOString()
      }
    })
  }

  const deleteTransaction = id => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  }

  const addCategory = category => {
    dispatch({
      type: 'ADD_CATEGORY',
      payload: { ...category, id: category.id || uuidv4() }
    })
  }

  const updateCategory = category => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category })
  }

  const deleteCategory = id => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
  }

  const updateBudget = (categoryId, amount) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: { categoryId, amount } })
  }

  const deleteBudget = categoryId => {
    dispatch({ type: 'DELETE_BUDGET', payload: categoryId })
  }

  const addSavingsGoal = goal => {
    dispatch({
      type: 'ADD_SAVINGS_GOAL',
      payload: {
        ...goal,
        id: goal.id || uuidv4(),
        currentAmount: goal.currentAmount || 0,
        createdAt: new Date().toISOString()
      }
    })
  }

  const updateSavingsGoal = goal => {
    dispatch({
      type: 'UPDATE_SAVINGS_GOAL',
      payload: {
        ...goal,
        updatedAt: new Date().toISOString()
      }
    })
  }

  const deleteSavingsGoal = id => {
    dispatch({ type: 'DELETE_SAVINGS_GOAL', payload: id })
  }

  const setCurrency = currency => {
    dispatch({ type: 'SET_CURRENCY', payload: currency })
  }

  const setExchangeRates = rates => {
    dispatch({ type: 'SET_EXCHANGE_RATES', payload: rates })
  }

  const resetData = () => {
    dispatch({ type: 'RESET_DATA' })
  }

  const financialCalculations = useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses

    const transactionsByCategory = {}
    const expensesByCategory = {}
    const incomeByCategory = {}

    state.categories.forEach(category => {
      const filtered = state.transactions.filter(
        t => t.categoryId === category.id
      )

      transactionsByCategory[category.id] = filtered

      const total = filtered.reduce((sum, t) => sum + t.amount, 0)
      if (category.type === 'expense') expensesByCategory[category.id] = total
      if (category.type === 'income') incomeByCategory[category.id] = total
    })

    const budgetStatus = {}
    Object.keys(state.budgets).forEach(categoryId => {
      const budget = state.budgets[categoryId]
      const spent = expensesByCategory[categoryId] || 0
      const percentage = budget > 0 ? (spent / budget) * 100 : 0

      budgetStatus[categoryId] = {
        budget,
        spent,
        remaining: budget - spent,
        percentage: Math.min(percentage, 100)
      }
    })

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionsByCategory,
      expensesByCategory,
      incomeByCategory,
      budgetStatus
    }
  }, [state.transactions, state.categories, state.budgets])

  const getBalance = () => financialCalculations.balance

  const recentTransactions = useMemo(() => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [state.transactions])

  const getMonthlyExpenses = () => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return state.transactions.filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && date >= startDate && date <= endDate
    })
  }

  const getMonthlyIncome = () => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return state.transactions.filter(t => {
      const date = new Date(t.date)
      return t.type === 'income' && date >= startDate && date <= endDate
    })
  }

  const getSuggestedBudgets = () => {
    const { totalExpenses, totalIncome, expensesByCategory } = financialCalculations
    const result = {}

    if (totalExpenses === 0 || totalIncome === 0) return result

    state.categories.forEach(category => {
      if (category.type === 'expense') {
        const spent = expensesByCategory[category.id] || 0
        let percentage = spent / totalExpenses

        if (['rent', 'utilities', 'food', 'healthcare', 'transportation'].includes(category.id)) {
          percentage = Math.min(percentage * 1.1, 0.5 * percentage)
        } else if (['entertainment', 'shopping'].includes(category.id)) {
          percentage = Math.min(percentage * 0.9, 0.3 * percentage)
        }

        result[category.id] = Math.round(totalIncome * percentage)
      }
    })

    return result
  }

  const exportTransactionsToCSV = () => {
    if (state.transactions.length === 0) return null

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category']

    const rows = state.transactions.map(t => {
      const category = state.categories.find(c => c.id === t.categoryId)
      return [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.amount.toFixed(2),
        t.type,
        category ? category.name : 'Uncategorized'
      ]
    })

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    return csvContent
  }

  const getTransactionsForDateRange = (startDate, endDate) => {
    return state.transactions.filter(t => {
      const date = new Date(t.date)
      return date >= startDate && date <= endDate
    })
  }

  const getBudgetStatus = () => financialCalculations.budgetStatus

  const getExpensesByCategory = () => financialCalculations.expensesByCategory

  const value = {
    ...state,
    ...financialCalculations,
    recentTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    setCurrency,
    setExchangeRates,
    resetData,
    getMonthlyExpenses,
    getMonthlyIncome,
    getSuggestedBudgets,
    exportTransactionsToCSV,
    getTransactionsForDateRange,
    getBalance,
    getBudgetStatus,
    getExpensesByCategory // ✅ finally added this line bro
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
