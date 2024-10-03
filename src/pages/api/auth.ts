import axios from 'axios'

export default async function handler(req: any, res: any) {
  try {
    const { data } = await axios.post(`${process.env.baseUrl!}/auth`, req.body, {
      headers: { token: req.headers.token }
    })
    res.status(200).json(data)
  } catch (error: any) {
    console.error(error)
    res.status(500).end(error)
  }
}
