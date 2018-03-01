import RenderAuthorized from '../components/antd-pro/Authorized';
import { getToken } from './authority';

let Authorized = RenderAuthorized(getToken()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getToken());
};

export { reloadAuthorized };
export default Authorized;
