import { createContext } from 'react';
import { GlobalStore } from './GlobalStore/GlobalStore';
import { AuthStore } from './AuthStore/AuthStore';
import { LoadingStore } from './LoadingStore/LoadingStore';
export class RootStore {
	globalStore = new GlobalStore(this);
	authStore = new AuthStore(this);
	loadingStore = new LoadingStore(this);
}
