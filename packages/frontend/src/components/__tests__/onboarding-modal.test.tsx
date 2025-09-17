import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingModal } from '../onboarding-modal'

// Mock wagmi hooks
const mockUseAccount = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('OnboardingModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: null,
    })
  })

  it('renders onboarding modal when open', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Welcome to AI Chain Creator Hub!')).toBeInTheDocument()
    expect(screen.getByText('Getting Started Progress')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(<OnboardingModal isOpen={false} onClose={() => {}} />)

    expect(container.firstChild).toBeNull()
  })

  it('shows wallet connection step as current when not connected', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    expect(screen.getByText('Connect your MetaMask or WalletConnect wallet to get started with AI Chain Creator Hub.')).toBeInTheDocument()
  })

  it('marks wallet step as completed when connected', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    // The wallet step should show as completed
    const walletStep = screen.getByText('Connect Your Wallet').closest('div')
    expect(walletStep).toHaveClass('bg-green-50')
  })

  it('navigates to next step when next button is clicked', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    // Click next to go to explore marketplace step
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Explore the Marketplace')).toBeInTheDocument()
    })
  })

  it('navigates to previous step when previous button is clicked', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    // Go to next step first
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Explore the Marketplace')).toBeInTheDocument()
    })

    // Go back to previous step
    const previousButton = screen.getByText('Previous')
    fireEvent.click(previousButton)

    await waitFor(() => {
      expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    })
  })

  it('skips onboarding when skip button is clicked', () => {
    const mockOnClose = jest.fn()
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={mockOnClose} />)

    const skipButton = screen.getByText('Skip Tutorial')
    fireEvent.click(skipButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-skipped', 'true')
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('completes step when action button is clicked', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    // Go to marketplace step
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Click browse marketplace action
    const browseButton = screen.getByText('Browse Marketplace')
    fireEvent.click(browseButton)

    expect(localStorageMock.setItem).toHaveBeenCalledWith('onboarding-completed-steps', expect.any(String))
  })

  it('shows completion message when all steps are completed', () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })
    localStorageMock.getItem.mockReturnValue('["connect-wallet","explore-marketplace","create-first-nft","setup-trading","join-community"]')

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Congratulations! 🎉')).toBeInTheDocument()
    expect(screen.getByText('Start Exploring')).toBeInTheDocument()
  })

  it('loads completed steps from localStorage', () => {
    const completedSteps = '["connect-wallet","explore-marketplace"]'
    localStorageMock.getItem.mockReturnValue(completedSteps)

    render(<OnboardingModal isOpen={true} onClose={() => {}} />)

    // Check that localStorage was called to load completed steps
    expect(localStorageMock.getItem).toHaveBeenCalledWith('onboarding-completed-steps')
  })
})
