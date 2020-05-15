import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import './App.css';

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
					</Switch>
				</Router>
			</Provider>
		);
	}
}
