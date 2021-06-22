import React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import { HeaderComponent } from './Components/HeaderComponent';

import { Landing } from './Pages/Landing';

const App = () => (
	<StyledApp>
		<HeaderComponent />
		<Switch>
			<Route exact path='/' component={Landing} />
		</Switch>
	</StyledApp>
);

const StyledApp = styled.div`
	margin: max(1%, 10px);
`;

export default App;
