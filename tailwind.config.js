/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        '1': '2px',
        '2': '4px',
        '3': '6px',
        '4': '8px',
        '5': '10px',
        '6': '12px',
        '8': '16px',
        '10': '20px',
        '12': '24px',
        '16': '32px',
        '20': '40px',
        '24': '48px',
        '32': '64px',
        '40': '80px',
        '48': '96px',
        '56': '112px',
        '64': '128px'
      },
      colors: {
        // custom palette for the app plus Dragon Ball palette
        primaryPurple: "#7e22ce", // a rich purple (legacy)
        primaryRed: "#dc2626",    // bright red
        primaryBlue: "#3b82f6",   // vivid blue
        'db-orange': '#f97316',    // DBZ orange
        'db-yellow': '#fbbf24',    // DBZ yellow
        'db-blue': '#0ea5e9',      // lighter sky blue
        'db-black': '#111827'      // deep near-black
      },
      fontFamily: {
        db: ['"Permanent Marker"', 'cursive']
      }
    }
  },
  plugins: []
};
