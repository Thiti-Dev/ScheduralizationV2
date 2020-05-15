import { observable, action, computed, decorate } from 'mobx';
export class GlobalStore {
	rootStore;
	constructor(rootStore) {
		this.rootStore = rootStore;
	}

	//
	// ─── NON observable ─────────────────────────────────────────────────────────────────────
	//
	_app_name = 'Schedularization'; // based app name
	// ────────────────────────────────────────────────────────────────────────────────

	app_name = 'Schedularization';

	get app_name_with_version() {
		return this.app_name + 'V2';
	}

	setUniqueAppName() {
		this.app_name = this._app_name + ' ' + new Date().toString();
	}
}

decorate(GlobalStore, {
	app_name: observable,
	app_name_with_version: computed,
	setUniqueAppName: action.bound
});
