'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button onClick={() => disconnect()} variant="outline">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
}
