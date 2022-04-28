import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_CAT, DELETE_CATS } from '../graph.js'
import './cat-query.scss'

export const CatQuery = () => {
  const [catName, setCatName] = useState('')

  const [addCat, { error: errorAdd }] = useMutation(ADD_CAT)

  const [deleteCats, { error: errorDelete }] = useMutation(DELETE_CATS)

  if (errorAdd || errorDelete) {
    return (
      <div>
        <div>An error occurred:</div>
        <pre>{JSON.stringify(errorAdd || errorDelete)}</pre>
      </div>
    )
  }

  const handleNewCatClick = () => {
    const trimmedName = catName.trim()
    addCat({ variables: { catName: trimmedName } })
    setCatName('')
  }

  const handleCatNameChange = event => {
    setCatName(event.target.value)
  }

  const handleForgetCatClick = () => {
    const trimmedName = catName.trim()
    deleteCats({ variables: { catName: trimmedName } })
    setCatName('')
  }

  return (
    <div className='CatQuery'>
      <input
        type='text'
        onChange={handleCatNameChange}
        value={catName}
        placeholder="Cat's Name"
      />
      <div className='buttons'>
        <button className='new-cat' onClick={handleNewCatClick}>
          New Cat
        </button>
        <button className='forget-cat' onClick={handleForgetCatClick}>
          Forget Cat
        </button>
      </div>
    </div>
  )
}
