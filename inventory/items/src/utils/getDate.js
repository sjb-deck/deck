import dayjs from 'dayjs';

export const getSimpleDate = (date) => {
  const formattedDate = new Date(date);
  const formattedTime = `${formattedDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${formattedDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  return { formattedDate: formattedDate.toLocaleDateString(), formattedTime };
};

export const getReadableDate = (date) => {
  const formattedDateTime = dayjs(date)
    .locale('en')
    .format('D MMM YYYY - HH:mm');
  const formattedDate = dayjs(date).locale('en').format('D MMM YYYY');
  return { formattedDate, formattedDateTime };
};

export const getDjangoFriendlyDate = (date) => {
  return date ? date.toISOString().split('T')[0] : date;
};
