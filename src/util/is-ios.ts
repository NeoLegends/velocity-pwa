export const isIos =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
