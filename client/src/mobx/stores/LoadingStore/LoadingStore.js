import { observable, action, computed, decorate } from 'mobx';
export class LoadingStore {
	rootStore;
	constructor(rootStore) {
		this.rootStore = rootStore;
	}

	loadingBar = false; // initialize value ( not has been ref yet)

	setLoadingReference(ref) {
		this.loadingBar = ref;
		console.log('[MOBX][LoadingStore]: The reference has been set');
	}

	startContinous() {
		if (this.loadingBar) {
			this.loadingBar.continuousStart();
		}
	}

	instantProcess(timer = 250) {
		if (this.loadingBar) {
			this.loadingBar.continuousStart();
			setTimeout(() => {
				this.loadingBar.complete();
			}, timer);
		}
	}

	complete() {
		if (this.loadingBar) {
			this.loadingBar.complete();
		}
	}
}

decorate(LoadingStore, {
	loadingBar: observable,
	setLoadingReference: action.bound,
	startContinous: action.bound,
	instantProcess: action.bound,
	complete: action.bound
});
