// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await fetch(process.env.GET_SERVECE,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: 'te0001'}),
    })
    const data = await response.json()
    console.log(data)
    if(response.status != 200){
      res.status(response.status).send({errorMessage: data.errorMessage});
    } else {
      res.status(200).json(data)
    }
  }catch (error){
    console.log(error)
    res.status(error.response.status).send(error.response.body);
  }
}
