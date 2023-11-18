import { useState } from 'react';
import Chart from './chart';
import Transactions from './transactions';
import AddCategory from './AddCategory';
import { useCombinedStore } from '../Store';

function Home() {
  // global states
  const loggedUser = useCombinedStore((state) => state.logged);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);

  // const navigate = useNavigate();

  function handleCatClicked() {
    setAddCategoryClicked((addCategoryClicked) => !addCategoryClicked);
  }

  return loggedUser ? (
    <div>
      <section className='home'>
        <h2>Dashboard</h2>
        <Chart />
      </section>
      <section>
        {addCategoryClicked && <AddCategory />}
        {loggedUser.transactions &&
          loggedUser.categories &&
          !addCategoryClicked && (
            <h3 className='user-prompt'>Add category to start</h3>
          )}
        {loggedUser.transactions && (
          <button className='btn btn--small' onClick={handleCatClicked}>
            Add category
          </button>
        )}
        {loggedUser.transactions && loggedUser.transactions?.length > 0 && (
          <Transactions />
        )}
      </section>
    </div>
  ) : (
    <p>Please log-in to see the Dashboard</p>
  );
}

export default Home;
