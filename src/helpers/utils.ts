export const removeEmptyProps = (obj: any): any => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null && v !== "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmptyProps(v) : v])
  );
};

export const truncateAddress = (address: string) => {
  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
