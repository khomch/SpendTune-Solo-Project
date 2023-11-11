const apiClient = require("../API/plaidClient");

async function syncTransactions(user){
  const accessToken = user.accessToken;
  const request = {
    access_token: accessToken,
    cursor: null
  }
    const response = await apiClient.transactionsSync(request);
    const transactions = response.data;
    console.log(response);
    // console.log(transactions);
}

module.exports = syncTransactions;