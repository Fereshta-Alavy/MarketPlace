import dateFormat from "dateformat";
export const convertDollarToCents = price => (price * 100).toFixed(0);

export const converCentsToDollars = price => (price / 100).toFixed(2);

export const formatProductDate = date => dateFormat(date, "MMM Do, yyyy");
export const formatOrderDate = date =>
  dateFormat(date, "mmmm dS, yyyy, h:MM TT");
