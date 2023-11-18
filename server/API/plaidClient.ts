
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "654909f4fa0de7001bd2d1ad",
      "PLAID-SECRET": process.env.PLAID_SECRET || "4144d59e913b07ca1ecb317883098e",
      "Plaid-Version": "2020-09-14",
    },
  },
});


export default new PlaidApi(config);
