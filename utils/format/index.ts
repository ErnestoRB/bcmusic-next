export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);

  if (minutes < 60) {
    return `${minutes} minutos y ${remainingSeconds} segundos`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} horas y ${remainingMinutes} minutos`;
  }
};
