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
      accessToken: 'access-sandbox-209ba435-9a75-4e84-b5da-b7d3b4d86958'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // on('task', {
      //   'db:reset': async () =>  await resetDatabase()
      // })
    },
  },
});
