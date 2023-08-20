export const getSimpleDate = (date) => {
  const formattedDate = new Date(date);
  const formattedTime = `${formattedDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${formattedDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return [formattedDate.toLocaleDateString(), formattedTime];
};
