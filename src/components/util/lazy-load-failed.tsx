import classNames from "clsx";
import React, { useCallback, useContext } from "react";

import { LanguageContext } from "../../resources/language";

import "./lazy-load-failed.scss";
import Overlay from "./overlay";

interface LazyLoadFailedProps {
  className?: string;
}

const LazyLoadFailed: React.FC<LazyLoadFailedProps> = ({ className }) => {
  const { sw } = useContext(LanguageContext);
  const reload = useCallback(() => window.location.reload(), []);

  return (
    <Overlay isOpen>
      {({ focusRef }) => (
        <div className={classNames("lazy-load-failed", className)}>
          <h1 ref={focusRef}>{sw.LOAD_FAILED.TITLE}</h1>
          <p>{sw.LOAD_FAILED.BODY}</p>

          <button className="btn outline" onClick={reload}>
            {sw.LOAD_FAILED.RELOAD}
          </button>
        </div>
      )}
    </Overlay>
  );
};

export default LazyLoadFailed;
