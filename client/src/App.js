import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Landing';

export default class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Landing} />
				</Switch>
			</Router>
		);
	}
}
