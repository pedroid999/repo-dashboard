import { render, screen } from '@workspace/test-utils'
import Page from '../app/page'

describe('Page', () => {
  it('renders landing heading', () => {
    render(<Page />)
    expect(
      screen.getByRole('heading', { level: 1, name: /tech lead dashboard/i })
    ).toBeInTheDocument()
  })

  it('renders at least one button', () => {
    render(<Page />)
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1)
  })
})
