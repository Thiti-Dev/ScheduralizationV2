import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
//
// ─── BEAUTIFY ───────────────────────────────────────────────────────────────────
//
import LoadingBar from 'react-top-loading-bar';
// ──
const LoadingBarMobx = inject('loadingStore')(
	observer(
		class LoadingBarMobx extends Component {
			render() {
				const { setLoadingReference } = this.props.loadingStore;
				return <LoadingBar height={3.3} color="#088da5" onRef={(ref) => setLoadingReference(ref)} />;
			}
		}
	)
);

export default LoadingBarMobx;
