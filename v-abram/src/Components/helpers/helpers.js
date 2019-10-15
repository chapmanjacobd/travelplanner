const months = [
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
];

export function getTextDateFromStartDate (lengths, start_date, index){
  // take the string from redux and make it a date object
  const startDate = new Date(start_date);
  // calculate how mnay days since the start to this destination to get start date
  const reducer = (acc, val, i) => (i < index ? acc + val : acc);
  const length = lengths.reduce(reducer);
  startDate.setDate(startDate.getDate() + length);

  const start_month = months[startDate.getMonth()];
  const start_day = startDate.getDate();

  startDate.setDate(startDate.getDate() + lengths[index]);
  const end_month = months[startDate.getMonth()];
  const end_day = startDate.getDate();

  return { start_date: `${start_month} ${start_day}`, end_date: `${end_month} ${end_day}` };
}

export function calculatePercentage (index, lengths){
  const sum = lengths.reduce((total, el) => total + el);
  // console.log((lengths[index]/sum)*100,"calculatePercentage!!")
  return lengths[index] / sum * 100;
}
