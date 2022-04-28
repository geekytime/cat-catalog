import axios from 'axios'

const apiKey = '894a97c8-843d-46c8-bcac-4c93a2dd42d8'

const rootUrl = 'https://api.thecatapi.com/v1'

export const getRandomAvatarUrl = async () => {
  const searchUrl = `${rootUrl}/images/search`
  const { data } = await axios({
    method: 'get',
    url: searchUrl
  })

  const [firstRecord] = data
  const { url: avatarUrl } = firstRecord
  return avatarUrl
}
