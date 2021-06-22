import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

export const HeaderComponent = () => (
	<Header as='h1'>
		<StyledIcon name='compass' />
		<StyledHeaderContent>
			<HeaderLink to='/'>Data Explorer</HeaderLink>
			<StyledHeaderSubheader>
				<a href='https://twitter.com/lorencerri'>@lorencerri</a>
			</StyledHeaderSubheader>
		</StyledHeaderContent>
	</Header>
);

const StyledIcon = styled(Icon)`
	color: #eeeeee;
`;

const StyledHeaderContent = styled(Header.Content)`
	color: #eeeeee;
`;

const HeaderLink = styled(Link)`
	color: #eeeeee;
	:hover {
		color: grey;
	}
`;

const StyledHeaderSubheader = styled(Header.Subheader)`
	color: #1da1f2 !important;
`;
