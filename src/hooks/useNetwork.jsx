import * as Network from 'expo-network';
import { useState, useEffect } from 'react';

export default function useNetwork() {
  const [isOnline, setIsOnline] = useState(true); // Default true
  const [networkState, setNetworkState] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setNetworkState(state);
        const online = state?.isConnected === true && state?.type !== Network.NetworkStateType.NONE;
        setIsOnline(online);
        console.log('Network Status:', online ? 'ONLINE' : 'OFFLINE');
      } catch (error) {
        console.log('Network check failed:', error);
        setIsOnline(false);
      }
    };

    // Check immediately
    checkNetwork();

    // Check every 3 seconds
    const interval = setInterval(checkNetwork, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    networkState,
    isOnline,
  };
}
