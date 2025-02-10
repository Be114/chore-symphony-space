import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { AuthProvider } from './context/AuthContext'

// Mock the AuthContext
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: vi.fn()
}))

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}))

describe('App', () => {
  it('renders without crashing', () => {
    const useAuth = vi.spyOn(require('./context/AuthContext'), 'useAuth')
    useAuth.mockReturnValue({ session: null, isLoading: false, error: null })
    
    render(<App />)
    expect(document.body).toBeDefined()
  })
})

describe('PrivateRoute', () => {
  it('shows loading state', () => {
    const useAuth = vi.spyOn(require('./context/AuthContext'), 'useAuth')
    useAuth.mockReturnValue({ session: null, isLoading: true, error: null })
    
    render(<App />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    const useAuth = vi.spyOn(require('./context/AuthContext'), 'useAuth')
    useAuth.mockReturnValue({ 
      session: null, 
      isLoading: false, 
      error: new Error('Auth error') 
    })
    
    render(<App />)
    expect(screen.getByText('Error: Auth error')).toBeInTheDocument()
  })

  it('redirects to /auth when not authenticated', () => {
    const useAuth = vi.spyOn(require('./context/AuthContext'), 'useAuth')
    useAuth.mockReturnValue({ session: null, isLoading: false, error: null })
    
    render(<App />)
    const navigation = screen.getByTestId('navigate')
    expect(navigation).toHaveAttribute('data-to', '/auth')
  })

  it('renders children when authenticated', () => {
    const useAuth = vi.spyOn(require('./context/AuthContext'), 'useAuth')
    useAuth.mockReturnValue({ 
      session: { user: { id: '1' } }, 
      isLoading: false, 
      error: null 
    })
    
    render(<App />)
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
})
