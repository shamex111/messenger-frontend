export const userEndFormat = (qty: number) => {
  if (!qty) return `Нет участников`;
  if (qty % 10 === 1 && qty % 100 !== 11) return ` ${qty} участник`;
  if (
    (qty % 10 === 2 || qty % 10 === 3 || qty % 10 === 4) &&
    (qty % 100 !== 12 && qty % 100 !== 13 && qty % 100 !== 14)
  )
    return `${qty} участника`;
  return `${qty} участников`;
};
