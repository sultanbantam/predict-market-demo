import { useReadContract, useReadContracts } from 'wagmi';
import { MarketFactory_ABI, PredictionMarket_ABI } from '../lib/abis';
import { CONTRACT_ADDRESSES } from '../lib/contracts';

/**
 * Hook to fetch all markets from the factory and their details.
 */
export function useMarkets() {
  // 1. Get total market count
  const { data: count, isError: countError, isLoading: countLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.MARKET_FACTORY,
    abi: MarketFactory_ABI,
    functionName: 'getMarketCount',
  });

  // 2. Get all market addresses
  const { data: marketAddresses, isLoading: addressesLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.MARKET_FACTORY,
    abi: MarketFactory_ABI,
    functionName: 'getMarkets',
    args: [0n, count || 100n],
    query: { enabled: !!count },
  });

  // 3. Batch fetch details for all markets
  const detailCalls = (marketAddresses || []).map(addr => ({
    address: addr,
    abi: PredictionMarket_ABI,
    functionName: 'getMarketInfo',
  }));

  const { data: details, isLoading: detailsLoading } = useReadContracts({
    contracts: detailCalls,
    query: { enabled: (marketAddresses || []).length > 0 },
  });

  // 4. Format the results to match UI expectations
  const markets = (details || []).map((res, i) => {
    if (!res.result) return null;
    const [question, category, resTime, resolved, outcome, yesPrice, noPrice, totalPool] = res.result;
    
    return {
      id: marketAddresses[i],
      address: marketAddresses[i],
      title: question,
      category: category,
      yesPrice: Number(yesPrice),
      noPrice: Number(noPrice),
      volume: `$${(Number(totalPool) / 1e6).toLocaleString()}`,
      icon: category === 'Crypto' ? '🪙' : category === 'Politics' ? '🗳️' : '📊',
      status: resolved ? 'Resolved' : 'Active',
      outcome: outcome,
      resolutionTime: Number(resTime),
    };
  }).filter(Boolean);

  return {
    markets,
    isLoading: countLoading || addressesLoading || detailsLoading,
    isError: countError,
  };
}
