/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0D0F",
          900: "#0E1114",
          850: "#12161B",
          800: "#151A20",
          700: "#1A212A"
        },
        card: {
          900: "#12161B",
          850: "#151A20"
        },
        whatsapp: {
          500: "#25D366",
          600: "#1FB758",
          700: "#199A49"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        lift: "0 14px 40px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};
