/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = 'safelist.txt'

// colors.indigo
const SAFELIST_COLORS = 'colors'

module.exports = {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './safelist.txt'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: [
                'Archivo',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                '"Noto Sans"',
                'sans-serif',
            ],
            serif: [
                'ui-serif',
                'Georgia',
                'Cambria',
                '"Times New Roman"',
                'Times',
                'serif',
            ],
            mono: [
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                '"Liberation Mono"',
                '"Courier New"',
                'monospace',
            ],
        },
        screens: {
            xs: '576',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                background: 'hsl(240 30% 6%)',
                foreground: 'hsl(0 0% 100%)',
                card: 'hsl(240 25% 10%)',
                primary: {
                    DEFAULT: 'hsl(270 70% 65%)',
                    dark: '#A855F4',
                },
                secondary: 'hsl(240 20% 18%)',
                muted: {
                    DEFAULT: 'hsl(240 20% 15%)',
                    foreground: 'hsl(240 10% 75%)',
                },
                accent: 'hsl(220 80% 55%)',
                border: 'hsl(240 15% 20%)',
                destructive: 'hsl(0 72% 51%)',
                donezo: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                    dark: '#104033',
                },
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'hsl(240 10% 60%)',
                        maxWidth: '65ch',
                    },
                },
                invert: {
                    css: {
                        color: 'hsl(0 0% 100%)',
                    },
                },
            }),
        },
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./twSafelistGenerator')({
            path: safeListFile,
            patterns: [
                `text-{${SAFELIST_COLORS}}`,
                `bg-{${SAFELIST_COLORS}}`,
                `dark:bg-{${SAFELIST_COLORS}}`,
                `dark:hover:bg-{${SAFELIST_COLORS}}`,
                `dark:active:bg-{${SAFELIST_COLORS}}`,
                `hover:text-{${SAFELIST_COLORS}}`,
                `hover:bg-{${SAFELIST_COLORS}}`,
                `active:bg-{${SAFELIST_COLORS}}`,
                `ring-{${SAFELIST_COLORS}}`,
                `hover:ring-{${SAFELIST_COLORS}}`,
                `focus:ring-{${SAFELIST_COLORS}}`,
                `focus-within:ring-{${SAFELIST_COLORS}}`,
                `border-{${SAFELIST_COLORS}}`,
                `focus:border-{${SAFELIST_COLORS}}`,
                `focus-within:border-{${SAFELIST_COLORS}}`,
                `dark:text-{${SAFELIST_COLORS}}`,
                `dark:hover:text-{${SAFELIST_COLORS}}`,
                `h-{height}`,
                `w-{width}`,
            ],
        }),
        require('@tailwindcss/typography'),
    ],
}
