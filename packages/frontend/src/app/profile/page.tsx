export default function ProfilePage() {
  return (
    <main className="flex flex-1 justify-center py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
              User Profile
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              View and manage your profile information.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div className="aspect-square h-32 w-32 overflow-hidden rounded-full bg-[#2a342b]">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDW6h_lWlv0m21GbPwvhA52yAg25loxgF2rHvLXTTLMtB7ToSFUt73fgGWkFCBIS-swOyfkHdhCH4K9NNuQLmrk7lgLls77Xy8LOh66XMvLYHEZHh9bIID4jY3MycSp-0PVJ8z5xr3ji5B9_Ii-z1ZZ3Nl5zKzjog-PMN10gTV7szn5hcyuyl9IEt_BZdkSeVEFrLU2FKnlbd3g4IyX8yafT_2HSuXP0m_i-ncOgtZw3P5z4K73V0OpcJCBXqeNk4kFP3yq2dItv_m2")'
                }}
              ></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">John Doe</h2>
              <p className="text-gray-400">@johndoe</p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <div className="rounded-2xl bg-[#1c241d] p-6">
                <h3 className="text-lg font-semibold text-white">Bio</h3>
                <p className="mt-2 text-gray-400">
                  Passionate about AI and blockchain. Creating the future of digital art and trading.
                </p>
              </div>
              <div className="rounded-2xl bg-[#1c241d] p-6">
                <h3 className="text-lg font-semibold text-white">Stats</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-[#53d22d]">42</p>
                    <p className="text-sm text-gray-400">NFTs Created</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#53d22d]">1.2K</p>
                    <p className="text-sm text-gray-400">Followers</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex h-12 items-center justify-center rounded-full bg-[#53d22d] px-6 text-base font-bold text-[#111812] transition-transform hover:scale-105">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
