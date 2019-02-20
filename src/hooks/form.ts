import { useCallback, useState } from 'react';

export const useCheckboxField = <T extends HTMLInputElement>(initialState: boolean) => {
  const [value, setValue] = useState(initialState);
  const formHandler = useCallback<React.ChangeEventHandler<T>>(
    ev => setValue(ev.target.checked),
    [],
  );

  return [value, formHandler] as [boolean, React.FormEventHandler<T>];
};

export const useFormField = <T extends { value: string }>(initialState: string) => {
  const [value, setValue] = useState(initialState);
  const formHandler = useCallback<React.ChangeEventHandler<T>>(
    ev => setValue(ev.target.value),
    [],
  );

  return [value, formHandler] as [string, React.FormEventHandler<T>];
};
