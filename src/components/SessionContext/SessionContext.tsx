import React, { useState } from 'react';
import { BungieMembershipType } from 'bungie-api-ts-no-const-enum-local/destiny2';

export interface ISession {
  user?: {
    name: string;
    characterIds: string[];
  };
  membership?: {
    membershipId: string;
    membershipType: BungieMembershipType;
  }
  // tokens?: Tokens;
}

export type TSessionContext = ISession & {
  updateSessionState: (session: ISession) => void;
};

/**
 * SessionContext is a React context that holds the OAuth state.
 * Do not use this directly, use the useConfig hook instead.
 */
const SessionContext = React.createContext<TSessionContext | undefined>(undefined);

const localStorageKey = 'sessionState';

/**
 * SessionProvider is a React component that provides the SessionContext.
 * @param {React.ComponentPropsWithRef<ElementType>} props
 * @returns {JSX.Element}
 */
export const SessionProvider = (
  { children, value }: React.PropsWithChildren<{ value?: ISession }>,
): React.ReactElement => {
  // have to check for window even with use client...
  const localStorageState = (typeof window !== 'undefined') ? localStorage.getItem(localStorageKey) : undefined;
  const parsedConfig: ISession = localStorageState
    ? JSON.parse(localStorageState)
    : undefined;
  const initialState = value|| parsedConfig || {};
  const [sessionState, updateState] = useState<ISession>(initialState);

  const updateSessionState = (session: ISession) => {
    try {
      const newSession = {
        ...sessionState,
        ...session,
      }
      localStorage.setItem(localStorageKey, JSON.stringify(newSession));
      updateState(newSession);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <SessionContext.Provider value={ { ...sessionState, updateSessionState } }>
      { children }
    </SessionContext.Provider>
  );
};

/**
 * useSession - hook to get the session context
 * This avoids having to check for undefined when we consume the context
 * @returns {TSessionContext}
 */
export const useSession = (): TSessionContext => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionState must be used within a SessionProvider');
  }
  return context;
};
