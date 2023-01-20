import RegistryInformation from './RegistryInformation';
import Folder from '../../shared/Folder';

export default interface Registry {
  fetchInformation(): Promise<RegistryInformation>;
  downloadPackage(registryInformation: RegistryInformation): Promise<Folder>;
}
