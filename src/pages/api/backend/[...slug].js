import axios from 'axios'

export default async function handler(req, res) {
  try {
    const { slug } = req.query
    let path = ''
    for (let d of slug) {
      path = path + `/${d}`
    }
    const { data } = await axios.post(`${process.env.baseUrl}${path}`, req.body, { headers: req.headers })
    res.status(200).json(data)
  } catch (error) {
    console.error(error.response.data)
    res.status(error.response.status || 500).end(error.response.data)
  }
}
