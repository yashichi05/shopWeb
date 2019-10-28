export default function (num) {
  if (!num) {
    return "";
  }
  let newDate = new Date();
  newDate.setTime(num * 1000);
  let year = newDate.getFullYear();
  // Minutes part from the timestamp
  let month = "0" + (newDate.getMonth() + 1);
  // Seconds part from the timestamp
  let day = "0" + newDate.getDate();
  return `${year}-${month.substr(-2)}-${day.substr(-2)}`
}

