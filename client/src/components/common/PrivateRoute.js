import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
const PrivateRoute = inject('authStore')(
	observer(({ component: Component, authStore, ...rest }) => (
		<Route
			{...rest}
			render={(props) => (authStore.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/" />)}
		/>
	))
);

export default PrivateRoute;
