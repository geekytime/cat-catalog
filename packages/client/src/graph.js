import { gql } from '@apollo/client'

export const CATS_QUERY = gql`
  query GetAllCats {
    cats {
      _id
      catName
      avatarUrl
    }
  }
`

export const CAT_ADDED_SUB = gql`
  subscription CatAdded {
    catAdded {
      _id
      catName
      avatarUrl
    }
  }
`

export const CATS_DELETED_SUB = gql`
  subscription CatsDeleted {
    catsDeleted
  }
`

export const ADD_CAT = gql`
  mutation AddCat($catName: String!) {
    addCat(catName: $catName) {
      _id
      catName
      avatarUrl
    }
  }
`

export const DELETE_CATS = gql`
  mutation DeleteCats($catName: String!) {
    deleteCats(catName: $catName) {
      catName
    }
  }
`
