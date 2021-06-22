import React from 'react';
import styled from 'styled-components';
import { Dropdown, Header, Icon } from 'semantic-ui-react';

const options = [
	{
		key: 'discord',
		text: 'Discord',
		value: 'discord',
		content: 'Discord',
	},
	{
		key: 'spotify',
		text: 'Spotify',
		value: 'spotify',
		content: 'Spotify',
	},
];

export const HeaderComponent = () => (
	<Header as='h1'>
		<StyledIcon name='compass' />
		<StyledHeaderContent>
			Data Explorer
			<Header.Subheader>
				<StyledDropdown
					inline
					options={options}
					defaultValue={options[0].value}
				/>
			</Header.Subheader>
		</StyledHeaderContent>
	</Header>
);

const StyledIcon = styled(Icon)`
	color: #eeeeee;
`;

const StyledHeaderContent = styled(Header.Content)`
	color: #eeeeee;
`;

const StyledDropdown = styled(Dropdown)`
	color: #eeeeee !important;
`;
