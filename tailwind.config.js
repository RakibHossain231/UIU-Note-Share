/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Legacy brand colors (kept so existing pages keep rendering)
        uiu: {
          orange: '#FF6600',
          'orange-light': '#FF8533',
          'orange-dark': '#E65C00',
          dark: '#121212',
          surface: '#1E1E1E',
          card: '#252525',
          border: '#333333',
        },
        // Design-system tokens (shadcn/ui convention)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        DEFAULT: '2px', sm: '2px', md: '3px', lg: '4px', xl: '4px', '2xl': '6px', '3xl': '8px',
      },
      boxShadow: {
        sm: '1px 1px 0 hsl(var(--foreground) / 0.14)',
        DEFAULT: '2px 2px 0 hsl(var(--foreground) / 0.16)',
        md: '3px 3px 0 hsl(var(--foreground) / 0.16)',
        lg: '4px 4px 0 hsl(var(--foreground) / 0.2)',
        xl: '6px 6px 0 hsl(var(--foreground) / 0.2)',
        '2xl': '8px 8px 0 hsl(var(--foreground) / 0.24)',
        soft: '2px 2px 0 hsl(var(--foreground) / 0.14)',
        lift: '5px 5px 0 hsl(var(--primary))',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
