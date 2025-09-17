'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/wallet-connect'

export function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2a342b] px-10 py-4">
      <div className="flex items-center gap-4 text-white">
        <div className="size-8 text-[#53d22d]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          Artify
        </h2>
      </div>
      <nav className="flex items-center gap-8 text-sm font-medium text-gray-300">
        <Link className="transition-colors hover:text-white" href="/create">Create</Link>
        <Link className="transition-colors hover:text-white" href="/marketplace">Marketplace</Link>
        <Link className="transition-colors hover:text-white" href="/defi/analyze_simulate">DeFi</Link>
        <Link className="transition-colors hover:text-white" href="/community">Community</Link>
      </nav>
      <div className="flex flex-1 justify-end gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#2a342b] text-gray-300 transition-colors hover:bg-[#384539] hover:text-white">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </button>
        <WalletConnect />
      </div>
    </header>
  )
}
