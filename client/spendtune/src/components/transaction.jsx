function Transaction({transaction}) {
    return (
        <>
          <div className="transac_logo">
            <img src={transaction.logo_url} alt={transaction.name} />
          </div>
          <div className="transac_details">
            <p>Name: {transaction.name}</p>
            <p>Date: {transaction.date}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Payment Channel: {transaction.payment_channel}</p>
          </div>

        </>
    );
}

export default Transaction;