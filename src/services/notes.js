import axios from 'axios'
// const baseUrl = 'https://testdeployment-yodj.onrender.com/api/notes'
const baseUrl = '/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    return response.data
  })
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = 
  axios
  .put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }