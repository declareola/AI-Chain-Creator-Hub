'use client';

import { useState } from 'react';

export default function ContentGeneratePage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [price, setPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('blog');
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      // Simulate AI generation with different content types
      const contentTypes = {
        blog: `## ${aiPrompt}\n\nWelcome to this comprehensive guide on ${aiPrompt.toLowerCase()}. In today's digital landscape, understanding the fundamentals of ${aiPrompt.toLowerCase()} is crucial for success.\n\n### Key Benefits\n\n- Enhanced productivity and efficiency\n- Better decision-making capabilities\n- Competitive advantage in your field\n\n### Getting Started\n\nTo begin your journey with ${aiPrompt.toLowerCase()}, follow these essential steps:\n\n1. **Research and Planning**: Understand your goals and requirements\n2. **Implementation**: Apply best practices and methodologies\n3. **Monitoring**: Track progress and make adjustments\n\n### Conclusion\n\nMastering ${aiPrompt.toLowerCase()} opens up new possibilities and opportunities. Start your journey today and unlock your full potential.`,
        music: `🎵 **${aiPrompt}** 🎵\n\n**Genre**: Electronic/Ambient\n**Mood**: Atmospheric, introspective\n**Tempo**: 120 BPM\n\n**Description**: A captivating musical journey that explores the depths of ${aiPrompt.toLowerCase()}. This track features ethereal synths, pulsating rhythms, and emotional melodies that transport listeners to another dimension.\n\n**Key Elements**:\n- Layered synthesizer textures\n- Organic percussion patterns\n- Emotional vocal samples\n- Cinematic soundscapes\n\n**Perfect for**: Meditation, creative work, relaxation, and immersive experiences.`,
        video: `🎬 **${aiPrompt}** 🎬\n\n**Duration**: 3:45 minutes\n**Style**: Documentary/Cinematic\n**Theme**: Exploration and discovery\n\n**Synopsis**: An immersive visual experience that delves into the fascinating world of ${aiPrompt.toLowerCase()}. This video combines stunning cinematography, expert interviews, and compelling narratives to create an engaging story.\n\n**Visual Highlights**:\n- Breathtaking aerial shots\n- Intimate close-up sequences\n- Dynamic motion graphics\n- Emotional storytelling\n\n**Target Audience**: Curious minds, professionals, and anyone interested in ${aiPrompt.toLowerCase()}.`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      setGeneratedContent(contentTypes[activeTab as keyof typeof contentTypes] || contentTypes.blog);
    } catch (error) {
      console.error('Generation failed:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadToIPFS = async () => {
    if (!generatedContent) {
      setError('Please generate content first');
      return;
    }

    setIsUploading(true);
    setError('');
    try {
      // Simulate IPFS upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      alert('Content uploaded to IPFS successfully! IPFS Hash: QmExample123...');
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload to IPFS. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleListContent = () => {
    if (!generatedContent) {
      setError('Please generate content first');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Please set a valid price');
      return;
    }

    setError('');
    alert(`Content listed for sale successfully at ${price} VibeCoins!`);
  };

  return (
    <div className="bg-[#111810] min-h-screen">
      <div className="relative flex size-full min-h-screen flex-col bg-[#111810] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <aside className="flex flex-col w-64 bg-[#162013] p-6 border-r border-[#2e4328]">
            <div className="flex flex-col gap-8">
              <h1 className="text-white text-2xl font-bold leading-normal">VibeChain</h1>
              <nav className="flex flex-col gap-2">
                <a className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-[#21301c] rounded-lg transition-colors" href="#">
                  <span className="material-symbols-outlined">home</span>
                  <span className="text-sm font-medium">Home</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-white bg-[#2e4328] rounded-lg transition-colors" href="#">
                  <span className="material-symbols-outlined">add_box</span>
                  <span className="text-sm font-medium">Create</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-[#21301c] rounded-lg transition-colors" href="#">
                  <span className="material-symbols-outlined">storefront</span>
                  <span className="text-sm font-medium">Marketplace</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-[#21301c] rounded-lg transition-colors" href="#">
                  <span className="material-symbols-outlined">description</span>
                  <span className="text-sm font-medium">My Content</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-[#21301c] rounded-lg transition-colors" href="#">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm font-medium">Settings</span>
                </a>
              </nav>
            </div>
          </aside>
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-white text-4xl font-bold leading-tight mb-8">Create New Content</h2>
              <div className="mb-8">
                <div className="flex border-b border-[#426039]">
                  <button
                    className={`flex flex-col items-center justify-center border-b-2 ${activeTab === 'blog' ? 'border-[#54d22d]' : 'border-transparent'} text-${activeTab === 'blog' ? 'white' : '[#a2c398]'} py-3 px-6 hover:text-white transition-colors`}
                    onClick={() => setActiveTab('blog')}
                  >
                    <p className="text-sm font-bold tracking-wide">Blog Post</p>
                  </button>
                  <button
                    className={`flex flex-col items-center justify-center border-b-2 ${activeTab === 'music' ? 'border-[#54d22d]' : 'border-transparent'} text-${activeTab === 'music' ? 'white' : '[#a2c398]'} py-3 px-6 hover:text-white transition-colors`}
                    onClick={() => setActiveTab('music')}
                  >
                    <p className="text-sm font-bold tracking-wide">Music Description</p>
                  </button>
                  <button
                    className={`flex flex-col items-center justify-center border-b-2 ${activeTab === 'video' ? 'border-[#54d22d]' : 'border-transparent'} text-${activeTab === 'video' ? 'white' : '[#a2c398]'} py-3 px-6 hover:text-white transition-colors`}
                    onClick={() => setActiveTab('video')}
                  >
                    <p className="text-sm font-bold tracking-wide">Video Description</p>
                  </button>
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <label className="block">
                    <span className="text-white text-lg font-semibold mb-2 block">AI Prompt</span>
                    <textarea
                      className="form-textarea block w-full resize-none rounded-xl text-white bg-[#21301c] border border-[#426039] focus:border-[#54d22d] focus:ring focus:ring-[#54d22d]/50 h-36 p-4 placeholder:text-[#a2c398]/70 text-base font-normal leading-normal"
                      placeholder="Enter your prompt for AI generation..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </label>
                  <button
                    className="flex items-center justify-center gap-2 min-w-[84px] cursor-pointer rounded-full h-12 px-6 bg-[#54d22d] text-[#162013] text-base font-bold leading-normal tracking-wide shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#162013]"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">auto_awesome</span>
                        <span>Generate Content</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold">Preview</h3>
                  <label className="block">
                    <span className="text-white text-base font-medium mb-2 block">Generated Content</span>
                    <textarea
                      className="form-textarea block w-full resize-none rounded-xl text-white bg-[#21301c] border border-[#426039] h-48 p-4 placeholder:text-[#a2c398]/70 text-base font-normal leading-normal"
                      placeholder="Your generated content will appear here..."
                      value={generatedContent}
                      readOnly
                    />
                  </label>
                </div>
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-bold">Listing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-white font-medium">Price (Vibecoins)</span>
                      <input
                        className="form-input w-full rounded-xl text-white bg-[#21301c] border border-[#426039] focus:border-[#54d22d] focus:ring focus:ring-[#54d22d]/50 h-14 p-4 placeholder:text-[#a2c398]/70 text-base font-normal"
                        placeholder="e.g., 100"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </label>
                    <div className="flex flex-col justify-end">
                      <button
                        className="flex items-center justify-center gap-2 min-w-[84px] cursor-pointer rounded-full h-14 px-6 bg-[#2e4328] text-white text-base font-bold leading-normal tracking-wide hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        onClick={handleUploadToIPFS}
                        disabled={isUploading || !generatedContent}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Uploading... {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">upload</span>
                            <span>Upload to IPFS</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#2e4328] flex justify-end">
                  <button
                    className="flex min-w-[84px] max-w-sm w-full md:w-auto cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-[#54d22d] text-[#162013] text-lg font-bold leading-normal tracking-wide shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                    onClick={handleListContent}
                    disabled={!generatedContent || !price}
                  >
                    <span>List Content for Sale</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
