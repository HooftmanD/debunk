import RegistryInformation from '../../registry/RegistryInformation';
import DefaultRepository from './DefaultRepository';
import Repository from '../Repository';
import FileSystem from '../../../shared/FileSystem';

export default class GitHeadRepository extends DefaultRepository implements Repository { 

  constructor(protected fileSystem: FileSystem, protected registryInformation: RegistryInformation) {
    super(fileSystem, registryInformation);
   }

  protected createDownloadUrl(): string {
    return `https://api.github.com/repos/${this.getSubString()}/tarball/${this.registryInformation.gitHead}`;
  }
}
