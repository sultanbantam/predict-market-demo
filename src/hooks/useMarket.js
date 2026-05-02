import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { PredictionMarket_ABI, MarketFactory_ABI } from '../lib/abis';
import { CONTRACT_ADDRESSES, IS_DEPLOYED } from '../lib/contracts';
import { parseUnits } from 'viem';
import { USDC_DECIMALS } from './useUSDC';

/**
 * Hook: Create a new market (Factory)
 */
export const useCreateMarket = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ 
    hash: hash || undefined,
    query: { enabled: Boolean(hash) }
  });

  const createMarket = (question, category, resolutionTime) => {
    writeContract({
      address: CONTRACT_ADDRESSES.MARKET_FACTORY,
      abi: MarketFactory_ABI,
      functionName: 'createMarket',
      args: [question, category, resolutionTime],
    });
  };

  return { createMarket, isPending, isConfirming, isSuccess, isError, error, hash, receipt };
};

/**
 * Hook: Read market summary info
 */
export const useMarketInfo = (marketAddress) => {
  const { data, isLoading, refetch } = useReadContract({
    address: marketAddress,
    abi: PredictionMarket_ABI,
    functionName: 'getMarketInfo',
    enabled: !!marketAddress && IS_DEPLOYED,
  });

  if (!data) return { marketInfo: null, isLoading, refetch };

  const [question, category, resolutionTime, resolved, outcome, yesPrice, noPrice, totalPool] = data;

  return {
    marketInfo: {
      question,
      category,
      resolutionTime: Number(resolutionTime),
      resolved,
      outcome,
      yesPrice: Number(yesPrice), // basis points (0-100)
      noPrice: Number(noPrice),
      totalPool, // raw USDC (6 decimals)
    },
    isLoading,
    refetch,
  };
};

/**
 * Hook: Buy shares in a market
 */
export const useBuyShares = (marketAddress) => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash: hash || undefined,
    query: { enabled: Boolean(hash) }
  });

  const buyShares = (isYes, amountUSDC) => {
    writeContract({
      address: marketAddress,
      abi: PredictionMarket_ABI,
      functionName: 'buyShares',
      args: [isYes, parseUnits(String(amountUSDC), USDC_DECIMALS)],
    });
  };

  return { buyShares, isPending, isConfirming, isSuccess, isError, error, hash };
};

/**
 * Hook: Claim winnings
 */
export const useClaimWinnings = (marketAddress) => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash: hash || undefined,
    query: { enabled: Boolean(hash) }
  });

  const claimWinnings = () => {
    writeContract({
      address: marketAddress,
      abi: PredictionMarket_ABI,
      functionName: 'claimWinnings',
    });
  };

  return { claimWinnings, isPending, isConfirming, isSuccess, isError, error, hash };
};

/**
 * Hook: User position in a specific market
 */
export const useUserPosition = (marketAddress) => {
  const { address } = useAccount();
  const { data, refetch } = useReadContract({
    address: marketAddress,
    abi: PredictionMarket_ABI,
    functionName: 'getUserPosition',
    args: [address],
    enabled: !!address && !!marketAddress && IS_DEPLOYED,
  });

  return {
    position: data ? { yesAmount: data[0], noAmount: data[1], claimed: data[2] } : null,
    refetch,
  };
};
