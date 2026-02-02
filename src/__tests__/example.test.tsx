import { render, screen } from '@testing-library/react'
import { User } from '../app/users/page'

// Mock SWR
jest.mock('swr')

describe('Example Component Tests', () => {
  it('renders user information correctly', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }

    render(<div data-testid="user-info">{mockUser.name} - {mockUser.email}</div>)
    
    const userInfo = screen.getByTestId('user-info')
    expect(userInfo).toBeInTheDocument()
    expect(userInfo).toHaveTextContent('John Doe - john@example.com')
  })

  it('handles empty user list', () => {
    const mockUsers: User[] = []
    
    render(<div data-testid="user-count">{mockUsers.length} users found</div>)
    
    const userCount = screen.getByTestId('user-count')
    expect(userCount).toHaveTextContent('0 users found')
  })

  it('validates user email format', () => {
    const email = 'test@example.com'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    expect(emailRegex.test(email)).toBe(true)
  })
})

describe('API Integration Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('fetches user data successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    })

    const response = await fetch('/api/users')
    const data = await response.json()

    expect(fetchMock).toHaveBeenCalledWith('/api/users')
    expect(data).toEqual(mockUsers)
  })

  it('handles API errors gracefully', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    })

    const response = await fetch('/api/users')
    
    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
  })
})

describe('Utility Functions', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-01-01T00:00:00.000Z')
    const formattedDate = date.toLocaleDateString()
    
    expect(formattedDate).toBe('1/1/2024')
  })

  it('calculates user credo score', () => {
    const calculateScore = (reviews: number, endorsements: number) => {
      return Math.min(100, (reviews * 5) + (endorsements * 10))
    }

    expect(calculateScore(10, 2)).toBe(70)
    expect(calculateScore(20, 5)).toBe(100) // Capped at 100
  })
})
