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
    console.log(error.response.data)
    res.status(error.response.status).end(error.response.data)
  }
}
