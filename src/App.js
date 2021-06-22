import React from 'react';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router-dom';

import { HeaderComponent } from './Components/HeaderComponent';

import { Landing } from './Pages/Landing';
import { Discord } from './Pages/Discord';
import { Spotify } from './Pages/Spotify';

const App = () => (
	<StyledApp>
		<HeaderComponent />
		<Switch>
			<Route exact path='/' component={Landing} />
			<Route exact path='/discord' component={Discord} />
			<Route exact path='/spotify' component={Spotify} />
			<Redirect from='*' to='/' />
		</Switch>
	</StyledApp>
);

const StyledApp = styled.div`
	margin: max(1%, 20px);
`;

export default App;
