import { Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
  NeedsUpdateResponse,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(true); // true = debug logs

export const checkForInAppUpdate = async () => {
  if (__DEV__) {
    console.log('🧩 Skipping update check in dev mode');
    return;
  }

  try {
    console.log('🔍 Checking for in-app updates...');
    const result: NeedsUpdateResponse = await inAppUpdates.checkNeedsUpdate();

    console.log('📦 Update check result:', result);

    if (result.shouldUpdate) {
      console.log('⚠️ Forced update required!');

      // FORCE UPDATE MODE
      const updateOptions: StartUpdateOptions = {
        updateType: IAUUpdateKind.IMMEDIATE, // 👈 Blocks app until updated
      };

      await inAppUpdates.startUpdate(updateOptions);
      console.log('🚀 Update started (IMMEDIATE mode).');
    } else {
      console.log('✅ App is up to date.');
    }
  } catch (error) {
    console.log('❌ In-app update error:', error);
  }
};
