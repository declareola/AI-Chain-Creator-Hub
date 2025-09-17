'use client';

import { useState, useEffect } from 'react';

interface ContentItem {
  id: number;
  type: string;
  title: string;
  status: string;
  earnings: number;
  createdAt: string;
  views: number;
}

export default function ContentMyContentPage() {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching content from backend or IPFS
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Simulated API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulated data
        const data = [
          { id: 1, type: 'Image', title: "Digital Art: 'Sunset Serenity'", status: 'Listed', earnings: 150, createdAt: '2024-01-15', views: 1250 },
          { id: 2, type: 'Audio', title: "Music Track: 'Rhythmic Echoes'", status: 'Sold', earnings: 200, createdAt: '2024-01-10', views: 890 },
          { id: 3, type: 'Video', title: "Short Film: 'Urban Dreams'", status: 'Listed', earnings: 100, createdAt: '2024-01-08', views: 2100 },
          { id: 4, type: 'Text', title: "Poem: 'Whispers of the Wind'", status: 'Sold', earnings: 50, createdAt: '2024-01-05', views: 450 },
          { id: 5, type: 'Image', title: "Photography: 'Mountain Majesty'", status: 'Listed', earnings: 120, createdAt: '2024-01-03', views: 780 },
        ];
        setContentList(data);
        setFilteredContent(data);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContent(contentList);
    } else {
      const filtered = contentList.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContent(filtered);
    }
  }, [searchTerm, contentList]);

  const handleAnalytics = (id: number) => {
    alert(`Show analytics for content ID: ${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Edit content with ID: ${id}`);
  };

  const handleUnlist = (id: number) => {
    if (confirm('Are you sure you want to unlist this content?')) {
      alert(`Content ${id} unlisted successfully`);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111810] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2e4328]/50 px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-[var(--primary-color)]">
              <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-white text-xl font-bold tracking-tight">VibeCoin</h2>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-300">
              <a className="hover:text-white transition-colors" href="#">Home</a>
              <a className="hover:text-white transition-colors" href="#">Create</a>
              <a className="text-white" href="#">Marketplace</a>
              <a className="hover:text-white transition-colors" href="#">Community</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <form className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a2c398]">search</span>
              <input
                className="form-input w-full rounded-md border-none bg-[#2e4328]/50 h-10 placeholder:text-[#a2c398] px-10 text-white focus:ring-2 focus:ring-[var(--primary-color)] transition-shadow"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button className="flex items-center justify-center rounded-md h-10 w-10 bg-[#2e4328]/50 text-gray-300 hover:bg-[#2e4328] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBluZVFbcuDaMEepmo4fVqQSgz8jI2d8d_Z3Dq4RSDdLUzLKSutjDLUylV2-R8D-agF7wysGUqJjLRViXIiEuHpdT3sBPPbLa8TgkXm4S2gAvwGnwIwrLRYV-U0SYyyiuTfBgXWcJuyoxWiHGuBHQooPBKtwtIKsObxs7_GnZ1V9LibhJWKxeM8LazNeqlG3P0WA1zQ21CdnG2IRZMrvCZv6-ueY0gVHP84YzefBXd0lE9Tt-Dds7yNKjm4Tfe5OQKl5VDNe1U-XV6_")',
              }}
            ></div>
          </div>
        </header>
        <main className="flex flex-1 justify-center py-10 px-4 sm:px-10">
          <div className="layout-content-container flex flex-col w-full max-w-6xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-3xl font-bold">My Content</h1>
                <p className="text-gray-400">Manage your created content on the marketplace.</p>
              </div>
              <button className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-bold text-black hover:bg-opacity-80 transition-colors">
                <span className="material-symbols-outlined">add_circle</span>
                Create New
              </button>
            </div>

            <div className="border-b border-[#2e4328]/50 mb-6">
              <div className="flex gap-8">
                <a className="flex items-center justify-center border-b-2 border-b-[var(--primary-color)] text-white pb-3 pt-1" href="#">
                  <p className="text-sm font-semibold">Created</p>
                </a>
                <a className="flex items-center justify-center border-b-2 border-b-transparent text-gray-400 pb-3 pt-1 hover:text-white transition-colors" href="#">
                  <p className="text-sm font-semibold">Collected</p>
                </a>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                <span className="ml-4 text-white">Loading content...</span>
              </div>
            ) : (
              <div className="@container">
                <div className="overflow-x-auto rounded-md border border-[#2e4328]/50 bg-[#1a2418]">
                  <table className="w-full text-left">
                    <thead className="bg-[#21301c]/60">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-white w-2/12">Content</th>
                        <th className="px-6 py-4 text-sm font-semibold text-white w-4/12">Title</th>
                        <th className="px-6 py-4 text-sm font-semibold text-white w-2/12">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-white w-2/12 text-right">Earnings</th>
                        <th className="px-6 py-4 text-sm font-semibold text-white w-2/12 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2e4328]/50">
                      {filteredContent.map((item) => (
                        <tr key={item.id} className="hover:bg-[#21301c]/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-300">{item.type}</td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{item.title}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              item.status === 'Listed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 text-right">{item.earnings} VC</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleEdit(item.id)}
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              {item.status === 'Listed' && (
                                <button
                                  className="p-2 text-gray-400 hover:text-white transition-colors"
                                  onClick={() => handleUnlist(item.id)}
                                >
                                  <span className="material-symbols-outlined text-lg">link_off</span>
                                </button>
                              )}
                              <button
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                onClick={() => handleAnalytics(item.id)}
                              >
                                <span className="material-symbols-outlined text-lg">analytics</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
</create_file>
