import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  plugins: [pluginReact(),pluginSass()],
  resolve: {
    alias: {
      '@assets': './assets',
      '@components': './src/components',
      '@pages': './src/pages',
      '@utils': './src/utils',
      '@remote': './src/remote',
      '@constants': './src/constants',
      '@theme': './src/theme',
    }
  },
  dev: {

  },
  server: {
    proxy: {
      // '/api': 'https://aip.baidubce.com'
      '/api': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
});

