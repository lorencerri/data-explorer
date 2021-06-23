/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ToastProvider } from 'react-toast-notifications';

import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import { SpotifyData } from './Processors/Spotify';
import { DiscordData } from './Processors/Discord';

const history = createBrowserHistory();

ReactDOM.render(
	<ToastProvider>
		<Router history={history}>
			<SpotifyData.Provider>
				<DiscordData.Provider>
					<App />
				</DiscordData.Provider>
			</SpotifyData.Provider>
		</Router>
	</ToastProvider>,
	document.getElementById('root')
);
