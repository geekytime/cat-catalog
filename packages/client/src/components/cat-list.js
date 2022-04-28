import React, { Component } from 'react'
import { useQuery } from '@apollo/client'
import titleize from 'titleize'
import { CATS_DELETED_SUB, CATS_QUERY, CAT_ADDED_SUB } from '../graph.js'

import './cat-list.scss'

export const CatListWithData = () => {
  const { data, loading, error, subscribeToMore } = useQuery(CATS_QUERY)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <pre>JSON.stringify(error)</pre>
  }

  const subscribeToChanges = () => {
    subscribeToMore({
      document: CAT_ADDED_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev.cats
        }

        const newCat = subscriptionData.data.catAdded
        return { cats: [newCat, ...prev.cats] }
      }
    })

    subscribeToMore({
      document: CATS_DELETED_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev.cats
        }

        const removedName = subscriptionData.data.catsDeleted
        const filteredCats = prev.cats.filter(cat => {
          return cat.catName !== removedName
        })
        return { cats: filteredCats }
      }
    })
  }

  return <CatList cats={data.cats} subscribeToChanges={subscribeToChanges} />
}

export class CatList extends Component {
  componentDidMount () {
    this.props.subscribeToChanges()
  }

  render () {
    return (
      <div className='CatList'>
        {this.props.cats.map(cat => {
          return <CatItem cat={cat} key={cat._id} />
        })}
      </div>
    )
  }
}

export const CatItem = ({ cat }) => {
  const titleizedName = titleize(cat.catName)

  const style = { backgroundImage: `url(${cat.avatarUrl})` }

  return (
    <div className='CatItem'>
      <div className='avatar' style={style}></div>
      <div className='cat-name'>{titleizedName}</div>
    </div>
  )
}
