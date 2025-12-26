import * as Network from 'expo-network';
import { useMemo } from 'react';

export default function useNetwork() {
  const networkState = Network.useNetworkState();

  const isOnline = useMemo(() => {
    return (
      networkState?.isConnected === true &&
      networkState?.type !== Network.NetworkStateType.NONE
    );
  }, [networkState]);

  return {
    networkState,
    isOnline,
  };
}
