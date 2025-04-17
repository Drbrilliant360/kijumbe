
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3da4372c5dda407891b3b5ff51a34ac8',
  appName: 'kijumbe-simu-yetu',
  webDir: 'dist',
  server: {
    url: 'https://3da4372c-5dda-4078-91b3-b5ff51a34ac8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
