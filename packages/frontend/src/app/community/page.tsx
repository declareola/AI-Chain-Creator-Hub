'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Heart, Share, Trophy, Users, TrendingUp } from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions');

  // Mock data
  const topCreators = [
    { id: 1, name: 'Alice Chen', avatar: '/avatar1.jpg', nfts: 45, followers: 1200, rank: 1 },
    { id: 2, name: 'Bob Smith', avatar: '/avatar2.jpg', nfts: 38, followers: 980, rank: 2 },
    { id: 3, name: 'Carol Davis', avatar: '/avatar3.jpg', nfts: 52, followers: 1500, rank: 3 },
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best AI prompts for cyberpunk art?',
      author: 'TechArtist',
      avatar: '/avatar1.jpg',
      replies: 23,
      likes: 45,
      time: '2h ago',
      tags: ['AI', 'Cyberpunk', 'Tips']
    },
    {
      id: 2,
      title: 'New marketplace features discussion',
      author: 'NFTCollector',
      avatar: '/avatar2.jpg',
      replies: 18,
      likes: 32,
      time: '4h ago',
      tags: ['Marketplace', 'Updates']
    },
    {
      id: 3,
      title: 'Collaborative NFT creation ideas',
      author: 'CreativeMind',
      avatar: '/avatar3.jpg',
      replies: 31,
      likes: 67,
      time: '6h ago',
      tags: ['Collaboration', 'NFT']
    },
  ];

  const recentActivity = [
    { user: 'Alice Chen', action: 'created a new NFT', time: '5m ago' },
    { user: 'Bob Smith', action: 'sold an NFT for 2.5 ETH', time: '12m ago' },
    { user: 'Carol Davis', action: 'started a discussion', time: '1h ago' },
    { user: 'David Lee', action: 'followed 3 new creators', time: '2h ago' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow creators, share ideas, and discover trending NFTs
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">12,847</div>
              <div className="text-gray-600">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">3,421</div>
              <div className="text-gray-600">Discussions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">892</div>
              <div className="text-gray-600">Top Creators</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">156K</div>
              <div className="text-gray-600">NFT Trades</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-4">
                {/* New Discussion */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Start a Discussion</h3>
                    <div className="space-y-4">
                      <Input placeholder="Discussion title..." />
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        rows={3}
                        placeholder="Share your thoughts..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm">Post Discussion</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discussions List */}
                {discussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                          {discussion.author[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{discussion.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>by {discussion.author}</span>
                            <span>{discussion.time}</span>
                          </div>
                          <div className="flex gap-2 mb-4">
                            {discussion.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {discussion.replies} replies
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 mr-2" />
                              {discussion.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Creators</CardTitle>
                    <CardDescription>Most active and successful NFT creators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCreators.map((creator) => (
                        <div key={creator.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full font-bold">
                            {creator.rank}
                          </div>
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {creator.name[0]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{creator.name}</h4>
                            <p className="text-sm text-gray-600">{creator.nfts} NFTs • {creator.followers} followers</p>
                          </div>
                          <Button variant="outline" size="sm">Follow</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>What's happening in the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#CyberpunkArt</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">1.2K posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#AICollaboration</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">856 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#NFTMarketplace</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">723 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#DigitalArt</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">645 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle>Online Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-bold">A</div>
                    <span className="text-sm">Alice Chen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-bold">B</div>
                    <span className="text-sm">Bob Smith</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-bold">C</div>
                    <span className="text-sm">Carol Davis</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">+ 1,247 others online</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Find Creators
                </Button>
                <Button className="w-full" variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
