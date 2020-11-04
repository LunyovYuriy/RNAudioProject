export const uniqueID = () => {
  const chr4 = () => Math.random().toString(16).slice(-4);
  return `${
    chr4() + chr4()
  }-${chr4()}-${chr4()}-${chr4()}-${chr4()}${chr4()}${chr4()}`;
};

export const getMMSSFromMillis = (millis) => {
  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);

  // eslint-disable-next-line prettier/prettier
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};
