import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_CAT, CATS_QUERY, DELETE_CATS } from '../graph.js'

export const CatQuery = () => {
  const [catName, setCatName] = useState('')

  const [addCat, { loading: loadingAdd, error: errorAdd }] = useMutation(
    ADD_CAT
  )

  const [
    deleteCats,
    { loading: loadingDelete, error: errorDelete }
  ] = useMutation(DELETE_CATS)

  if (errorAdd || errorDelete) {
    return (
      <div>
        <div>An error occurred:</div>
        <pre>JSON.stringify(errorAdd || errorDelete)</pre>
      </div>
    )
  }

  const handleNewCatClick = () => {
    addCat({ variables: { catName } })
  }

  const handleCatNameChange = event => {
    setCatName(event.target.value)
  }

  const handleForgetCatClick = () => {
    deleteCats({ variables: { catName } })
  }

  return (
    <div className='CatQuery'>
      <input type='text' onChange={handleCatNameChange} />
      <div>
        <button onClick={handleNewCatClick}>New Cat</button>
        <button onClick={handleForgetCatClick}>Forget Cat</button>
      </div>
    </div>
  )
}
