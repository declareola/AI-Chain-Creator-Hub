export default function AdminSettings1Page() {
  return (
    <main className="flex flex-1 justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Admin Settings
          </h1>
          <p className="mt-2 text-lg text-neutral-300">
            Manage platform-wide settings and configurations.
          </p>
        </div>
        <form className="space-y-10">
          <section className="glass-effect space-y-6 p-6">
            <h3 className="border-b border-white/10 pb-3 text-xl font-bold leading-tight tracking-[-0.015em] text-white">
              Vibecoin Curve Parameters
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Initial Price
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="0.5"
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Curve Exponent
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="2.0"
                />
              </label>
            </div>
          </section>
          <section className="glass-effect space-y-6 p-6">
            <h3 className="border-b border-white/10 pb-3 text-xl font-bold leading-tight tracking-[-0.015em] text-white">
              AutoTrader Risk Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Max Exposure (%)
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="25"
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Daily Loss Limit (%)
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="5"
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Slippage Tolerance (%)
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="0.5"
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Circuit Breaker (%)
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  type="number"
                  defaultValue="10"
                />
              </label>
            </div>
          </section>
          <section className="glass-effect space-y-6 p-6">
            <h3 className="border-b border-white/10 pb-3 text-xl font-bold leading-tight tracking-[-0.015em] text-white">
              Treasury Addresses
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Primary Treasury Address
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  defaultValue="0xAbC...123"
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-sm font-medium text-neutral-300">
                  Secondary Treasury Address
                </p>
                <input
                  className="form-input h-12 w-full rounded-md border border-white/10 bg-white/5 px-4 text-white placeholder:text-neutral-400 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  defaultValue="0xDeF...456"
                />
              </label>
            </div>
          </section>
          <section className="glass-effect space-y-6 p-6">
            <h3 className="border-b border-white/10 pb-3 text-xl font-bold leading-tight tracking-[-0.015em] text-white">
              General Settings
            </h3>
            <div className="flex items-center justify-between rounded-md p-4">
              <div>
                <p className="font-medium text-white">Paper Trading Mode</p>
                <p className="text-sm text-neutral-300">
                  Simulate trading without using real funds.
                </p>
              </div>
              <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full bg-white/20 transition-[background-color] has-[:checked]:bg-[var(--primary-color)]">
                <span className="absolute left-1 h-5 w-5 transform rounded-full bg-white transition-transform has-[:checked]:translate-x-5"></span>
                <input className="sr-only" type="checkbox" />
              </label>
            </div>
          </section>
          <div className="flex justify-end pt-4">
            <button className="glass-effect flex h-12 items-center justify-center rounded-md bg-[var(--primary-color)]/20 px-8 text-sm font-bold tracking-wide text-white transition-all hover:bg-[var(--primary-color)]/40">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
