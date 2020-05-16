import { createContext } from 'react';
import { GlobalStore } from './GlobalStore/GlobalStore';
import { AuthStore } from './AuthStore/AuthStore';
export class RootStore {
	globalStore = new GlobalStore(this);
	AuthStore = new AuthStore(this);
}
