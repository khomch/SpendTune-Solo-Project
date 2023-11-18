import React, { useState } from 'react';
import { useCombinedStore } from '../Store';
import { addCategory } from '../apiService';

function AddCategory() {
  const loggedUser = useCombinedStore((state) => state.logged);
  const authToken = useCombinedStore((state) => state.token);
  const setLoggedUser = useCombinedStore((state) => state.setLoggedUser);
  // local states
  const [addCategoryClicked, setAddCategoryClicked] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');


  async function handleAddCategory() {
    if (
      loggedUser &&
      loggedUser.categories &&
      loggedUser.categories.includes(categoryInput)
    ) {
      console.log('Category already exists');
      return;
    } else if (categoryInput.length < 3) {
      console.log('Category name must be at least 3 characters');
      return;
    } else {
      const updatedUser =
        authToken &&
        (await addCategory({
          category: categoryInput.toLowerCase(),
          token: authToken,
        }));
      setLoggedUser(updatedUser);
      setAddCategoryClicked(false);
      setCategoryInput('');
    }
  }
  
  return (
    <div className='btn btn--small'>
      <input
        type='text'
        placeholder='your category name'
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
      />
      <button className='btn btn--flex' onClick={handleAddCategory}>
        Add
      </button>
    </div>
  );
}

export default AddCategory;
