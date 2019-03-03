import { useEffect, useState } from 'react';

export const useBodyDiv = () => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setElement(el);

    return () => el.remove();
  }, []);

  return element;
};
