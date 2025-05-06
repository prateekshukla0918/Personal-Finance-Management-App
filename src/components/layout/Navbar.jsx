import { useNavigate } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import { useState, useEffect, useRef } from 'react'
import { 
  FiMenu, 
  FiBell, 
  FiUser, 
  FiDollarSign, 
  FiSettings, 
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi'

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { getBalance } = useFinance()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const balance = getBalance()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button and logo */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-primary-500 md:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="md:hidden ml-3 text-lg font-semibold text-primary-600">
              FinTrack
            </div>
          </div>

          {/* Right side - Balance, notifications, profile */}
          <div className="flex items-center space-x-4">
            {/* Balance */}
            <div className="hidden md:flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
              <FiDollarSign className="text-primary-500 mr-1" />
              <span className={`font-medium ${balance >= 0 ? 'text-success-600' : 'text-danger-500'}`}>
                ${balance.toFixed(2)}
              </span>
            </div>
            
            {/* Notifications */}
            <button className="text-gray-500 hover:text-primary-500 transition duration-150 relative">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center text-gray-700 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-primary-600" />
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium">John Doe</span>
                <FiChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                  <button 
                    onClick={() => {
                      navigate('/settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiSettings className="mr-2 h-4 w-4" />
                    Settings
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar