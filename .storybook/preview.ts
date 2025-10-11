import type { Preview } from '@storybook/nextjs-vite'
import { Poppins } from 'next/font/google'
import localfont from 'next/font/local'
import '../src/app/globals.css'
import './test.css'

// Configure fonts
const poppins = Poppins({ 
  subsets: ['latin'], 
  variable: '--font-poppins', 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] 
})

const satoshi = localfont({
  src: '../src/app/fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi'
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
    
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      // Apply font variables to the body element
      if (typeof document !== 'undefined') {
        document.body.className = `${poppins.variable} ${satoshi.variable} ${document.body.className}`;
      }
      return Story();
    },
  ],
};

export default preview;