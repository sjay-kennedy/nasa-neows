   /** @type {import('tailwindcss').Config} */
   import daisyui from 'daisyui';
   
   export default {
     content: [
       "./src/**/*.{js,ts,jsx,tsx}",
       "./src/app/**/*.{js,ts,jsx,tsx}",
       "./src/components/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [daisyui],
     daisyui: {
       logs: true,
       themes: ["light", "dark"]
  
  }
};