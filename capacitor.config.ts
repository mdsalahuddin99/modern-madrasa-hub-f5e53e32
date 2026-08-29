import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.modernmadrasahub.app',
  appName: 'Madrasah Portal',
  webDir: 'public', // Placeholder, we will use the live URL
  server: {
    url: 'https://madrasahportal.vercel.app', // Replace with Live URL
    cleartext: true
  }
};

export default config;
