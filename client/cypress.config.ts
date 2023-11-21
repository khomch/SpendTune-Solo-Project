import { defineConfig } from "cypress";


export default defineConfig({
  projectId: '7iohep',
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      email: 'user1@example.com',
      password: 'password1',
      newEmail: 'newuser@email.com',
      newPassword: 'newuserpassword',

    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // on('task', {
      //   'db:reset': async () =>  await resetDatabase()
      // })
    },
  },
});
