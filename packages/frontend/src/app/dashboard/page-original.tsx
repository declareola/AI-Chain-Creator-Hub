'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, Activity, Settings, Play, Pause } from 'lucide-react';

interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  profitLoss: number;
  totalTrades: number;
  winRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface StrategyExecution {
  id: string;
  strategyId: string;
  action: 'buy' | 'sell';
  token: string;
  amount: number;
  price: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [executions, setExecutions] = useState<StrategyExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Strategy creation form state
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [autoExecute, setAutoExecute] = useState(false);
  const [maxTradeAmount, setMaxTradeAmount] = useState('');

  useEffect(() => {
    if (isConnected) {
      fetchDashboardData();
    }
  }, [isConnected]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch strategies and executions from API
      // For now, using mock data
      setStrategies([
        {
          id: '1',
          name: 'Momentum Strategy',
          description: 'Trades based on price momentum indicators',
          status: 'active',
          profitLoss: 1250.50,
          totalTrades: 45,
          winRate: 68.5,
          riskLevel: 'medium',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Mean Reversion',
          description: 'Trades when price deviates from moving average',
          status: 'inactive',
          profitLoss: -320.25,
          totalTrades: 23,
          winRate: 52.1,
          riskLevel: 'low',
          createdAt: '2024-01-20T14:30:00Z'
        }
      ]);

      setExecutions([
        {
          id: '1',
          strategyId: '1',
          action: 'buy',
          token: 'VIBE',
          amount: 1000,
          price: 0.85,
          timestamp: '2024-01-25T09:15:00Z',
          status: 'completed'
        },
        {
          id: '2',
          strategyId: '1',
          action: 'sell',
          token: 'VIBE',
          amount: 800,
          price: 0.92,
          timestamp: '2024-01-25T11:30:00Z',
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStrategy = async () => {
    if (!strategyName.trim() || !strategyDescription.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create strategy via API
      const newStrategy: TradingStrategy = {
        id: Date.now().toString(),
        name: strategyName,
        description: strategyDescription,
        status: 'inactive',
        profitLoss: 0,
        totalTrades: 0,
        winRate: 0,
        riskLevel,
        createdAt: new Date().toISOString()
      };

      setStrategies(prev => [...prev, newStrategy]);

      // Reset form
      setStrategyName('');
      setStrategyDescription('');
      setRiskLevel('medium');
      setAutoExecute(false);
      setMaxTradeAmount('');

      alert('Strategy created successfully!');
    } catch (error) {
      console.error('Failed to create strategy:', error);
      alert('Failed to create strategy');
    }
  };

  const toggleStrategyStatus = async (strategyId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setStrategies(prev =>
        prev.map(strategy =>
          strategy.id === strategyId
            ? { ...strategy, status: newStatus as 'active' | 'inactive' }
            : strategy
        )
      );
    } catch (error) {
      console.error('Failed to toggle strategy status:', error);
    }
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please connect your wallet to access the trading dashboard
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trading Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor and manage your automated trading strategies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
            <TabsTrigger value="create">Create Strategy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{strategies.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {strategies.filter(s => s.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +${strategies.reduce((sum, s) => sum + s.profitLoss, 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All strategies combined
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {strategies.reduce((sum, s) => sum + s.totalTrades, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all strategies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(strategies.reduce((sum, s) => sum + s.winRate, 0) / strategies.length || 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average across strategies
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest strategy executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executions.slice(0, 5).map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {execution.action === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {execution.action.toUpperCase()} {execution.amount} {execution.token}
                          </p>
                          <p className="text-sm text-gray-600">
                            @ ${execution.price} • {new Date(execution.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                        {execution.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">P&L</p>
                        <p className={`font-semibold ${strategy.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${strategy.profitLoss.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Win Rate</p>
                        <p className="font-semibold">{strategy.winRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Trades</p>
                        <p className="font-semibold">{strategy.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Risk Level</p>
                        <Badge variant="outline">{strategy.riskLevel}</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleStrategyStatus(strategy.id, strategy.status)}
                      variant={strategy.status === 'active' ? 'destructive' : 'default'}
                      className="w-full"
                    >
                      {strategy.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Strategy
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate Strategy
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Executions</CardTitle>
                <CardDescription>History of all trading executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {execution.action === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {execution.action.toUpperCase()} {execution.amount} {execution.token}
                          </p>
                          <p className="text-sm text-gray-600">
                            @ ${execution.price} • {new Date(execution.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                        {execution.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Strategy Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Strategy</CardTitle>
                <CardDescription>
                  Define a new automated trading strategy with custom parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input
                      id="strategy-name"
                      placeholder="Enter strategy name"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <Select value={riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskLevel(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy-description">Description</Label>
                  <textarea
                    id="strategy-description"
                    placeholder="Describe your trading strategy..."
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    className="w-full p-3 border rounded-md resize-none"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-trade-amount">Max Trade Amount (VIBE)</Label>
                    <Input
                      id="max-trade-amount"
                      type="number"
                      placeholder="1000"
                      value={maxTradeAmount}
                      onChange={(e) => setMaxTradeAmount(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-execute"
                      checked={autoExecute}
                      onCheckedChange={setAutoExecute}
                    />
                    <Label htmlFor="auto-execute">Auto-execute trades</Label>
                  </div>
                </div>

                <Button onClick={handleCreateStrategy} className="w-full">
                  Create Strategy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
