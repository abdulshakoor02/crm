import axios from 'axios'

export default async function handler(req: any, res: any) {
  try {
    const { data } = await axios.post(`${process.env.baseUrl!}/login`, req.body)
    res.status(200).json(data)
  } catch (error: any) {
    console.error(error.response.data)
    res.status(error.response.status || 500).end(error.response.data)
  }
}
