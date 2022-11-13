import { ChangeEvent, useState } from 'react';
import { Result } from 'type/lib';
export const useSearch = () => {
  const [userId, setUserId] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [results, setResults] = useState<Result>([]);
  const [validMessage, setValidMessage] = useState('');
  const onSearch = async () => {
    try {
      const response = await fetch('/api/search-service', {
        method: 'POST',
        body: JSON.stringify({
          id: userId,
        }),
      });
      if (response.status === 200) {
        const data: Result = await response.json();
        setErrorMessage('');
        setErrorStatus(false);
        setResults(data);
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
