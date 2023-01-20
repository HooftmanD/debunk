export default interface RegistryInformation {
  name: string;
  version: string;
  repository: {
    url: string;
  },
  gitHead?: string;
  dist: {
    tarball: string;
  },
}
