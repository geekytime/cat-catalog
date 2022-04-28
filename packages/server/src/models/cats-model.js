import { getRandomAvatarUrl } from './cat-image-api.js'

export class CatsModel {
  constructor ({ mongoClient }) {
    this.collection = mongoClient.db().collection('cats')
  }

  async findAll () {
    const response = await this.collection.find()
    const data = await response.toArray()
    return data
  }

  async addCat ({ catName }) {
    const query = { name: catName }
    const existingCat = await this.collection.findOne(query)
    if (existingCat) {
      return this.insertDupeCat({ existingCat })
    } else {
      return this.insertNewCat({ catName })
    }
  }

  async insertDupeCat ({ existingCat }) {
    const { name, avatarUrl } = existingCat
    const doc = { name, avatarUrl }
    return this.insertOne({ doc })
  }

  async insertNewCat ({ catName }) {
    const avatarUrl = await getRandomAvatarUrl()
    const doc = {
      name: catName,
      avatarUrl
    }
    return this.insertOne({ doc })
  }

  async insertOne ({ doc }) {
    const { insertedId: _id } = await this.collection.insertOne(doc)
    return {
      _id,
      ...doc
    }
  }

  async deleteCats ({ catName }) {
    const filter = { name: catName }
    await this.collection.deleteMany(filter)
    return catName
  }
}
