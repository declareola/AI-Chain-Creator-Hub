'use client';

import { useState } from 'react';

export default function AnalyzeSimulatePage() {
  const [selectedPair, setSelectedPair] = useState('BTC/ETH');
  const [selectedInterval, setSelectedInterval] = useState('Last 30 Days');
  const [timeframe, setTimeframe] = useState('1M');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    // Simulate API call
    setTimeout(() => {
      setSimulationResults({
        totalReturn: '+12.5%',
        winRate: '68%',
        totalTrades: 45,
        profitFactor: '1.8'
      });
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-800 px-10 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-white">
              <svg className="size-8 text-[#53d22d]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-white text-xl font-bold tracking-[-0.015em]">NovaChain</h2>
            </div>
            <nav className="flex items-center gap-6">
              <a className="text-gray-300 hover:text-white text-base font-medium" href="#">Home</a>
              <a className="text-gray-300 hover:text-white text-base font-medium" href="#">NFTs</a>
              <a className="text-gray-300 hover:text-white text-base font-medium" href="#">DeFi</a>
              <a className="text-gray-300 hover:text-white text-base font-medium" href="#">Marketplace</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"> search </span>
              <input className="form-input w-full min-w-0 resize-none overflow-hidden rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-[#53d22d] focus:ring-[#53d22d] h-10 pl-10 pr-4 text-base" placeholder="Search..." value=""/>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white">
              <span className="material-symbols-outlined text-2xl"> notifications </span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHRqtQUY1o1LPTr0rwoNudei6u6s5nPllxtVtrEYJIS5W9FbPnWwHsuxjfaF6b8pKw5rMe6ss2HB-12MoP3R0k0YamhX0NIHz2w2Tagkj09j5vKwCNDfE0-fSVBH1px36A3KoR2hqYYwVaC9OOVruFD5ABSXtTEBPnF-0IaLVeI3g_4JGS-uj7MzAQICAQZnNm72xzrQ7c58c07Ai5KoXp_384s-ORu_ePaabaM5c54-yFLwudDhqrj1iIYl_KG5hYKwDVLqE4aAXo")' }}></div>
          </div>
        </header>
        <main className="flex flex-1 justify-center p-8">
          <div className="w-full max-w-7xl">
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold tracking-tight">Trade Simulator</h1>
              <p className="text-gray-400 text-lg mt-2">Analyze market pairs and simulate trades with AI-generated signals.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-bold mb-4">Market Data Visualization</h3>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">BTC/ETH Price History</p>
                      <p className="text-white text-4xl font-bold mt-1">$1,850.75</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-green-400 text-base font-medium">+2.5%</p>
                        <p className="text-gray-400 text-sm">Last 30 Days</p>
                      </div>
                    </div>
                    <div className="flex gap-2 rounded-full bg-gray-700 p-1">
                      <button
                        className={`text-sm font-bold tracking-wider px-3 py-1 rounded-full transition-colors ${timeframe === '1D' ? 'text-white bg-gray-600' : 'text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setTimeframe('1D')}
                      >
                        1D
                      </button>
                      <button
                        className={`text-sm font-bold tracking-wider px-3 py-1 rounded-full transition-colors ${timeframe === '7D' ? 'text-white bg-gray-600' : 'text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setTimeframe('7D')}
                      >
                        7D
                      </button>
                      <button
                        className={`text-sm font-bold tracking-wider px-3 py-1 rounded-full transition-colors ${timeframe === '1M' ? 'text-white bg-gray-600' : 'text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setTimeframe('1M')}
                      >
                        1M
                      </button>
                      <button
                        className={`text-sm font-bold tracking-wider px-3 py-1 rounded-full transition-colors ${timeframe === '1Y' ? 'text-white bg-gray-600' : 'text-gray-300 hover:bg-gray-600'}`}
                        onClick={() => setTimeframe('1Y')}
                      >
                        1Y
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 475 320" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 218C36.3077 218 36.3077 42 72.6154 42C108.923 42 108.923 186 145.231 186C181.538 186 181.538 66 217.846 66C254.154 66 254.154 90 290.462 90C326.769 90 326.769 242 363.077 242C399.385 242 399.385 2 435.692 2C472 2 472 162 472 162" stroke="#53d22d" strokeLinecap="round" strokeWidth="4"></path>
                      <path d="M0 218C36.3077 218 36.3077 42 72.6154 42C108.923 42 108.923 186 145.231 186C181.538 186 181.538 66 217.846 66C254.154 66 254.154 90 290.462 90C326.769 90 326.769 242 363.077 242C399.385 242 399.385 2 435.692 2C472 2 472 162 472 162V320H0V218Z" fill="url(#paint0_linear_chart)"></path>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chart" x1="236" x2="236" y1="2" y2="320">
                          <stop stopColor="#53d22d" stopOpacity="0.3"></stop>
                          <stop offset="1" stopColor="#53d22d" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-bold mb-4">AI-Generated Signals</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl bg-gray-700 p-4">
                      <div className="flex items-center justify-center rounded-full bg-green-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-green-400 text-3xl"> trending_up </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-lg font-semibold">Buy Signal</p>
                        <p className="text-gray-400 text-sm">Potential upward trend identified.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">Confidence</p>
                        <p className="text-green-400 text-lg font-bold">85%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl bg-gray-700 p-4">
                      <div className="flex items-center justify-center rounded-full bg-red-500/20 shrink-0 size-12">
                        <span className="material-symbols-outlined text-red-400 text-3xl"> trending_down </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-lg font-semibold">Sell Signal</p>
                        <p className="text-gray-400 text-sm">Potential downward trend identified.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">Confidence</p>
                        <p className="text-red-400 text-lg font-bold">92%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-bold mb-4">Simulation Setup</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block" htmlFor="pair-select">Market Pair</label>
                      <select
                        className="form-select w-full rounded-xl border-gray-700 bg-gray-900 text-white focus:border-[#53d22d] focus:ring-[#53d22d] h-12 px-4"
                        id="pair-select"
                        value={selectedPair}
                        onChange={(e) => setSelectedPair(e.target.value)}
                      >
                        <option>BTC/ETH</option>
                        <option>SOL/USDC</option>
                        <option>ADA/USDT</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block" htmlFor="interval-select">Lookback Interval</label>
                      <select
                        className="form-select w-full rounded-xl border-gray-700 bg-gray-900 text-white focus:border-[#53d22d] focus:ring-[#53d22d] h-12 px-4"
                        id="interval-select"
                        value={selectedInterval}
                        onChange={(e) => setSelectedInterval(e.target.value)}
                      >
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <button
                      className="flex w-full items-center justify-center rounded-full h-12 px-6 bg-[#53d22d] text-gray-900 text-base font-bold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleStartSimulation}
                      disabled={isSimulating}
                    >
                      <span className="material-symbols-outlined mr-2">
                        {isSimulating ? 'hourglass_empty' : 'play_circle'}
                      </span>
                      <span className="truncate">
                        {isSimulating ? 'Running Simulation...' : 'Start Simulation'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-bold mb-4">Simulation Results</h3>
                  <div className="space-y-4 text-center">
                    {simulationResults ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Total Return</p>
                          <p className="text-green-400 text-xl font-bold">{simulationResults.totalReturn}</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Win Rate</p>
                          <p className="text-white text-xl font-bold">{simulationResults.winRate}</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Total Trades</p>
                          <p className="text-white text-xl font-bold">{simulationResults.totalTrades}</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Profit Factor</p>
                          <p className="text-white text-xl font-bold">{simulationResults.profitFactor}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">Run a simulation to see results.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
