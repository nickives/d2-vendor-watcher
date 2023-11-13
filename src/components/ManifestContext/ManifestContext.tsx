import React, { useState } from 'react';
import { VwManifest } from '../../lib/getManifest';

export interface IManifest {
  manifest?: VwManifest;
}

export type TManifestContext = IManifest & {
  updateManifest: (manifest: IManifest) => void;
};

/**
 * ManifestContext is a React context that holds the manifest.
 * Do not use this directly, use the useManifest hook instead.
 */
const ManifestContext = React.createContext<TManifestContext | undefined>(undefined);

/**
 * ManifestProvider is a React component that provides the ManifestContext.
 * @param {React.ComponentPropsWithRef<ElementType>} props
 * @returns {JSX.Element}
 */
export const ManifestProvider = (
  { children, value }: React.PropsWithChildren<{ value?: IManifest }>,
): React.ReactElement => {
  // have to check for window even with use client...
  const initialState = value || {};
  const [manifestState, updateManifest] = useState<IManifest>(initialState);
  return (
    <ManifestContext.Provider value={ { ...manifestState, updateManifest } }>
      { children }
    </ManifestContext.Provider>
  );
};

/**
 * useSession - hook to get the session context
 * This avoids having to check for undefined when we consume the context
 * @returns {TSessionContext}
 */
export const useManifest = (): TManifestContext => {
  const context = React.useContext(ManifestContext);
  if (context === undefined) {
    throw new Error('useManifest must be used within a ManifestProvider');
  }
  return context;
};
