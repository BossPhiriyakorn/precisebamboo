import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // อ่าน ngrok domain จาก environment variables
    const appDomain = env.VITE_APP_DOMAIN || 'http://localhost:5173';
    const isNgrok = appDomain.includes('ngrok') || appDomain.includes('ngrok-free.app');
    
    return {
      server: {
        host: '0.0.0.0', // อนุญาตการเข้าถึงจากทุก IP
        port: 5173,
        strictPort: false,
        // อนุญาตการเข้าถึงจากทุก host รวมถึง ngrok
        allowedHosts: [
          'localhost',
          '127.0.0.1',
          '.ngrok.io',
          '.ngrok-free.app',
          '.ngrok.app'
        ],
        // ตั้งค่า CORS
        cors: {
          origin: true,
          credentials: true
        },
        // ตั้งค่า headers สำหรับ CORS
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true'
        },
        hmr: {
          // ถ้าเป็น ngrok ให้ใช้ port 443 สำหรับ https
          clientPort: isNgrok ? 443 : 5173,
          host: isNgrok ? 'localhost' : '0.0.0.0'
        },
        // ตั้งค่า proxy สำหรับ ngrok
        proxy: isNgrok ? {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false
          }
        } : undefined
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
