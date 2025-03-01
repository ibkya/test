import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    allowedHosts: '5bf0-159-146-76-160.ngrok-free.app' // Geliştirme sırasında tüm hostlara izin vermek için.
  },
  preview: {
    allowedHosts: ['5bf0-159-146-76-160.ngrok-free.app'] // ngrok tarafından oluşturulan URL'nizi ekleyin.
  }
});
