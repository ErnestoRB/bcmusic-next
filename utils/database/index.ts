export const isDuplicateError = (error: any) => {
  return error?.original && error?.original?.code == "ER_DUP_ENTRY";
};
