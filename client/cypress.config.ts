import { defineConfig } from "cypress";
import resetDatabase from './cypress/resetDatabase.ts'


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        'db:reset': async () =>  await resetDatabase()
      })
    },
  },
});
