import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-[70vh]">
      <div className="text-9xl font-bold text-primary-200">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">Page Not Found</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="btn-primary mt-6 flex items-center"
      >
        <FiHome className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound