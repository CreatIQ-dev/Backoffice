import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import os from 'os'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        // Move Vite dep cache outside Dropbox to prevent EBUSY lock errors
        cacheDir: path.join(os.tmpdir(), 'vite-creatiq'),
        define: {
            'process.env.API_BASE_URL': JSON.stringify(
                env.REACT_APP_API_BASE_URL,
            ),
        },
        plugins: [
            react({
                babel: {
                    plugins: ['babel-plugin-macros'],
                    compact: false,
                },
            }),
            dynamicImport(),
        ],
        assetsInclude: ['**/*.md'],
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src'),
            },
        },
        build: {
            outDir: 'build',
        },
    }
})
