import { useCombinedStore } from '../Store';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TTransaction } from '../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart() {
  const loggedUser = useCombinedStore((state) => state.logged);
  const categories = loggedUser?.categories;
  const transactions: any = loggedUser?.transactionsCategorized;

  const categoriesAmounts: number[] | undefined = categories?.map(
    (category: {}) => {
      let amount = 0;
      transactions.forEach((transaction: TTransaction) => {
        if (transaction.user_category === category) {
          amount += transaction.amount;
        }
      });
      return amount;
    }
  );
  const totals = categoriesAmounts?.reduce((acc, curr) => acc + curr, 0);

  const data = {
    labels: categories,
    datasets: [
      {
        data: categoriesAmounts,
        backgroundColor: [
          '#fd7f6f',
          '#7eb0d5',
          '#b2e061',
          '#bd7ebe',
          '#ffb55a',
          '#ffee65',
          '#beb9db',
          '#fdcce5',
          '#8bd3c7',
        ],
        borderColor: '#10083d',
      },
    ],
  };

  const options: Record<string, string | boolean | {}> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#25BBA8',
          boxWidth: 20,
          padding: 15,
          font: {
            size: 17,
            weight: 'bold',
            family: 'Segoe UI',
          },
        },
      },
    },
  };

  return loggedUser && loggedUser.categories ? (
    <>
      {loggedUser.categories.length !== 0 &&
        loggedUser.transactionsCategorized?.length !== 0 && (
          <div className='chart'>
            <h2 className='chart__title'>Expenses</h2>
            <div className='chart__graph'>
              <Doughnut data={data} options={options} />
            </div>
            <h2 className='chart__totals'>Totals: {totals?.toFixed(2)} GBP</h2>
          </div>
        )}
    </>
  ) : null;
}

export default Chart;

// <div className="chart-container">
//   <div className="chart">
//     <h2>Spendings</h2>
//     <Doughnut data={data} options={options} />
//     <h2 className="totals">Totals: {totals?.toFixed(2)} GBP</h2>
//   </div>
// </div>
