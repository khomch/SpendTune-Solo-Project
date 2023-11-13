import { useCombinedStore } from "../Store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart() {

  const loggedUser = useCombinedStore(state => state.logged);
  const categories = loggedUser.categories;
  const transactions = loggedUser.transactionsCategorized;

  const data = {
    labels: categories,
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        borderColor: 'rgb(243, 240, 240)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="chart">
      <h2>Your expenses</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default Chart;