import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'
import './test.css'
import './storybook-fonts.css'

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
        document.body.classList.add('font-poppins', 'font-satoshi');
      }
      return Story();
    },
  ],
};

export default preview;