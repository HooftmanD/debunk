import Folder from '../../shared/Folder';

export default interface Repository {
  downloadRepository(): Promise<Folder>;
}
