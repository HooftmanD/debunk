import RegistryInformation from '../RegistryInformation';
import fetch from 'node-fetch';
import DefaultRegistry from './DefaultRegistry';
import Registry from '../Registry';
import FileSystem from '../../../shared/FileSystem';

export default class ScopedRegistry extends DefaultRegistry implements Registry{
  
  constructor(protected fileSystem: FileSystem, protected name: string, protected version: string) { 
    super(fileSystem, name, version);
  }

  public async fetchInformation(): Promise<RegistryInformation> {
    const requestName = this.name.replace('/', '%2F');
    const response = await fetch(`https://registry.npmjs.org/${requestName}`);

    if(!response.ok) {
      throw new Error(`Could not fetch registry information for package ${this.name} of version ${this.version}`);
    }

    const content = await response.json();

    return content.versions[this.version];
  }
}
