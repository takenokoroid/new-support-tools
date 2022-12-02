import { ChangeEvent, useState } from 'react';
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
export const useSearch = () => {
  const [userId, setUserId] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [results, setResults] = useState<Result>([]);
  const [validMessage, setValidMessage] = useState('');
  const onSearch = async () => {
    try {
      const response = await fetch('http://swagger-api:10083/api/v1/service', {
        method: 'POST',
        body: JSON.stringify({
          id: userId,
        }),
      });
      console.log(response)
      if (response.status === 200) {
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
        setErrorMessage('');
        setErrorStatus(false);
        setResults(fixedData);
      } else {
        const data = await response.json();
        setErrorMessage(data.errorMessage);
        setErrorStatus(true);
      }
    } catch (e) {
      setErrorMessage('エラーです');
      setErrorStatus(true);
      console.log('Error', e);
    }
  };

  const idValidation = (id: string) => {
    const message = (id: string) => {
      setDisabled(true);
      if (!id) return 'IDを入力してください';
      const regex = /^[a-zA-Z]{2}[0-9]{4}$/;
      if (!regex.test(id)) return '先頭英字2桁+数字4桁で入力してください';
      setDisabled(false);
      return '';
    };
    setValidMessage(message(id));
  };

  const onIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    idValidation(e.target.value);
  };
  return { disabled, userId, errorMessage, errorStatus, results, validMessage, onSearch, onIdChange };
};
