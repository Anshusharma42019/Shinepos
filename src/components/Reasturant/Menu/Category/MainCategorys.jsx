import React from 'react'
import AddCategory from './AddCategory'
import CategoryList from './CategoryList'

const MainCategorys = () => {
  return (
    <div className="p-6 space-y-6">
      <AddCategory />
      <CategoryList />
    </div>
  )
}

export default MainCategorys
