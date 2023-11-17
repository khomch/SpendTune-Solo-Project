
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || '6555cd77866daa001cb98e37',
      "PLAID-SECRET": process.env.PLAID_SECRET || '7b2c414be017c00787849a9f378373',
      "Plaid-Version": "2020-09-14",
    },
  },
});


export default new PlaidApi(config);
