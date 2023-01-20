import Folder from '../../shared/Folder';

export default interface RepositoryType {
  transform(): Promise<Folder>
}
