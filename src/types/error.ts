export type ErrorObject = {
  code: string;
  message: string;
  response: {
    status: number;
    data: {
      error: string;
    };
  };
};
