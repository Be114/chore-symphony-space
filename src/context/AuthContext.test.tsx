import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { supabase } from '@/integrations/supabase/client'

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

describe('AuthContext', () => {
  const mockSession = {
    user: { id: '1', email: 'test@example.com' },
    expires_at: 123456789,
  }

  const mockSubscription = {
    unsubscribe: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })
    ;(supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: mockSubscription },
    })
  })

  it('initializes with loading state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.session).toBe(null)
    expect(result.current.user).toBe(null)
  })

  it('provides authentication context to children', async () => {
    const TestComponent = () => {
      const { session, user, isLoading, error } = useAuth()
      return (
        <div>
          <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
          <div data-testid="session">{session ? 'authenticated' : 'unauthenticated'}</div>
          <div data-testid="user-email">{user?.email}</div>
          <div data-testid="error">{error?.message || 'no error'}</div>
        </div>
      )
    }

    const { findByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 初期状態（ローディング）を確認
    expect(await findByTestId('loading')).toHaveTextContent('loading')

    // ローディング完了後の状態を確認
    const loadingElement = await findByTestId('loading')
    const sessionElement = await findByTestId('session')
    const userEmailElement = await findByTestId('user-email')
    const errorElement = await findByTestId('error')

    expect(loadingElement).toHaveTextContent('loaded')
    expect(sessionElement).toHaveTextContent('authenticated')
    expect(userEmailElement).toHaveTextContent('test@example.com')
    expect(errorElement).toHaveTextContent('no error')
  })

  it('handles session initialization error', async () => {
    const mockError = new Error('Failed to initialize session')
    ;(supabase.auth.getSession as any).mockRejectedValue(mockError)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    // エラーが発生するまで待機
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toEqual(mockError)
    expect(result.current.session).toBe(null)
    expect(result.current.user).toBe(null)
  })

  it('updates context when auth state changes', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    // 初期化完了まで待機
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.session).toEqual(mockSession)
    expect(result.current.user).toEqual(mockSession.user)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)

    // Auth状態の変更をシミュレート
    const newSession = {
      user: { id: '2', email: 'new@example.com' },
      expires_at: 987654321,
    }

    await act(async () => {
      const authStateCallback = (supabase.auth.onAuthStateChange as any).mock.calls[0][1]
      authStateCallback('SIGNED_IN', newSession)
    })

    expect(result.current.session).toEqual(newSession)
    expect(result.current.user).toEqual(newSession.user)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('cleans up subscription on unmount', () => {
    const { unmount } = render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    )

    unmount()
    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })

  it('throws error when useAuth is used outside of AuthProvider', () => {
    const { result } = renderHook(() => useAuth())
    expect(() => result.current).toThrow('useAuth must be used within an AuthProvider')
  })
})
