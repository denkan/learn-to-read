export const genId = () =>
  window.btoa(Date.now() - Math.round(Math.random() * Date.now() * 0.7) + '');
