'use client';

import { useState } from 'react';

export default function MyNFTsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Sort by Royalty');

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#1f2937] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 text-[#53d22d]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">NovaChain</h2>
          </div>
          <div className="flex flex-1 justify-center gap-8">
            <nav className="flex items-center gap-6">
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Home</a>
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Create</a>
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Marketplace</a>
              <a className="text-white text-sm font-bold leading-normal relative py-2" href="#">My NFTs
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#53d22d]"></div>
              </a>
              <a className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Activity</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              <span className="material-symbols-outlined">
                notifications
              </span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDD-nGsyKp7Cbd7OZYIs2Jdl3zpFWdCVc9ggPPfa5tYMb0nV8SH7v5f9lK7sOiI7BQBrnec2k573WCya96Tp7E_QabbLL7hHtJiOI7fx2PGJvCngQnitEJX9LaXKMqVSqD9lNKRzggdLTbW_0xbhcYvT6r70WqVmGrJJgKAtn8lLacu3YdXVrcGgPYnvb15gDh510JQw_SZXbVHL50TYQk8BTf6JX8H5iz695fE2sQuoEfDs14OVzYMpvA9f_PT8KE99aBCYRD8M6e")' }}></div>
          </div>
        </header>
        <div className="px-10 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">
              <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">My Minted NFTs</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    className="w-64 bg-[#1f2937] border border-[#374151] text-white rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#53d22d] focus:border-[#53d22d] outline-none transition-all"
                    placeholder="Search by ID"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none w-48 bg-[#1f2937] border border-[#374151] text-white rounded-md pl-4 pr-10 py-2 focus:ring-2 focus:ring-[#53d22d] focus:border-[#53d22d] outline-none transition-all"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option>Sort by Royalty</option>
                    <option>Highest to Lowest</option>
                    <option>Lowest to Highest</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 @container">
              <div className="overflow-x-auto rounded-md border border-[#374151] bg-[#1f2937]">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-400 uppercase bg-[#374151]">
                    <tr>
                      <th className="px-6 py-3" scope="col">NFT</th>
                      <th className="px-6 py-3" scope="col">ID</th>
                      <th className="px-6 py-3" scope="col">Token URI</th>
                      <th className="px-6 py-3" scope="col">Royalty</th>
                      <th className="px-6 py-3 text-center" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-[#1f2937] border-b border-[#374151] hover:bg-[#374151] transition-colors">
                      <td className="px-6 py-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXY32gq-x6cQWUJaCIu7d1VB1ESm_EBHSxPZD-KhCe107AmaI_jcKDP8hMNjxpvgL-yKFGBT7cHhLHl2DNxwJvJFoioDPesQXrjeXXZPqUR5rSUaSCZwE6IThgFUZkTP8W7CVqKRmb5rLiaos0K5JOPs-DSNcr6-rchw5-D7Eb9K_kFde357dhAj8aULpgt201g6IqA5-86clcU9W6V3yjLhkQuBdl7ADN1rkOQrnPoplNmZEEsodzo8nQWU59J1xKbqVzQomhRSrp")' }}></div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">#12345</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">ipfs://Qm...xyz</td>
                      <td className="px-6 py-4 font-medium text-white">5%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a className="font-medium text-[#53d22d] hover:underline flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-base">link</span> Basescan
                          </a>
                          <button className="font-medium text-white bg-[#53d22d] hover:bg-opacity-80 transition-all rounded-md px-3 py-1.5 text-xs">Relist</button>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-[#1f2937] border-b border-[#374151] hover:bg-[#374151] transition-colors">
                      <td className="px-6 py-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAULshQNe5HkCDRMFeA1u3CT_iST0kfQi_xOADRHygaxfGQ7T3Q88BKZekgDQlXTbnutFbO0AjK89yj0RCoUoQy0xsnUtj6C461K3o3stlde8JikhpImdymmWF9126rTzntuUbk7Tv5Jy-g-atdN_bJSXmFVW7LdkKmVOL3_PRWEuziBXtxhVmpOBzKGASmL_RRZumj1hoaHUqU_A7idt5SAsi52Y9halQUSVvA8AJLrYRZBu88GkAZ3JIYpcH4fD-VW7eOx5VkPUQm")' }}></div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">#67890</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">ipfs://Qm...abc</td>
                      <td className="px-6 py-4 font-medium text-white">10%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a className="font-medium text-[#53d22d] hover:underline flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-base">link</span> Basescan
                          </a>
                          <button className="font-medium text-white bg-[#53d22d] hover:bg-opacity-80 transition-all rounded-md px-3 py-1.5 text-xs">Relist</button>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-[#1f2937] border-b border-[#374151] hover:bg-[#374151] transition-colors">
                      <td className="px-6 py-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBhw8SlgkJ4bRHQk5WCYaXQrp6iOXjUXd3bHQA20nSD7ovZKjiENizrJBzadMZlUc-t7QuV8VXiBCJJO_OfMKdv9pnH-kM2W_1AoSugLJpfHhMSzawARjST0SPP6KfcY2mPVmONI2GouzYiZXvEitbM-M6PS57mBi0KWF2jIqm3--0CjRGq__IJ7d6qMU6uOHHYP8yZiXNNLPdvwT1v9659vCIS2iL3saXXlEFT4GxDOb1GctGXju5KfLhsGELtaXb3fYAOHUVXCBjR")' }}></div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">#11223</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">ipfs://Qm...def</td>
                      <td className="px-6 py-4 font-medium text-white">2%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a className="font-medium text-[#53d22d] hover:underline flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-base">link</span> Basescan
                          </a>
                          <button className="font-medium text-white bg-[#53d22d] hover:bg-opacity-80 transition-all rounded-md px-3 py-1.5 text-xs">Relist</button>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-[#1f2937] border-b border-[#374151] hover:bg-[#374151] transition-colors">
                      <td className="px-6 py-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvkgOMBmnAtgO8FBUs4sMx6fUOOsOXVlzfb85ttNWC1P4nTnPeyyyznwcuB3rrthMYOZTS04jPl9zQoBBJio6ST-fVZUANpQVB8hVDsRj4f4sJwfYZjZ6nz2UB8S3WINt2DKniasHInzEZcD3KU8DSOlMejF4QcArDrBoo1golF__BCpJONRpleoXV0vIUoSavtLKO5lA9NDDHbK6v9KvgriqISH9Z8DT2I2XGjdfaSADR_lugIMSWO56j_CFmuxgASA-z9DPxyZqV")' }}></div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">#33445</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">ipfs://Qm...ghi</td>
                      <td className="px-6 py-4 font-medium text-white">7.5%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a className="font-medium text-[#53d22d] hover:underline flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-base">link</span> Basescan
                          </a>
                          <button className="font-medium text-white bg-[#53d22d] hover:bg-opacity-80 transition-all rounded-md px-3 py-1.5 text-xs">Relist</button>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-[#1f2937] hover:bg-[#374151] transition-colors">
                      <td className="px-6 py-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdJwVtqmn-4ZILPrr30l0F1va7U-oBtpaMEyXnIPlStxlyz2nCh5l95GmfEb-Mvho74cPyw8W3NsWVMH1VARYjL7joPOwfmfXAtyUUGDmPLufBIL1C2_EEiw6bCs-ukqdxcTAFtIl1agJjy9Qr0IHQVc7sj-dsyVjH-JTtxixXZ-bI-UR8mTqEzrVX2B_hpiXwTLA5rCuRL6hArSdK9lKQ7AOduyTvi7SZ23BE_77Rdi5xaQsXwvCcDDZmYJvklIIoEH4hpmOcSjIm")' }}></div>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">#55667</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">ipfs://Qm...jkl</td>
                      <td className="px-6 py-4 font-medium text-white">3%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a className="font-medium text-[#53d22d] hover:underline flex items-center gap-1" href="#">
                            <span className="material-symbols-outlined text-base">link</span> Basescan
                          </a>
                          <button className="font-medium text-white bg-[#53d22d] hover:bg-opacity-80 transition-all rounded-md px-3 py-1.5 text-xs">Relist</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
