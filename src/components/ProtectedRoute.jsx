import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  // State Management (derived state)
  const isAuthenticated = !!localStorage.getItem('authToken')

  // Conditional Rendering
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

export default ProtectedRoute