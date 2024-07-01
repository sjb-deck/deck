export const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname === 'deck.nhhs-sjb.org') {
    return 'prod';
  } else if (hostname === 'deck-stg.nhhs-sjb.org') {
    return 'staging';
  }
  return 'local';
};
