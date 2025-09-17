import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WalletConnect } from '../wallet-connect'

// Mock wagmi hooks
const mockUseAccount = jest.fn()
const mockUseConnect = jest.fn()
const mockUseDisconnect = jest.fn()

describe('WalletConnect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders connect button when wallet is not connected', () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false,
    })
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [{ id: 'metaMask', name: 'MetaMask' }],
      isLoading: false,
      pendingConnector: null,
    })

    render(<WalletConnect />)

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('renders wallet address when connected', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890'
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    })
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    })

    render(<WalletConnect />)

    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
  })

  it('calls connect function when connect button is clicked', async () => {
    const mockConnect = jest.fn()
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false,
    })
    mockUseConnect.mockReturnValue({
      connect: mockConnect,
      connectors: [{ id: 'metaMask', name: 'MetaMask' }],
      isLoading: false,
      pendingConnector: null,
    })

    render(<WalletConnect />)

    const connectButton = screen.getByText('Connect Wallet')
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled()
    })
  })

  it('calls disconnect function when disconnect button is clicked', async () => {
    const mockDisconnect = jest.fn()
    const mockAddress = '0x1234567890123456789012345678901234567890'
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    })
    mockUseDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
    })

    render(<WalletConnect />)

    const disconnectButton = screen.getByText('Disconnect')
    fireEvent.click(disconnectButton)

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  it('shows loading state when connecting', () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false,
    })
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [{ id: 'metaMask', name: 'MetaMask' }],
      isLoading: true,
      pendingConnector: { id: 'metaMask', name: 'MetaMask' },
    })

    render(<WalletConnect />)

    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })

  it('formats wallet address correctly', () => {
    const longAddress = '0x1234567890123456789012345678901234567890'
    const shortAddress = '0x1234...7890'

    mockUseAccount.mockReturnValue({
      address: longAddress,
      isConnected: true,
    })
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    })

    render(<WalletConnect />)

    expect(screen.getByText(shortAddress)).toBeInTheDocument()
  })
})
