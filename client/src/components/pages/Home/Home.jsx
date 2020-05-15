import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

const Home = inject('globalStore')(
	observer(
		class Home extends React.Component {
			componentDidMount() {
				console.log('[HOME]: mounted');
			}
			render() {
				const { app_name, setUniqueAppName, app_name_with_version } = this.props.globalStore;
				return (
					<div>
						<p>{app_name}</p>
						<button
							onClick={() => {
								setUniqueAppName();
							}}
						>
							test
						</button>
					</div>
				);
			}
		}
	)
);

export default Home;
