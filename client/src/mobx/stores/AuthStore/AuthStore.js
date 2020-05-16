import { observable, action, computed, decorate } from 'mobx';
import jwt_decode from 'jwt-decode';
export class AuthStore {
	rootStore;
	constructor(rootStore) {
		this.rootStore = rootStore;
	}

	isAuthenticated = false; // initialize value ( not authenticated by default )
	userData = null; // null at first => suppose to be object after the authenticated has set

	setAuthenticated(bool, token, cb) {
		console.log('[AuthStore]: Setting Authenticated = ' + bool);

		// If setting to true => must've passed the valid token
		if (bool) {
			//Decode token to get user data
			const decoded = jwt_decode(token);

			// Check for expired token
			const currentTime = Date.now() / 1000;
			if (decoded.exp < currentTime) {
				this.userData = false;
				//Redirect to login
				window.location.href = '/';
			}
			this.userData = decoded;
			this.isAuthenticated = bool;

			if (cb) cb(bool);
		} else {
			this.userData = null;
			this.isAuthenticated = false;
			if (cb) cb(bool);
		}
	}
}

decorate(AuthStore, {
	isAuthenticated: observable,
	userData: observable,
	setAuthenticated: action.bound
});
