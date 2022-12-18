export const genId = () =>
  window.btoa(Date.now() - Math.round(Math.random() * Date.now() * 0.7) + '');

export const isEqualJSON = <T = unknown>(a: T, b: T) =>
  JSON.stringify(a) === JSON.stringify(b);
