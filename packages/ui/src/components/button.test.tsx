import { render, screen } from '@workspace/test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders with accessible name', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick handler', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
