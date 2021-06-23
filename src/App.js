import React from 'react';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router-dom';

import { HeaderComponent } from './Components/HeaderComponent';

import { Landing } from './Pages/Landing';
import { DiscordUpload } from './Pages/DiscordUpload';
import { SpotifyUpload } from './Pages/SpotifyUpload';
import { DiscordExplore } from './Pages/DiscordExplore';

const App = () => (
	<StyledApp>
		<HeaderComponent />
		<Switch>
			<Route exact path='/' component={Landing} />
			<Route exact path='/discord/upload' component={DiscordUpload} />
			<Route exact path='/spotify/upload' component={SpotifyUpload} />
			<Route exact path='/discord/explore' component={DiscordExplore} />
			<Redirect from='*' to='/' />
		</Switch>
	</StyledApp>
);

const StyledApp = styled.div`
	margin: max(1%, 20px);
`;

export default App;
