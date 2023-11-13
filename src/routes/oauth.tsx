import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSession } from "../components/SessionContext/SessionContext";
import { getAccessTokenFromCode } from '../lib/bungie-api/oauth';
// import { getLinkedAccounts } from '../lib/bungie-api/destiny2-api';
import { BungieMembershipType } from 'bungie-api-ts-no-const-enum-local/destiny2';
import { setToken } from '../lib/bungie-api/oauth-tokens';

const OAuth = (): React.ReactElement => {
  const { updateSessionState } = useSession();
  const [searchParams] = useSearchParams();
  const code = useMemo(() => searchParams.get('code'), [searchParams]);
  const state = useMemo(() => searchParams.get('state'), [searchParams]);
  const localState = useMemo(() => localStorage.getItem('loginState'), []);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async (code: string) => {
      try {
        const tokens = await getAccessTokenFromCode(code);
        setToken(tokens);
        updateSessionState({ membership: {
          membershipType: BungieMembershipType.BungieNext,
          membershipId: tokens.bungieMembershipId,
        }});
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    }
    if (code && localState === state) {
      localStorage.removeItem('loginState');
      getSession(code);
    }
  }, [code, updateSessionState, state, localState, navigate]);

  return (
    <div>
      {
        code && localState === state
          ? <>Authorizing...</>
          : localState !== state
            ? <>State mismatch...</>
            : <>Error: no code</>
      }
    </div>
  );
}

export default OAuth;