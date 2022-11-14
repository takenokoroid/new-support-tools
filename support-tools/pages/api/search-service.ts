// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Result } from 'type/lib';
type OKResponse = {
  user: {
    cgg_id: string;
    name: string;
  };
  service: {
    deleted: boolean;
  };
};
type ErrorResponse = {
  errorMessage: string;
};
type Response = Result | ErrorResponse;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const request = JSON.parse(req.body);
    const response = await fetch(String(process.env.GET_SERVECE), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors',
        cache: 'no-cache',
      },
      body: JSON.stringify({ id: request.id }),
    });
    if (response.status != 200) {
      const data: ErrorResponse = await response.json();
      res.status(response.status).json({ errorMessage: data.errorMessage });
    } else {
      const data: OKResponse = await response.json();
      const fixedData = [
        {
          user: data.user,
          service: {
            allowServiceSentence: data.service.deleted ? '解除済み' : '利用中',
            allowServiceImage: data.service.deleted
              ? 'https://img.icons8.com/external-others-phat-plus/64/null/external-authentication-biometric-outline-others-phat-plus-2.png'
              : 'https://img.icons8.com/external-others-phat-plus/64/null/external-authentication-biometric-outline-others-phat-plus.png',
          },
        },
      ];
      res.status(200).json(fixedData);
    }
  } catch (error: any) {
    console.log('ERROR', String(error));
    res.status(500).json({ errorMessage: '予期せぬエラーが発生しました。問い合わせてください' });
  }
}
