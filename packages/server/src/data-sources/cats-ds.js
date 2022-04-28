import { DataSource } from 'apollo-datasource'

export class CatsDS extends DataSource {
  constructor ({ catsModel }) {
    super()
    this.catsModel = catsModel
  }

  getAll () {
    return this.catsModel.findAll()
  }

  addCat ({ catName }) {
    return this.catsModel.addCat({ catName })
  }

  deleteCats ({ catName }) {
    return this.catsModel.deleteCats({ catName })
  }
}
