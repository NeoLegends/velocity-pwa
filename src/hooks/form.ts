import { useCallback, useState } from "react";

export const useCheckboxField = <T extends HTMLInputElement>(
  initialState: boolean,
) => {
  const [value, setValue] = useState(initialState);
  const formHandler = useCallback<React.ChangeEventHandler<T>>(
    (ev) => setValue(ev.target.checked),
    [],
  );

  return [value, formHandler, setValue] as [
    boolean,
    React.FormEventHandler<T>,
    (v: boolean) => void,
  ];
};

export const useFormField = <T extends { value: string }>(
  initialState: string,
) => {
  const [value, setValue] = useState(initialState);
  const formHandler = useCallback<React.ChangeEventHandler<T>>(
    (ev) => setValue(ev.target.value),
    [],
  );

  return [value, formHandler, setValue] as [
    string,
    React.FormEventHandler<T>,
    (v: string) => void,
  ];
};
