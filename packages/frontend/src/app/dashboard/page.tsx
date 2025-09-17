'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiClient, TradingStrategy, StrategyExecution, CreateStrategyRequest } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, Activity, Settings, Play, Pause, Loader2 } from 'lucide-react';
import Dashboard3D from '@/components/3d/Dashboard3D';



export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [executions, setExecutions] = useState<StrategyExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Strategy creation form state
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [autoExecute, setAutoExecute] = useState(false);
  const [maxTradeAmount, setMaxTradeAmount] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      authenticateUser();
    } else {
      setIsAuthenticated(false);
      setStrategies([]);
      setExecutions([]);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const authenticateUser = async () => {
    try {
      setIsAuthenticating(true);

      // Check if we already have a valid token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await apiClient.getCurrentUser();
          setIsAuthenticated(true);
          await fetchDashboardData();
          return;
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
        }
      }

      // Get auth challenge
      const challengeResponse = await apiClient.getAuthChallenge();
      const challenge = challengeResponse.challenge;

      // Sign the challenge
      const signature = await signMessageAsync({ message: challenge });

      // Verify the signature
      await apiClient.verifyAuthSignature({
        signature,
        challenge,
      });

      setIsAuthenticated(true);
      await fetchDashboardData();
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch strategies
      const strategiesResponse = await apiClient.getTradingStrategies();
      setStrategies(strategiesResponse.strategies);

      // Fetch executions from all strategies
      const allExecutions: StrategyExecution[] = [];
      for (const strategy of strategiesResponse.strategies.slice(0, 3)) { // Limit to first 3 strategies for performance
        try {
          const executionsResponse = await apiClient.getStrategyExecutions(strategy.id, 1, 5);
          allExecutions.push(...executionsResponse.executions);
        } catch (error) {
          console.error(`Failed to fetch executions for strategy ${strategy.id}:`, error);
        }
      }

      // Sort executions by timestamp (most recent first)
      allExecutions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setExecutions(allExecutions.slice(0, 10)); // Keep only the 10 most recent

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

    if (!isAuthenticated) {
      alert('Please authenticate first');
      return;
    }

    try {
      const request: CreateStrategyRequest = {
        name: strategyName,
        description: strategyDescription,
        riskLevel,
        maxSlippage: 0.01, // Default 1% slippage
      };

      const response = await apiClient.createTradingStrategy(request);
      setStrategies(prev => [...prev, response.strategy]);

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
    if (!isAuthenticated) {
      alert('Please authenticate first');
      return;
    }

    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiClient.updateTradingStrategy(strategyId, { status: newStatus });
      setStrategies(prev =>
        prev.map(strategy =>
          strategy.id === strategyId
            ? { ...strategy, status: newStatus as 'active' | 'inactive' | 'paused' }
            : strategy
        )
      );
    } catch (error) {
      console.error('Failed to toggle strategy status:', error);
      alert('Failed to update strategy status');
    }
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Please connect your wallet to access the trading dashboard
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isAuthenticating) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authenticating...
            </h1>
            <p className="text-gray-600">
              Please sign the authentication message in your wallet
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Please authenticate with your wallet to access the dashboard
            </p>
            <Button onClick={authenticateUser} disabled={isAuthenticating}>
              {isAuthenticating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                'Authenticate'
              )}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
        >
          Skip to main content
        </a>

        {/* Header */}
        <header className="text-center mb-8" id="main-content">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trading Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Monitor and manage your automated trading strategies
          </p>
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Loading dashboard data...</span>
            </div>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1"
            role="tablist"
            aria-label="Dashboard navigation"
          >
            <TabsTrigger value="overview" className="text-sm md:text-base px-2 md:px-4" role="tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="strategies" className="text-sm md:text-base px-2 md:px-4" role="tab">
              Strategies
            </TabsTrigger>
            <TabsTrigger value="executions" className="text-sm md:text-base px-2 md:px-4" role="tab">
              Executions
            </TabsTrigger>
            <TabsTrigger value="create" className="text-sm md:text-base px-2 md:px-4" role="tab">
              Create Strategy
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6" role="tabpanel" aria-labelledby="overview-tab">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" aria-label={`${strategies.length} total strategies`}>
                    {strategies.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {strategies.filter(s => s.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-2xl font-bold text-green-600"
                    aria-label={`Total profit and loss: $${strategies.reduce((sum, s) => sum + s.profitLoss, 0).toFixed(2)}`}
                  >
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
                  <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-2xl font-bold"
                    aria-label={`${strategies.reduce((sum, s) => sum + s.totalTrades, 0)} total trades`}
                  >
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
                  <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-2xl font-bold"
                    aria-label={`Average win rate: ${(strategies.reduce((sum, s) => sum + s.winRate, 0) / strategies.length || 0).toFixed(1)} percent`}
                  >
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
                <div className="space-y-4" role="list" aria-label="Recent strategy executions">
                  {executions.slice(0, 5).map((execution) => (
                    <div
                      key={execution.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                      role="listitem"
                    >
                      <div className="flex items-center space-x-4">
                        {execution.action === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" aria-hidden="true" />
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
                      <Badge
                        variant={execution.status === 'completed' ? 'default' : 'secondary'}
                        className="self-start sm:self-center"
                      >
                        {execution.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="space-y-6" role="tabpanel" aria-labelledby="strategies-tab">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{strategy.name}</CardTitle>
                      <Badge
                        variant={strategy.status === 'active' ? 'default' : 'secondary'}
                        className="self-start sm:self-center"
                      >
                        {strategy.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">P&L</p>
                        <p
                          className={`font-semibold ${strategy.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          aria-label={`Profit and loss: $${strategy.profitLoss.toFixed(2)}`}
                        >
                          ${strategy.profitLoss.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Win Rate</p>
                        <p className="font-semibold" aria-label={`Win rate: ${strategy.winRate.toFixed(1)} percent`}>
                          {strategy.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Trades</p>
                        <p className="font-semibold" aria-label={`${strategy.totalTrades} total trades`}>
                          {strategy.totalTrades}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Risk Level</p>
                        <Badge variant="outline" className="mt-1">{strategy.riskLevel}</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleStrategyStatus(strategy.id, strategy.status)}
                      variant={strategy.status === 'active' ? 'destructive' : 'default'}
                      className="w-full"
                      aria-label={`${strategy.status === 'active' ? 'Pause' : 'Activate'} ${strategy.name} strategy`}
                    >
                      {strategy.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
                          Pause Strategy
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" aria-hidden="true" />
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
          <TabsContent value="executions" className="space-y-6" role="tabpanel" aria-labelledby="executions-tab">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Executions</CardTitle>
                <CardDescription>History of all trading executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" role="list" aria-label="Strategy executions history">
                  {executions.map((execution) => (
                    <div
                      key={execution.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                      role="listitem"
                    >
                      <div className="flex items-center space-x-4">
                        {execution.action === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" aria-hidden="true" />
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
                      <Badge
                        variant={execution.status === 'completed' ? 'default' : 'secondary'}
                        className="self-start sm:self-center"
                      >
                        {execution.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Strategy Tab */}
          <TabsContent value="create" className="space-y-6" role="tabpanel" aria-labelledby="create-tab">
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
                      aria-describedby="strategy-name-help"
                    />
                    <p id="strategy-name-help" className="sr-only">
                      Enter a descriptive name for your trading strategy
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <Select value={riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskLevel(value)}>
                      <SelectTrigger aria-describedby="risk-level-help">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                    <p id="risk-level-help" className="sr-only">
                      Choose the risk level for your trading strategy
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy-description">Description</Label>
                  <textarea
                    id="strategy-description"
                    placeholder="Describe your trading strategy..."
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    aria-describedby="strategy-description-help"
                  />
                  <p id="strategy-description-help" className="sr-only">
                    Provide a detailed description of how your trading strategy works
                  </p>
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
                      aria-describedby="max-trade-amount-help"
                    />
                    <p id="max-trade-amount-help" className="sr-only">
                      Set the maximum amount of VIBE tokens to trade per transaction
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-execute"
                      checked={autoExecute}
                      onCheckedChange={setAutoExecute}
                      aria-describedby="auto-execute-help"
                    />
                    <Label htmlFor="auto-execute">Auto-execute trades</Label>
                    <p id="auto-execute-help" className="sr-only">
                      Enable automatic execution of trades when strategy conditions are met
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCreateStrategy}
                  className="w-full"
                  aria-describedby="create-strategy-help"
                >
                  Create Strategy
                </Button>
                <p id="create-strategy-help" className="sr-only">
                  Click to create your new trading strategy with the provided parameters
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
