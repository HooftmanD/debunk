export default class InvalidRepositoryDownloadUrl extends Error {
  constructor(message: string) {
    super(message);
  }
}
