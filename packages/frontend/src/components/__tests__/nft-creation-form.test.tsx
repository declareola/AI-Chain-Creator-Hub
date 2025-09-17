import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NFTCreationForm from '../nft-creation-form'
import { apiClient } from '@/lib/api'
import '@testing-library/jest-dom'

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

// Mock alert
const mockAlert = jest.fn()
global.alert = mockAlert

describe('NFTCreationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
    })
    localStorageMock.getItem.mockReturnValue('mock-auth-token')
  })

  it('renders the form with initial state', () => {
    render(<NFTCreationForm />)

    expect(screen.getByText('Create AI-Generated NFT')).toBeInTheDocument()
    expect(screen.getByText('1. Generate AI Artwork')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe the artwork you want to create...')).toBeInTheDocument()
    expect(screen.getByText('Generate')).toBeInTheDocument()
  })

  it('shows wallet connection reminder when not connected', () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false,
    })

    render(<NFTCreationForm />)

    expect(screen.getByText('Please connect your wallet to mint NFTs')).toBeInTheDocument()
  })

  it('disables generate button when prompt is empty', () => {
    render(<NFTCreationForm />)

    const generateButton = screen.getByText('Generate')
    expect(generateButton).toBeDisabled()
  })

  it('enables generate button when prompt is entered', async () => {
    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    expect(generateButton).not.toBeDisabled()
  })

  it('shows error when trying to generate without prompt', async () => {
    render(<NFTCreationForm />)

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    expect(screen.getByText('Please enter a prompt for AI generation')).toBeInTheDocument()
  })

  it('calls generateAI API and shows preview on success', async () => {
    const mockResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockResponse)

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(apiClient.generateAI).toHaveBeenCalledWith({
        prompt: 'A beautiful landscape',
        style: 'artistic',
        size: '512x512',
      })
    })

    expect(screen.getByText('2. Preview')).toBeInTheDocument()
    expect(screen.getByAltText('Generated artwork')).toBeInTheDocument()
    expect(screen.getByText('3. NFT Details')).toBeInTheDocument()
  })

  it('shows loading state during generation', async () => {
    ;(apiClient.generateAI as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })

  it('shows error on generation failure', async () => {
    ;(apiClient.generateAI as jest.Mock).mockRejectedValue(new Error('Generation failed'))

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to generate AI image')).toBeInTheDocument()
    })
  })

  it('auto-fills title with prompt preview', async () => {
    const mockResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape with mountains and a lake',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockResponse)

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape with mountains and a lake')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      expect(titleInput).toHaveValue('A beautiful landscape with mountains and a lake')
    })
  })

  it('disables mint button when required fields are empty', async () => {
    const mockResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockResponse)

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const mintButton = screen.getByText('Mint NFT')
      expect(mintButton).toBeDisabled()
    })
  })

  it('enables mint button when all required fields are filled', async () => {
    const mockResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockResponse)

    render(<NFTCreationForm />)

    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    const mintButton = screen.getByText('Mint NFT')
    expect(mintButton).not.toBeDisabled()
  })

  it('calls createNFT API and shows success on mint', async () => {
    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    const mockMintResponse = {
      id: 'nft-123',
      tokenId: '123',
      transactionHash: '0x1234567890abcdef',
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)
    ;(apiClient.createNFT as jest.Mock).mockResolvedValue(mockMintResponse)

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    // Mint NFT
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    await waitFor(() => {
      expect(apiClient.createNFT).toHaveBeenCalledWith({
        title: 'Beautiful Landscape',
        description: 'A stunning AI-generated landscape',
        imageUrl: 'https://example.com/generated-image.png',
        aiGenerationId: 'generation-123',
        price: undefined,
      })
    })

    expect(mockAlert).toHaveBeenCalledWith('NFT created successfully! Token ID: 123')
  })

  it('includes price in mint request when provided', async () => {
    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    const mockMintResponse = {
      id: 'nft-123',
      tokenId: '123',
      transactionHash: '0x1234567890abcdef',
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)
    ;(apiClient.createNFT as jest.Mock).mockResolvedValue(mockMintResponse)

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')
      const priceInput = screen.getByPlaceholderText('Price (optional)')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
      fireEvent.change(priceInput, { target: { value: '1.5' } })
    })

    // Mint NFT
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    await waitFor(() => {
      expect(apiClient.createNFT).toHaveBeenCalledWith({
        title: 'Beautiful Landscape',
        description: 'A stunning AI-generated landscape',
        imageUrl: 'https://example.com/generated-image.png',
        aiGenerationId: 'generation-123',
        price: 1.5,
      })
    })
  })

  it('shows loading state during minting', async () => {
    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)
    ;(apiClient.createNFT as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    // Mint NFT
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    expect(screen.getByText('Minting...')).toBeInTheDocument()
  })

  it('shows error on mint failure', async () => {
    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)
    ;(apiClient.createNFT as jest.Mock).mockRejectedValue(new Error('Minting failed'))

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    // Mint NFT
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to create NFT')).toBeInTheDocument()
    })
  })

  it('resets form after successful mint', async () => {
    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    const mockMintResponse = {
      id: 'nft-123',
      tokenId: '123',
      transactionHash: '0x1234567890abcdef',
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)
    ;(apiClient.createNFT as jest.Mock).mockResolvedValue(mockMintResponse)

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    // Mint NFT
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('NFT created successfully! Token ID: 123')
    })

    // Check form is reset
    expect(promptInput).toHaveValue('')
    expect(screen.queryByPlaceholderText('NFT Title')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('NFT Description')).not.toBeInTheDocument()
  })

  it('shows wallet connection error when trying to mint without connection', async () => {
    mockUseAccount.mockReturnValue({
      address: null,
      isConnected: false,
    })

    const mockGenerationResponse = {
      id: 'generation-123',
      imageUrl: 'https://example.com/generated-image.png',
      prompt: 'A beautiful landscape',
      createdAt: new Date().toISOString(),
    }

    ;(apiClient.generateAI as jest.Mock).mockResolvedValue(mockGenerationResponse)

    render(<NFTCreationForm />)

    // Generate image
    const promptInput = screen.getByPlaceholderText('Describe the artwork you want to create...')
    await userEvent.type(promptInput, 'A beautiful landscape')

    const generateButton = screen.getByText('Generate')
    fireEvent.click(generateButton)

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('NFT Title')
      const descriptionTextarea = screen.getByPlaceholderText('NFT Description')

      fireEvent.change(titleInput, { target: { value: 'Beautiful Landscape' } })
      fireEvent.change(descriptionTextarea, { target: { value: 'A stunning AI-generated landscape' } })
    })

    // Try to mint without wallet
    const mintButton = screen.getByText('Mint NFT')
    fireEvent.click(mintButton)

    expect(screen.getByText('Please connect your wallet first')).toBeInTheDocument()
  })
})
