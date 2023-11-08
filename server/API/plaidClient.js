const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

console.log(process.env)
//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

module.exports = client;