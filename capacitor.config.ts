import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bsstudio.bscinema',
  appName: 'BS Cinema',
  webDir: 'dist',
  backgroundColor: '#0a0a0f',
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a0a0f',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0f',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0f',
    },
    Browser: {},
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#ef3340',
      sound: 'default',
    },
  },
};

export default config;
