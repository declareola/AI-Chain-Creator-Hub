export default function ProfileSettingsPage() {
  return (
    <div className="bg-gray-950 text-white">
      <div className="relative flex size-full min-h-screen flex-col" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
        <div className="flex h-full flex-1">
          <aside className="flex w-64 flex-col gap-8 border-r border-gray-800 bg-gray-950 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJmzRVLPhkr15ghNds02znYWyuaAkKqjBoXDGCN0ALU1HBiZaBIt2fcgLqtK-yXjowr4HHFOs0s-1-_ibMSaGLQUKo_M-Qd8zze2B2Yx-A3eRGWneuSL5WMrO-ro1OSxpgNL5OvVw-nxDMwhD8GBfiFjKyxin61btj_XQ6ieM6FRiymU2NIqn7mHlhGXyAZiljyRHeovx0i1AGUp09gatH3XmQ8F6D7iHQk3DzZzrJM4xyVJVaUte-z5bzmdFReoZ88l9typs51L_0")' }}></div>
              <h1 className="text-white text-lg font-semibold">AI DApp</h1>
            </div>
            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white" href="#">
                <svg className="size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="text-sm font-medium">Home</span>
              </a>
              <a className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white" href="#">
                <svg className="size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                  <path d="M8 12h8"></path>
                  <path d="M12 8v8"></path>
                </svg>
                <span className="text-sm font-medium">Create</span>
              </a>
              <a className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white" href="#">
                <svg className="size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span className="text-sm font-medium">Trade</span>
              </a>
              <a className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white" href="#">
                <svg className="size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                  <path d="M2 7h20"></path>
                  <path d="M22 7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"></path>
                </svg>
                <span className="text-sm font-medium">Marketplace</span>
              </a>
              <a className="flex items-center gap-3 rounded-md bg-[var(--primary-400)] px-3 py-2 text-white" href="#">
                <svg className="size-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="text-sm font-medium">Settings</span>
              </a>
            </nav>
          </aside>
          <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
              <p className="mt-2 text-lg text-gray-400">Manage your personal settings and preferences.</p>
              <div className="mt-10 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Wallet</h2>
                  <div className="rounded-md border border-gray-800 bg-gray-950">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-[var(--primary-400)]">
                        <svg className="size-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">Wallet 1</p>
                        <p className="text-sm text-[var(--primary-400)]">Connected</p>
                      </div>
                      <button className="ml-auto rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">Disconnect</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Notifications</h2>
                  <div className="rounded-md border border-gray-800 bg-gray-950">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-white">Trade Alerts</p>
                        <p className="text-sm text-gray-400">Receive notifications for trade alerts.</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input defaultChecked className="peer sr-only" type="checkbox" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--primary-400)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-900)]"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-800"></div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-white">New Content</p>
                        <p className="text-sm text-gray-400">Receive notifications for new content.</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input className="peer sr-only" type="checkbox" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--primary-400)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-900)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Language</h2>
                  <div className="rounded-md border border-gray-800 bg-gray-950">
                    <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-800">
                      <div>
                        <p className="font-medium text-white">Language</p>
                        <p className="text-sm text-gray-400">English</p>
                      </div>
                      <svg className="size-5 text-gray-400" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-4">
                <button className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">Cancel</button>
                <button className="rounded-md bg-[var(--primary-400)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-500)]">Save Changes</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
