import axios from 'axios'
const baseUrl = '/api/users'

export const getUsersWithBlogs = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

export const getUserWithBlogsById = async (userId) => {
  const request = await axios.get(`${baseUrl}/${userId}`)
  return request.data
}
