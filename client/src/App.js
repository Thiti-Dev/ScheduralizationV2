import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import cookie from 'react-cookies';
import jwt_decode from 'jwt-decode';

//
// ─── BEAUTIFY ───────────────────────────────────────────────────────────────────
//
import LoadingBarMobx from './components/common/LoadingBarMobx';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── IMPORTING VIEWS ( NOT VUE LOL ><) ────────────────────────────────────────────────────────────
//
import Landing from './components/pages/Landing';
import Home from './components/pages/Home';
import ConfirmEmail from './components/pages/ConfirmEmail';
import Dashboard from './components/pages/Dashboard';
import Schedule from './components/pages/Schedule';
import Courses from './components/pages/Courses';
import CourseInitialization from './components/pages/CourseInitialization';
import CourseScore from './components/pages/CourseScore';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── TEST ───────────────────────────────────────────────────────────────────────
//
import InitModal from './components/common/InitModal';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── AUTH FLOW ──────────────────────────────────────────────────────────────────
//
import PrivateRoute from './components/common/PrivateRoute';
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
	globalStore: _RootStore.globalStore,
	authStore: _RootStore.authStore,
	loadingStore: _RootStore.loadingStore
};
// ────────────────────────────────────────────────────────────────────────────────

const isStillAuthenticated = (token) => {
	//Check for token
	if (token) {
		_RootStore.authStore.setAuthenticated(true, token);
	}
};

export default class App extends Component {
	componentWillMount() {
		// Big bug fixed ( changed from did mount to will mount => need to be checking before the route is created)
		// later will decide if this has to do everytimes that the component is rendered or just once in this cycle
		const token = cookie.load('token');
		isStillAuthenticated(token);
	}
	render() {
		return (
			<Provider {...store}>
				<Router>
					<LoadingBarMobx />
					<InitModal />
					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/home" component={Home} />
						<Route exact path="/waitingforconfirmation" component={ConfirmEmail} />
						<PrivateRoute exact path="/dashboard" component={Dashboard} />
						<PrivateRoute exact path="/courses" component={Courses} />
						<PrivateRoute exact path="/courseinit" component={CourseInitialization} />
						<PrivateRoute exact path="/coursescore" component={CourseScore} />
						<PrivateRoute exact path="/schedule" component={Schedule} />
					</Switch>
				</Router>
			</Provider>
		);
	}
}
