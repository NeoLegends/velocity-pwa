import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import classNames from "clsx";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { useBodyDiv } from "../../hooks/portal";

import "./overlay.scss";

export interface OverlayContentProps {
  focusRef: React.Ref<any>;
}

export interface OverlayMenuProps {
  children: React.FC<OverlayContentProps>;
  className?: string;
  isOpen: boolean;

  onRequestClose?: () => void;
}

const OVERLAY_OPEN_CLASS = "overlay-open";

const Overlay: React.FC<OverlayMenuProps> = ({
  children,
  className,
  isOpen,

  onRequestClose,
}) => {
  const element = useBodyDiv();
  const [focusRef, setFocusRef] = useState<unknown>(null);

  const handleKeyPressed = useCallback(
    (ev: KeyboardEvent) =>
      onRequestClose && ev.key === "Escape" && onRequestClose(),
    [onRequestClose],
  );

  useEffect(() => {
    if (!element || !isOpen) {
      return;
    }

    const app = document.getElementById("root")!;

    // Disable touch events on the background
    app.classList.add(OVERLAY_OPEN_CLASS);

    // Disable scrolling on the body
    disableBodyScroll(element, {
      allowTouchMove: (el) => element.contains(el),
      reserveScrollBarGap: true,
    });

    // Catch escape key
    document.body.addEventListener("keyup", handleKeyPressed);

    return () => {
      app.classList.remove(OVERLAY_OPEN_CLASS);
      enableBodyScroll(element);
      document.body.removeEventListener("keyup", handleKeyPressed);
    };
  }, [element, handleKeyPressed, isOpen]);

  useLayoutEffect(() => {
    // Autofocus first focusable element
    if (
      isOpen &&
      focusRef &&
      typeof (focusRef as HTMLOrSVGElement).focus === "function"
    ) {
      (focusRef as HTMLOrSVGElement).focus();
    }
  }, [focusRef, isOpen]);

  if (!element) {
    return null;
  }

  const dom = (
    <div
      className={classNames("backdrop", isOpen && "visible", className)}
      onClick={onRequestClose}
    >
      {children({ focusRef: setFocusRef })}
    </div>
  );

  return ReactDOM.createPortal(dom, element);
};

export default Overlay;
