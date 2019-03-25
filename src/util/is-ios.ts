/** Whether an iOS browser is currently running the PWA. */
export const isIos =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
