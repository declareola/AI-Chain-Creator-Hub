'use client';

import { useState } from 'react';

export default function VibeCoinBuySellPage() {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const handleBuy = () => {
    if (!buyAmount) return;
    alert(`Buying ${buyAmount} base tokens worth of VibeCoin`);
  };

  const handleSell = () => {
    if (!sellAmount) return;
    alert(`Selling ${sellAmount} VibeCoin`);
  };

  const handleConfirmTransaction = () => {
    alert('Transaction confirmed!');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111812] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2e4328] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="w-8 h-8">
              <svg className="text-[#53d22d]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">VibeCoin</h1>
          </div>
          <nav className="flex items-center gap-9 text-base font-medium text-zinc-300">
            <a className="hover:text-white transition-colors" href="#">Home</a>
            <a className="hover:text-white transition-colors" href="#">Create</a>
            <a className="text-white font-semibold" href="#">Trade</a>
            <a className="hover:text-white transition-colors" href="#">Marketplace</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-[#2e4328] text-white hover:bg-[#3a5532] transition-colors">
              <span className="material-symbols-outlined text-2xl"> notifications </span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAttnOyzIubUgZPc5VnnOeny9QVgbHU3_JB-BsBN-zLiRLOKYd0IdT6ll1YY45XtvP6zNDyAPlc7XB88UWUdOtLE_fOg924PFIedSxBHB7WCHDCH94OSxNQFXNqAoqz3zqYDf-Wd6e0quQh-toQ1DdCvuahmHm-3lrQJfKG2Rdts4u5Fzg_nng8oAfWx2MrEZR-HsTVTtnyl-0VTpQIDvhDTAl8FO4R7Gi-Ge0-zZxrUfWtuZNEVYZgqohj-QIyfPHO7TioL4q8EF-")' }}></div>
          </div>
        </header>
        <main className="px-40 flex flex-1 justify-center py-12">
          <div className="layout-content-container flex flex-col w-full max-w-7xl">
            <header className="mb-8">
              <h1 className="text-white tracking-tight text-4xl font-bold leading-tight">VibeCoin Trading</h1>
              <p className="text-zinc-400 mt-2 text-lg">Buy and sell VibeCoins with confidence and transparency.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="bg-[#162013] border border-[#2e4328] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-2xl font-bold">Buy VibeCoin</h2>
                  <span className="material-symbols-outlined text-zinc-400"> trending_up </span>
                </div>
                <div className="space-y-4">
                  <label className="flex flex-col">
                    <p className="text-zinc-300 text-sm font-medium leading-normal pb-2">Amount (in base token)</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#53d22d] border border-[#2e4328] bg-[#1a2818] h-14 placeholder:text-zinc-500 p-4 text-base font-normal leading-normal"
                      placeholder="Enter amount"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="w-full flex items-center justify-center rounded-full h-12 px-6 bg-[#53d22d] text-[#111812] text-base font-bold hover:bg-green-500 transition-colors"
                    onClick={handleBuy}
                  >
                    Buy
                  </button>
                </div>
              </div>
              <div className="bg-[#162013] border border-[#2e4328] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-2xl font-bold">Sell VibeCoin</h2>
                  <span className="material-symbols-outlined text-zinc-400"> trending_down </span>
                </div>
                <div className="space-y-4">
                  <label className="flex flex-col">
                    <p className="text-zinc-300 text-sm font-medium leading-normal pb-2">Amount (in VibeCoin)</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-[#53d22d] border border-[#2e4328] bg-[#1a2818] h-14 placeholder:text-zinc-500 p-4 text-base font-normal leading-normal"
                      placeholder="Enter amount"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="w-full flex items-center justify-center rounded-full h-12 px-6 bg-zinc-700 text-white text-base font-bold hover:bg-zinc-600 transition-colors"
                    onClick={handleSell}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col gap-2 rounded-2xl p-6 border border-[#2e4328] bg-[#162013]">
                <p className="text-zinc-400 text-sm font-medium leading-normal">Current Bonding Curve Price</p>
                <p className="text-white tracking-tight text-3xl font-bold leading-tight">$1.25</p>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl p-6 border border-[#2e4328] bg-[#162013]">
                <p className="text-zinc-400 text-sm font-medium leading-normal">Total Supply</p>
                <p className="text-white tracking-tight text-3xl font-bold leading-tight">1,000,000</p>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl p-6 border border-[#2e4328] bg-[#162013]">
                <p className="text-zinc-400 text-sm font-medium leading-normal">Reserve</p>
                <p className="text-white tracking-tight text-3xl font-bold leading-tight">$1,250,000</p>
              </div>
            </div>
            <div className="mt-8 bg-[#162013] border border-[#2e4328] rounded-2xl p-6">
              <h2 className="text-white text-2xl font-bold mb-4">Transaction Summary</h2>
              <div className="divide-y divide-[#2e4328]">
                <div className="py-4 flex justify-between items-center">
                  <p className="text-zinc-400 text-sm">Estimated VibeCoin Received</p>
                  <p className="text-white text-sm font-medium">100</p>
                </div>
                <div className="py-4 flex justify-between items-center">
                  <p className="text-zinc-400 text-sm">Estimated Base Token Received</p>
                  <p className="text-white text-sm font-medium">$125</p>
                </div>
                <div className="py-4 flex justify-between items-center">
                  <p className="text-zinc-400 text-sm">Transaction Fee</p>
                  <p className="text-white text-sm font-medium">$0.50</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#53d22d] text-[#111812] text-base font-bold leading-normal tracking-[0.015em] hover:bg-green-500 transition-colors"
                  onClick={handleConfirmTransaction}
                >
                  <span className="truncate">Confirm Transaction</span>
                </button>
              </div>
            </div>
            <div className="mt-8 bg-[#162013] border border-[#2e4328] rounded-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-white text-2xl font-bold">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#1a2818]">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold text-white">Type</th>
                      <th className="px-6 py-3 text-sm font-semibold text-white">Amount</th>
                      <th className="px-6 py-3 text-sm font-semibold text-white">Price</th>
                      <th className="px-6 py-3 text-sm font-semibold text-white">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2e4328]">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300"> Buy </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">500 Base Token</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">$1.25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">2023-11-15 10:00 AM</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300"> Sell </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">200 VibeCoin</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">$1.25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">2023-11-15 09:30 AM</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300"> Buy </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">1000 Base Token</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">$1.25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">2023-11-15 09:00 AM</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300"> Sell </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">150 VibeCoin</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">$1.25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">2023-11-15 08:30 AM</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300"> Buy </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">250 Base Token</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">$1.25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">2023-11-15 08:00 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
