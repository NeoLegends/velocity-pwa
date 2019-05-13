import React, { useContext } from 'react';

import { useUnofficialPopup } from '../../hooks/legal';
import { LanguageContext } from '../../resources/language';

import Overlay from './overlay';
import './unofficial-popup.scss';

export const UnofficialPopup: React.FC = () => {
  const { displayUnofficialPopup, hideUnofficialPopup } = useUnofficialPopup();
  const { unofficial } = useContext(LanguageContext);

  return (
    <Overlay isOpen={displayUnofficialPopup}>
      {() => (
        <div className="unofficial-popup">
          <h1>{unofficial.HEADER}</h1>
          <p>{unofficial.BODY}</p>
          <button className="btn outline" onClick={hideUnofficialPopup}>
            Okay
          </button>
        </div>
      )}
    </Overlay>
  );
};
