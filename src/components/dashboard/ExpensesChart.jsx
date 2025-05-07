import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { useFinance } from '../../context/FinanceContext'

// Register Chart.js components
Chart.register(...registerables)

function ExpensesChart() {
  const { getExpensesByCategory, categories } = useFinance()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  
  useEffect(() => {
    // Get expense data
    const expensesByCategory = getExpensesByCategory()
    
    // Filter expense categories
    const expenseCategories = categories.filter(cat => cat.type === 'expense')
    
    // Prepare data for the chart
    const labels = []
    const data = []
    const backgroundColors = []
    
    expenseCategories.forEach(category => {
      const amount = expensesByCategory[category.id] || 0
      if (amount > 0) {
        labels.push(category.name)
        data.push(amount)
        backgroundColors.push(category.color)
      }
    })
    
    // If we have a previous chart, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    
    // Create the chart
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderWidth: 1,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw
                  return ` $${value.toFixed(2)}`
                }
              }
            }
          },
          cutout: '70%',
          animation: {
            animateRotate: true,
            animateScale: true
          }
        }
      })
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [getExpensesByCategory, categories])
  
  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h2>
      <div className="h-64">
        {/* If no data, show a message */}
        <div className="h-full flex items-center justify-center">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  )
}

export default ExpensesChart