export default function AdminSettings2Page() {
  return (
    <>
      <head>
        <title>Admin Settings</title>
      </head>
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-left">
            <h1 className="text-white text-4xl font-bold tracking-tight">
              Admin Settings
            </h1>
            <p className="mt-2 text-neutral-400 text-lg">
              Manage platform-wide settings and configurations.
            </p>
          </div>
          <form className="space-y-10">
            <section className="space-y-6">
              <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] border-b border-neutral-700 pb-3">
                Vibecoin Curve Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Initial Price
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="0.5"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Curve Exponent
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="2.0"
                  />
                </label>
              </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] border-b border-neutral-700 pb-3">
                AutoTrader Risk Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Max Exposure (%)
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="25"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Daily Loss Limit (%)
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="5"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Slippage Tolerance (%)
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="0.5"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Circuit Breaker (%)
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    type="number"
                    defaultValue="10"
                  />
                </label>
              </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] border-b border-neutral-700 pb-3">
                Treasury Addresses
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Primary Treasury Address
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    defaultValue="0xAbC...123"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-neutral-300 text-sm font-medium">
                    Secondary Treasury Address
                  </p>
                  <input
                    className="form-input w-full rounded-md text-white bg-[#1a2418] border border-[#2e4328] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] h-12 px-4 placeholder:text-neutral-500"
                    defaultValue="0xDeF...456"
                  />
                </label>
              </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] border-b border-neutral-700 pb-3">
                General Settings
              </h3>
              <div className="flex items-center justify-between rounded-md bg-[#1a2418] p-4">
                <div>
                  <p className="text-white font-medium">Paper Trading Mode</p>
                  <p className="text-neutral-400 text-sm">
                    Simulate trading without using real funds.
                  </p>
                </div>
                <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full bg-neutral-700 transition-[background-color] has-[:checked]:bg-[var(--primary-color)]">
                  <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition-transform transform has-[:checked]:translate-x-5"></span>
                  <input className="sr-only" type="checkbox" />
                </label>
              </div>
            </section>
            <div className="flex justify-end pt-4">
              <button className="flex items-center justify-center rounded-md h-12 px-8 bg-[var(--primary-color)] text-[#111813] text-sm font-bold tracking-wide hover:bg-opacity-90 transition-all">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
