import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { MockUSDC_ABI } from '../lib/abis';
import { CONTRACT_ADDRESSES, IS_DEPLOYED } from '../lib/contracts';

const USDC_DECIMALS = 6;

/**
 * Hook: Read USDC balance of connected wallet
 */
export const useUSDCBalance = () => {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: MockUSDC_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });
  const balance = data ? formatUnits(data, USDC_DECIMALS) : '0.00';
  return { balance, isLoading, refetch };
};

/**
 * Hook: Read USDC allowance for a spender (e.g. market address)
 */
export const useUSDCAllowance = (spender) => {
  const { address } = useAccount();
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: MockUSDC_ABI,
    functionName: 'allowance',
    args: [address, spender],
    enabled: !!address && !!spender,
  });
  return { allowance: data || 0n, refetch };
};

/**
 * Hook: Approve USDC spending
 */
export const useUSDCApprove = () => {
  const { writeContract, data: txHash, isPending, isError, error } = useWriteContract();
  // const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
  //   hash: txHash || undefined,
  //   query: { enabled: Boolean(txHash) }
  // });
  const isConfirming = false;
  const isSuccess = false;

  const approve = (spender, amountUSDC) => {
    writeContract({
      address: CONTRACT_ADDRESSES.USDC,
      abi: MockUSDC_ABI,
      functionName: 'approve',
      args: [spender, parseUnits(String(amountUSDC), USDC_DECIMALS)],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, isError, error, txHash };
};

/**
 * Hook: Claim faucet (Only works with Mock contracts)
 */
export const useUSDCFaucet = () => {
  const { writeContract, data: txHash, isPending, isError, error } = useWriteContract();
  // const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
  //   hash: txHash || undefined,
  //   query: { enabled: Boolean(txHash) }
  // });
  const isConfirming = false;
  const isSuccess = false;

  const claimFaucet = () => {
    // Check if we are using the official Circle USDC (no faucet)
    if (CONTRACT_ADDRESSES.USDC === "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238") {
      alert("Real USDC faucet must be accessed via faucet.circle.com");
      return;
    }
    writeContract({
      address: CONTRACT_ADDRESSES.USDC,
      abi: MockUSDC_ABI,
      functionName: 'faucet',
    });
  };

  return { claimFaucet, isPending, isConfirming, isSuccess, isError, error };
};

/**
 * Hook: Last faucet claim time
 */
export const useLastFaucetTime = () => {
  const { address } = useAccount();
  const { data } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: MockUSDC_ABI,
    functionName: 'lastFaucetTime',
    args: [address],
    enabled: !!address && CONTRACT_ADDRESSES.USDC !== "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  });
  return { lastFaucetTime: data ? Number(data) : 0 };
};

export { parseUnits, formatUnits, USDC_DECIMALS };
