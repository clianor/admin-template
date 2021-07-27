import { useCallback, useState } from 'react';

export const useInput = (initialValue: string, validator?: (_value: string) => boolean) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      let willUpdate = true;

      if (validator) {
        willUpdate = validator(value);
      }

      if (willUpdate) {
        setValue(value);
      }
    },
    [validator],
  );

  return { value, onChange };
};
