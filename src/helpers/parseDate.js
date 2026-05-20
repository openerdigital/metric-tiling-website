import * as dayjs from "dayjs";

export const parseDate = (timestamp, format = "DD MMMM YYYY") => {
  const parsedDate = dayjs(timestamp).format(format);

  return parsedDate;
};
// DOCS
// https://day.js.org/docs/en/display/format
