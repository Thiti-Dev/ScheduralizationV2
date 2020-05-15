import { createContext } from 'react';
import { GlobalStore } from './GlobalStore/GlobalStore';

export class RootStore {
	globalStore = new GlobalStore(this);
}
