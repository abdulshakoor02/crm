import axios from 'axios'

export default async function handler(req, res) {
  try {
    const { slug } = req.query
    let path = ''
    for (let d of slug) {
      path = path + `/${d}`
    }
    const { data } = await axios.post(`${process.env.baseUrl}${path}`, req.body, {
      headers: { token: req.headers.token }
    })
    res.status(200).json(data)
  } catch (error) {
    console.error(error.response.data, error.response.status)
    res.status(error.response.data).end(error.response.status)
  }
}
