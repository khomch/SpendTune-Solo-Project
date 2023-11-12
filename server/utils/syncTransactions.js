const apiClient = require("../API/plaidClient");

async function syncTransactions(user){
  const accessToken = user.accessToken;
  const request = {
    access_token: accessToken,
    cursor: user.next_cursor || null
  }
    const response = await apiClient.transactionsSync(request);

    if (response.data.next_cursor) {
      user.next_cursor = response.data.next_cursor;
      await user.save({ new: true });
    }

    if (response.data.added.length) {

      const transactions = response.data.added;
      const spendings = transactions.filter(transaction => transaction.amount > 0);
      const finalTransactions = spendings.map(transaction => {
        return {
          id: transaction.transaction_id,
          name: transaction.name,
          logo_url: transaction.logo_url,
          amount: transaction.amount + ' ' + transaction.iso_currency_code,
          date: transaction.authorized_date,
          categories: transaction.category,
          payment_channel: transaction.payment_channel,
        }
      })
      user.transactions = user.transactions.concat(finalTransactions);
      const updatedUser = await user.save({ new: true });
      return updatedUser;
    } else {
      return "No new transactions";
    }

}

module.exports = syncTransactions;