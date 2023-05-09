export class TwitterAPIError extends Error {
  constructor(errorMessage: string) {
    super(`There was an error trying to call the Twitter API: ${errorMessage}`);
  }
}
