import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ── Change these two values to match your app ──────────────────────
  appId: 'com.titanchart.app',    // Your reverse-domain app ID
  appName: 'TitanChart',          // Your app's display name
  // ───────────────────────────────────────────────────────────────────

  webDir: 'dist',                 // Where npm run build puts files

  server: {
    androidScheme: 'https',       // Required for secure WebView
  },

  android: {
    allowMixedContent: false,     // Keep false for production security
    captureInput: false,
    webContentsDebuggingEnabled: false, // Set true only while debugging
  },

  plugins: {
    // Add Capacitor plugin config here as needed
    // Example:
    // PushNotifications: {
    //   presentationOptions: ['badge', 'sound', 'alert'],
    // },
  },
};

export default config;
