import React from 'react';
import styled from 'styled-components';

import { HeaderComponent } from './Components/HeaderComponent';

const App = () => (
	<StyledApp>
		<HeaderComponent />
	</StyledApp>
);

const StyledApp = styled.div`
	margin: max(1%, 10px);
`;

export default App;
