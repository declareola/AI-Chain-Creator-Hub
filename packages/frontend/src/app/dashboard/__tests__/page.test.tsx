import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../page'
import '@testing-library/jest-dom'

// Mock wagmi hooks
const mockUseAccount = jest.fn()

// Mock alert
const mockAlert = jest.fn()
global.alert = mockAlert

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows wallet connection message when not connected', () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: null,
    })

    render(<DashboardPage />)

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    expect(screen.getByText('Please connect your wallet to access the trading dashboard')).toBeInTheDocument()
  })

  it('renders dashboard when wallet is connected', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    expect(screen.getByText('Trading Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Monitor and manage your automated trading strategies')).toBeInTheDocument()
  })

  it('renders all tab navigation', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Strategies' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Executions' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Create Strategy' })).toBeInTheDocument()
  })

  it('displays overview statistics correctly', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    // Check overview tab is active by default
    expect(screen.getByRole('tabpanel', { name: /overview/i })).toBeInTheDocument()

    // Check metric cards are present
    expect(screen.getByText('Total Strategies')).toBeInTheDocument()
    expect(screen.getByText('Total P&L')).toBeInTheDocument()
    expect(screen.getByText('Total Trades')).toBeInTheDocument()
    expect(screen.getByText('Avg Win Rate')).toBeInTheDocument()
  })

  it('displays recent activity in overview', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Latest strategy executions')).toBeInTheDocument()
  })

  it('switches to strategies tab when clicked', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const strategiesTab = screen.getByRole('tab', { name: 'Strategies' })
    fireEvent.click(strategiesTab)

    await waitFor(() => {
      expect(screen.getByRole('tabpanel', { name: /strategies/i })).toBeInTheDocument()
    })
  })

  it('displays strategy cards in strategies tab', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const strategiesTab = screen.getByRole('tab', { name: 'Strategies' })
    fireEvent.click(strategiesTab)

    await waitFor(() => {
      expect(screen.getByText('Momentum Strategy')).toBeInTheDocument()
      expect(screen.getByText('Mean Reversion')).toBeInTheDocument()
    })
  })

  it('shows strategy status badges correctly', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const strategiesTab = screen.getByRole('tab', { name: 'Strategies' })
    fireEvent.click(strategiesTab)

    await waitFor(() => {
      const activeBadge = screen.getByText('active')
      const inactiveBadge = screen.getByText('inactive')
      expect(activeBadge).toBeInTheDocument()
      expect(inactiveBadge).toBeInTheDocument()
    })
  })

  it('displays strategy metrics correctly', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const strategiesTab = screen.getByRole('tab', { name: 'Strategies' })
    fireEvent.click(strategiesTab)

    await waitFor(() => {
      expect(screen.getByText('$1,250.50')).toBeInTheDocument()
      expect(screen.getByText('68.5%')).toBeInTheDocument()
      expect(screen.getByText('45')).toBeInTheDocument()
    })
  })

  it('toggles strategy status when button is clicked', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const strategiesTab = screen.getByRole('tab', { name: 'Strategies' })
    fireEvent.click(strategiesTab)

    await waitFor(() => {
      const pauseButton = screen.getByText('Pause Strategy')
      fireEvent.click(pauseButton)
    })

    // The button text should change after clicking
    await waitFor(() => {
      expect(screen.getByText('Activate Strategy')).toBeInTheDocument()
    })
  })

  it('switches to executions tab when clicked', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const executionsTab = screen.getByRole('tab', { name: 'Executions' })
    fireEvent.click(executionsTab)

    await waitFor(() => {
      expect(screen.getByRole('tabpanel', { name: /executions/i })).toBeInTheDocument()
      expect(screen.getByText('Strategy Executions')).toBeInTheDocument()
    })
  })

  it('displays execution history in executions tab', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const executionsTab = screen.getByRole('tab', { name: 'Executions' })
    fireEvent.click(executionsTab)

    await waitFor(() => {
      expect(screen.getByText('BUY 1000 VIBE')).toBeInTheDocument()
      expect(screen.getByText('SELL 800 VIBE')).toBeInTheDocument()
    })
  })

  it('switches to create strategy tab when clicked', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const createTab = screen.getByRole('tab', { name: 'Create Strategy' })
    fireEvent.click(createTab)

    await waitFor(() => {
      expect(screen.getByRole('tabpanel', { name: /create/i })).toBeInTheDocument()
      expect(screen.getByText('Create New Strategy')).toBeInTheDocument()
    })
  })

  it('renders strategy creation form', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const createTab = screen.getByRole('tab', { name: 'Create Strategy' })
    fireEvent.click(createTab)

    await waitFor(() => {
      expect(screen.getByLabelText('Strategy Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Risk Level')).toBeInTheDocument()
      expect(screen.getByLabelText('Max Trade Amount (VIBE)')).toBeInTheDocument()
      expect(screen.getByLabelText('Auto-execute trades')).toBeInTheDocument()
    })
  })

  it('creates strategy when form is submitted with valid data', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const createTab = screen.getByRole('tab', { name: 'Create Strategy' })
    fireEvent.click(createTab)

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('Enter strategy name')
      const descriptionTextarea = screen.getByPlaceholderText('Describe your trading strategy...')

      fireEvent.change(nameInput, { target: { value: 'Test Strategy' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A test trading strategy' } })
    })

    const createButton = screen.getByText('Create Strategy')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Strategy created successfully!')
    })
  })

  it('shows error when creating strategy with empty fields', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const createTab = screen.getByRole('tab', { name: 'Create Strategy' })
    fireEvent.click(createTab)

    await waitFor(() => {
      const createButton = screen.getByText('Create Strategy')
      fireEvent.click(createButton)
    })

    expect(mockAlert).toHaveBeenCalledWith('Please fill in all required fields')
  })

  it('includes accessibility features', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    // Check for skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()

    // Check for ARIA labels and roles
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })

  it('displays execution status badges correctly', async () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })

    render(<DashboardPage />)

    const executionsTab = screen.getByRole('tab', { name: 'Executions' })
    fireEvent.click(executionsTab)

    await waitFor(() => {
      const completedBadges = screen.getAllByText('completed')
      expect(completedBadges).toHaveLength(2)
    })
  })
})
