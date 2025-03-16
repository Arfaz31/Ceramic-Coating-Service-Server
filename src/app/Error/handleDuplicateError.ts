import { TErrorSource, TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  // errorMessage = 'Duplicate key error: "test@example.com" already exists';'

  // match[0] always contains the entire part of the string that matches the full regular expression. In the regular expression /"([^"]*)"/, the full pattern is designed to match:
  // A double quote (").
  // Any characters inside the quotes (([^"]*)).
  // A closing double quote (").

  // This capturing group ([^"]*) only cares about the part inside the quotes, which is why match[1] gives you just the text inside the quotes, without the quotes.

  const errorMessages: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Entry',
    errorMessages,
  };
};

export default handleDuplicateError;
