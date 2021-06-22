/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import { SpotifyData } from './Processors/Spotify';
import { DiscordData } from './Processors/Discord';

const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<SpotifyData.Provider>
			<DiscordData.Provider>
				<App />
			</DiscordData.Provider>
		</SpotifyData.Provider>
	</Router>,
	document.getElementById('root')
);
