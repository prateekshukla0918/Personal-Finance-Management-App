import { NavLink } from 'react-router-dom'
import { 
  FiHome,
  FiDollarSign,
  FiPieChart,
  FiTarget,
  FiSettings
} from 'react-icons/fi'

function Sidebar() {
  const navItems = [
    { to: '/', icon: FiHome, label: 'Dashboard' },
    { to: '/transactions', icon: FiDollarSign, label: 'Transactions' },
    { to: '/budget', icon: FiPieChart, label: 'Budget' },
    { to: '/savings', icon: FiTarget, label: 'Savings Goals' },
    { to: '/settings', icon: FiSettings, label: 'Settings' }
  ]

  return (
    <div className="h-full flex flex-col bg-white shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-500 text-white rounded-lg flex items-center justify-center">
            <FiDollarSign className="h-5 w-5" />
          </div>
          <h1 className="ml-2 text-xl font-semibold text-gray-800">FinTrack</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'}
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section - App version */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <span className="text-xs text-gray-500">FinTrack v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar