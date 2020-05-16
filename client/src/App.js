import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

//
// ─── IMPORTING VIEWS ( NOT VUE LOL ><) ────────────────────────────────────────────────────────────
//
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import ConfirmEmail from './components/pages/ConfirmEmail';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── MOBX ───────────────────────────────────────────────────────────────────────
//
import { Provider } from 'mobx-react';

import { RootStore } from './mobx/stores/RootStore';
import makeInspectable from 'mobx-devtools-mst';

const _RootStore = new RootStore();
makeInspectable(_RootStore);
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── COMBINE MOBX STORE ─────────────────────────────────────────────────────────
//
const store = {
	rootStore: _RootStore,
	globalStore: _RootStore.globalStore
};
// ────────────────────────────────────────────────────────────────────────────────
export default class App extends Component {
	render() {
		return (
			<Provider {...store}>
				<Router>
					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/home" component={Home} />
						<Route exact path="/waitingforconfirmation" component={ConfirmEmail} />
					</Switch>
				</Router>
			</Provider>
		);
	}
}
