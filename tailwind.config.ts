import type { Config } from 'tailwindcss'
import path from 'path'

// Detect if we're building the widget bundle based on the command
const isWidgetBundle = process.env.VITE_BUILD === 'true' || 
                       process.argv.some(arg => arg.includes('vite.widget.config.ts'));

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    // Disable preflight only when building the widget bundle, enable for everything else
    preflight: !isWidgetBundle,
  },
  theme: {
    extend: {
      colors: {
        customGray: "rgba(246, 249, 252, 1)",
        customGrayDark: "rgba(113, 113, 113, 1)",
        customGrayMedium: "rgba(163, 163, 163, 1)",
        customLightBlue: "rgba(246,249,252)",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
        openSans: ["Open Sans"],
      },
    },
  },
  plugins: [],
}

export default config
