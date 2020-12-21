import { state } from "../../../package.json";
const getFormatdate = (date) => {
  let date2 = new Date(date);
  if (state === "DEV")
    date2.setMilliseconds(date2.getMilliseconds() - 9 * 60 * 60 * 1000);
  const year = date2.getFullYear();
  const month = date2.getMonth() + 1;
  const day = date2.getDate();
  const hour = date2.getHours();
  const minute = date2.getMinutes();
  let result = year + "-";
  if (month < 10) result += "0";
  result += month + "-";
  if (day < 10) result += "0";
  result += day + " ";
  if (hour < 10) result += "0";
  result += hour + ":";
  if (minute < 10) result += "0";
  result += minute;
  return result;
};
export default getFormatdate;
