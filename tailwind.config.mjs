//import animations from '@midudev/tailwind-animations'
/** @type {import('tailwindcss').Config} */


export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				roboto: ["Roboto Condensed", "sans-serif"],
				lilita: ['Lilita One', 'sans-serif'],
			  },
			colors:{
				'primary': 'var(--primary)',
				'secondary': 'var(--secondary)',
				'primary-dark': 'var(--primary-dark)',
				'secondary-dark': 'var(--secondary-dark)',
                'background': 'var(--background)',
                'surface': 'var(--surface)',
                'text-main': 'var(--text-main)',
                'text-muted': 'var(--text-muted)',
                'border-color': 'var(--border-color)',
			},
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
		},
	},
	plugins: [],
}
