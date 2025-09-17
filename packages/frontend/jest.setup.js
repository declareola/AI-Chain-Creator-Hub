import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
    isLoading: false,
    pendingConnector: null,
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
  useNetwork: jest.fn(() => ({
    chain: { id: 1, name: 'Ethereum' },
    chains: [],
  })),
  useSwitchNetwork: jest.fn(() => ({
    switchNetwork: jest.fn(),
  })),
  WagmiConfig: ({ children }) => children,
  createConfig: jest.fn(),
}))

// Mock API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    generateAI: jest.fn(),
    createNFT: jest.fn(),
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => 'TrendingUp',
  TrendingDown: () => 'TrendingDown',
  DollarSign: () => 'DollarSign',
  Activity: () => 'Activity',
  Settings: () => 'Settings',
  Play: () => 'Play',
  Pause: () => 'Pause',
}))

// Global test utilities
global.fetch = jest.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
