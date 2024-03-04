function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
export function stringAvatar(name) {
  const words = name.split(' ');
  const initials =
    words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0][0];

  return {
    sx: {
      bgcolor: stringToColor(name),
      height: 100,
      width: 100,
      marginBottom: 2,
    },
    children: initials,
  };
}
