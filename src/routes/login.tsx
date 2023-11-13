import React, { useEffect, useMemo} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { oauthClientId, oauthClientSecret } from '../lib/bungie-api/bungie-api-utils';

const loginButtonClassName = "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white bg-yellow hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 sm:mt-0";
const authEndpoint = "https://www.bungie.net/en/oauth/authorize";

const Login = (): React.ReactElement => {
  const state = useMemo(() => uuidv4(), []);
  useEffect(() => {
    localStorage.setItem('loginState', state);
  }, [state]);

  const loginHref = `${authEndpoint}?client_id=${oauthClientId()}&client_secret=${oauthClientSecret()}&state=${state}&response_type=code`;

  return (
    <div>
      <a className={loginButtonClassName} href={loginHref} >
        Authorize with Bungie.net
      </a>
    </div>
  );
}

export default Login;
