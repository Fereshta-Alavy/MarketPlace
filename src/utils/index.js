import format from "date-fns/format";
export const convertDollarToCents = price => (price * 100).toFixed(0);

export const converCentsToDollars = price => (price / 100).toFixed(2);

export const formatProductDate = date => format(date, "MMM Do, YYYY");
export const formatOrderDate = date =>
  format(date, "ddd  h:mm A, MMM Do, YYYY");
