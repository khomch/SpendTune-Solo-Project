import React from 'react';
import { useState } from 'react';
import Chart from '../chart/chart';
import Transactions from '../transactions/transactions';
import AddCategory from '../AddCategory/AddCategory';
import { useCombinedStore } from '../../Store';
import './home.css';

function Home() {
  // global states
  const loggedUser = useCombinedStore((state) => state.logged);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);

  function handleCatClicked() {
    setAddCategoryClicked((addCategoryClicked) => !addCategoryClicked);
  }

  return loggedUser ? (
    <main>
      {loggedUser.transactions && (
        <section className='container--negative'>
          <h1 className='container__title'>Dashboard</h1>
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
              className='btn btn--negative btn--small btn--sticky'
              onClick={handleCatClicked}
            >
              Add category
            </button>
          )}
        </section>
      )}

      <div className='dashboard'>
        {(loggedUser.transactions && loggedUser.transactions.length > 0) ? (
          <section className='container'>
            <Transactions />
          </section>
        ) : (
          <h2 className='container__title--central'>Please sync your bank from the navigation bar above first.</h2>
        )}
        <section>
          <Chart />
        </section>
      </div>
    </main>
  ) : (
    <p>Please log-in to see the Dashboard</p>
  );
}

export default Home;
