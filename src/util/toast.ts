import { toast as toastifyToast, ToastOptions } from "react-toastify";

/**
 * Displays a toast which cannot be duplicated and
 * continues ticking, even when the window loses focus.
 */
export const toast = (content: string, options: ToastOptions = {}) => {
  if (!toastifyToast.isActive(content)) {
    return toastifyToast(content, { toastId: content, ...options });
  }
};
