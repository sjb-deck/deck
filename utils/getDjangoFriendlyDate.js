export const getDjangoFriendlyDate = (date) => {
  return date ? date.toISOString().split('T')[0] : date;
};
