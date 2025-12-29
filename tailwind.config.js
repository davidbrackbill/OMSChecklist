function createColorScale(h, s, baseL) {
  return {
    DEFAULT: `hsl(${h}, ${s}%, ${baseL}%)`,
    50: `hsl(${h}, ${s}%, 95%)`,
    100: `hsl(${h}, ${s}%, 90%)`,
    200: `hsl(${h}, ${s}%, 80%)`,
    300: `hsl(${h}, ${s}%, 70%)`,
    400: `hsl(${h}, ${s}%, ${Math.min(baseL + 5, 65)}%)`,
    500: `hsl(${h}, ${s}%, ${baseL}%)`,
    600: `hsl(${h}, ${s}%, ${Math.max(baseL - 10, 20)}%)`,
    700: `hsl(${h}, ${s}%, ${Math.max(baseL - 20, 10)}%)`,
    800: `hsl(${h}, ${s}%, ${Math.max(baseL - 30, 5)}%)`,
    900: `hsl(${h}, ${s}%, ${Math.max(baseL - 40, 3)}%)`,
  };
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,html}'],
  safelist: [
    { pattern: /^bg-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^border-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^text-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^from-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^to-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^via-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    // { pattern: /^hover:bg-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    // { pattern: /^hover:via-(ml|graphics|robotics|systems|hci|ai|gray)-(50|100|200|300|400|500|600|700|800|900)$/ },
    'border-2', 'bg-gradient-to-br', 'hover:bg-gradient-to-r', 'hover:from-transparent', 'hover:to-transparent',
  ],
  theme: {
    extend: {
      colors: {
        ml: createColorScale(178, 50, 60),         // --color-ml
        graphics: createColorScale(184, 100, 29),  // --color-graphics
        robotics: createColorScale(77, 64, 51),    // --color-robotics
        systems: createColorScale(48, 100, 50),    // --color-systems
        hci: createColorScale(8, 73, 55),          // --color-hci
        ai: createColorScale(269, 63, 38),         // --color-ai
      }
    },
  },
  plugins: [],
}

