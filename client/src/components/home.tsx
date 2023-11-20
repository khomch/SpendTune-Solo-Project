import { useState } from 'react';
import Chart from './chart';
import Transactions from './transactions';
import AddCategory from './AddCategory';
import { useCombinedStore } from '../Store';
import './home.css';

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
    <main>
      <section className='container'>
        <Chart />
      </section>

      {loggedUser.transactions && (
        <section className='container--negative'>
          {!loggedUser.categories && !addCategoryClicked && (
            <h3 className='container__user-prompt'>Add category to start</h3>
          )}

          {addCategoryClicked ? (
            <AddCategory
              addCategoryClicked={addCategoryClicked}
              setAddCategoryClicked={setAddCategoryClicked}
            />
          ) : (
            <button
              className='btn--negative btn--small'
              onClick={handleCatClicked}
            >
              Add category
            </button>
          )}
        </section>
      )}
      <section className='container'>
        {loggedUser.transactions && loggedUser.transactions.length && (
          <Transactions />
        )}
      </section>
    </main>
  ) : (
    <p>Please log-in to see the Dashboard</p>
  );
}

export default Home;
