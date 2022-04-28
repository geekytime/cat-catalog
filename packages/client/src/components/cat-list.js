import React, { Component } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client'

const CATS_QUERY = gql`
  query GetAllCats {
    cats {
      _id
      name
      avatarUrl
    }
  }
`

const CAT_ADDED_SUB = gql`
  subscription CatAdded {
    catAdded {
      _id
      name
      avatarUrl
    }
  }
`

const CATS_DELETED_SUB = gql`
  subscription CatsDeleted {
    catsDeleted
  }
`

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
          return cat.name != removedName
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
  return (
    <div className='CatItem'>
      <img src={cat.avatarUrl} width='100' />
      <div>{cat.name}</div>
    </div>
  )
}
