import { useCombinedStore } from "../Store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend );

function Chart() {

  const loggedUser = useCombinedStore(state => state.logged);
  const categories = loggedUser.categories;
  const transactions = loggedUser.transactionsCategorized;

  const categoriesAmounts = categories.map(category => {
    let amount = 0;
    transactions.forEach(transaction => {
      if (transaction.user_category === category) {
        amount += transaction.amount;
      }
    })
    return amount;
  })

  const data = {
    labels: categories,
    datasets: [
      {
        data: categoriesAmounts,
        backgroundColor: [
          "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a",
          "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"
        ]
        ,
        borderColor: 'rgb(243, 240, 240)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
    { loggedUser.categories.length !== 0 &&
      loggedUser.transactionsCategorized.length !== 0 &&
      <div className="chart">
        <h2>Your expenses</h2>
        <Doughnut data={data} options={options} />
      </div>
    }
    </>
  );
}

export default Chart;