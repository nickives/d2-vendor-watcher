import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { removeToken } from "../lib/bungie-api/oauth-tokens";
import { useSession } from "../components/SessionContext/SessionContext";

const Logout = () => {
  const { updateSessionState } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    removeToken();
    updateSessionState({ user: undefined, membership: undefined });
    navigate('/');
  });
  return (<>Logging out...</>);
}

export default Logout;