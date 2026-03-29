module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        neon: '#42f2ff',
        accent: '#7c3aed',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 20% 20%, #1e293b, #0f172a)',
        'gradient-mesh': 'linear-gradient(120deg, rgba(124,58,237,0.25), rgba(66,242,255,0.15)), radial-gradient(circle at 10% 20%, rgba(56,189,248,0.4), transparent 25%), radial-gradient(circle at 80% 0%, rgba(124,58,237,0.3), transparent 30%)',
      },
    },
  },
  plugins: [],
}
