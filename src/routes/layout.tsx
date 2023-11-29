import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useSession } from '../components/SessionContext/SessionContext';
import { unauthenticatedHttpClient } from '../lib/bungie-api/bungie-service-helper';
import { getManifest } from '../lib/getManifest';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { useManifest } from '../components/ManifestContext/ManifestContext';

const Layout = (): React.ReactElement => {
  const { user } = useSession(); 
  const { manifest, updateManifest } = useManifest();

  useEffect(() => {
    if (!manifest) {
      getManifest(unauthenticatedHttpClient)
        .then((m) => updateManifest({manifest: m}));
    }
  },[manifest, updateManifest]);

  return (
    <div>
      <Header userName={ user?.name } />
      {
        manifest
          ? <Outlet />
          : <LoadingSpinner />
      }
    </div>
  );
}

export default Layout;
