import Registry from '../Registry';
import RegistryInformation from '../RegistryInformation';
import fetch from 'node-fetch';
import Folder from '../../../shared/Folder';
import FileSystem from '../../../shared/FileSystem';

export default class DefaultRegistry implements Registry {

  constructor(protected fileSystem: FileSystem, protected name: string, protected version: string) {
   };

  public async fetchInformation(): Promise<RegistryInformation> {
    const response = await fetch(`https://registry.npmjs.org/${this.name}/${this.version}`);

    if(!response.ok) {
      throw new Error(`Could not fetch registry information for package ${this.name} of version ${this.version}`);
    }

    return response.json();
  }

  public async downloadPackage(registryInformation: RegistryInformation): Promise<Folder> {
    const response = await fetch(registryInformation.dist.tarball);

    if(!response.ok) {
      throw new Error(`Could not fetch registry information from ${registryInformation.dist.tarball}`);
    }

    const buffer = await response.buffer();

    return this.fileSystem.downloadPublishedPackage(buffer);
  }
}
