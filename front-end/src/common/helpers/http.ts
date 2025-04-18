export const wrapTokenAsHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
