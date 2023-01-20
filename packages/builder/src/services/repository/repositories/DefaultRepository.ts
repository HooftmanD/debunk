import Repository from '../Repository';
import RegistryInformation from '../../registry/RegistryInformation';
import Folder from '../../../shared/Folder';
import fetch from 'node-fetch';
import FileSystem from '../../../shared/FileSystem';
import InvalidRepositoryDownloadUrl from '../../../errors/InvalidRepositoryDownloadUrl';

export default class DefaultRepository implements Repository {
  
  constructor(protected fileSystem: FileSystem, protected registryInformation: RegistryInformation) { }

  public async downloadRepository(): Promise<Folder> {
    const url = this.createDownloadUrl();
    const response = await fetch(url)

    if (!response.ok) {
      throw new InvalidRepositoryDownloadUrl(`Could not fetch repository from ${url}`)
    }

    const buffer = await response.buffer();

    return this.fileSystem.downloadRepository(buffer);
  }

  protected createDownloadUrl(): string {
    return `https://api.github.com/repos/${this.getSubString()}/tarball/v${this.registryInformation.version}`;
  }

  protected getSubString(): string {
    const rawUrl = this.registryInformation.repository.url;
    const possible = ['https://github.com/', 'git://github.com/', 'git+https://github.com/'];

    for (let i = 0, len = possible.length; i < len; i++) {
      if(rawUrl.startsWith(possible[i])){
        return rawUrl.substring(possible[i].length, rawUrl.lastIndexOf('.git'));
      }
    }
    
    throw new Error('Could not get correct substring for original git repository url');
  }
}
