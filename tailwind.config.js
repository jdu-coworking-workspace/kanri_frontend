/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dark mode 'class' orqali boshqarilishi uchun (Headerdagi toggle ishlashi uchun shart)
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        "slow-ping": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "reveal-text": "reveal-text 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
        "scroll-line": "scroll-line 2s infinite cubic-bezier(0.77, 0, 0.175, 1)",
        "slow-zoom": "slow-zoom 30s linear infinite alternate",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
      keyframes: {
        "reveal-text": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },
        "scroll-line": {
          "0%": {
            transform: "translateY(-100%)"
          },
          "100%": {
            transform: "translateY(200%)"
          }
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "slow-zoom": {
          "0%": {
            transform: "scale(1)"
          },
          "100%": {
            transform: "scale(1.1)"
          }
        }
      },
      fontFamily: {
        // Luxury dizayn uchun Sans-serif shriftini asosiy qilib belgilaymiz
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      colors: {
        // Luxury & Cyber palitrasi
        cyber: {
          light: '#3b82f6',
          dark: '#6366f1',
          accent: '#8b5cf6', // Violet qo'shildi (Premium ko'rinish uchun)
        },
        primary: {
          DEFAULT: "#0A1D37",
          dark: "#020617", // O'ta quyuq Luxury fon
        },
        secondary: "#1E4174",
        concrete: "#8E9196",

        text: {
          primary: "#1A1A1A",
          secondary: "#4B5563",
          light: "#9CA3AF",
        },
      },
      backgroundImage: {
        // Header va tugmalar uchun premium gradientlar
        "luxury-gradient": "linear-gradient(135deg, #0A1D37 0%, #1E4174 100%)",
        "cyber-gradient": "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
        "glass-gradient": "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
      },
      boxShadow: {
        // Elementlar havoda turgandek ko'rinishi uchun (Luxury effect)
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'cyber-glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "28px",
        "stonix": "12px",
      },
      screens: {
        // Siz ko'rsatgan maxsus screenlar
        small: "360px",
        xs: "450px",
        sm: "650px",
        md: "770px",
        lg: "992px",
        "2xl": "1200px",
        "4xl": "1300px",
        "6xl": "1440px",
        "7xl": "1540px",
        "8xl": "1640px",
      },
    },
  },
  plugins: [],
};