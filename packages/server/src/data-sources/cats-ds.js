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
    const nameLower = catName.toLowerCase()
    return this.catsModel.addCat({ catName: nameLower })
  }

  deleteCats ({ catName }) {
    const nameLower = catName.toLowerCase()
    return this.catsModel.deleteCats({ catName: nameLower })
  }
}
