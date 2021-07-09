import { ApolloError, gql, useMutation } from '@apollo/client';
import { useInput } from '@client/utils/useInput';
import {
  verifyCodeMutation,
  verifyCodeMutationVariables,
} from '@client/__generated__/verifyCodeMutation';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const VERIFY_CODE_MUTATION = gql`
  mutation verifyCodeMutation($verifyCodeInput: VerifyCodeInput!) {
    verifyCode(input: $verifyCodeInput) {
      ok
      error
    }
  }
`;

const Verify: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { value, onChange } = useInput('');

  const onCompleted = (_data: verifyCodeMutation) => {
    return router.push('/');
  };

  const onError = (_error: ApolloError) => {
    const { extensions } = _error.graphQLErrors[0];
    if (extensions) {
      const {
        exception: {
          response: { error: loginError },
        },
      } = extensions;
      setError(loginError);
    } else {
      setError('알 수 없는 에러가 발생했습니다.');
    }
  };

  const [verifyCodeMutation, { loading }] = useMutation<
    verifyCodeMutation,
    verifyCodeMutationVariables
  >(VERIFY_CODE_MUTATION, { onCompleted, onError });

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      return verifyCodeMutation({
        variables: {
          verifyCodeInput: {
            code: value,
          },
        },
      });
    },
    [value, verifyCodeMutation],
  );

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <form
        className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
        onSubmit={handleSubmit}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-gray-600 mb-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
        <p className="mb-5 text-3xl uppercase text-gray-600">Verify</p>
        <input
          type="code"
          name="code"
          className="mb-5 p-3 w-80 focus:border-green-700 rounded border-2 outline-none"
          autoComplete="off"
          placeholder="Code"
          value={value}
          onChange={onChange}
          required
        />
        {error && <p className="mb-5 w-80 text-red-500">{error}</p>}
        <button
          className="bg-green-600 hover:bg-green-900 text-white font-bold p-2 rounded w-80"
          id="login"
          type="submit"
        >
          <span>Login</span>
        </button>
      </form>
    </div>
  );
};

export default Verify;
