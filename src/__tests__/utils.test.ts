// Simple utility tests to demonstrate CI pipeline functionality

describe('Utility Functions', () => {
  it('should add two numbers correctly', () => {
    const add = (a: number, b: number) => a + b
    expect(add(2, 3)).toBe(5)
  })

  it('should format a date string', () => {
    const date = new Date('2024-01-01')
    expect(date.getFullYear()).toBe(2024)
  })

  it('should validate email format', () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
  })

  it('should calculate credo score correctly', () => {
    const calculateCredoScore = (reviews: number, endorsements: number) => {
      return Math.min(100, (reviews * 5) + (endorsements * 10))
    }

    expect(calculateCredoScore(10, 2)).toBe(70)
    expect(calculateCredoScore(20, 5)).toBe(100) // Capped at 100
    expect(calculateCredoScore(0, 0)).toBe(0)
  })
})
