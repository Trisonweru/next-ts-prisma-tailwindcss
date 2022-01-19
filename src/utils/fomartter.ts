// A utility to format currency
export const formatter = (curr: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr,
  });
};
