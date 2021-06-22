import React from 'react';
import styled from 'styled-components';
import TextLoop from 'react-text-loop';
import { Link } from 'react-router-dom';
import { Card, Button, Icon } from 'semantic-ui-react';

const handleColorType = brand => {
	switch (brand) {
		case 'spotify':
			return '#1db954';
		case 'discord':
			return '#5865f2';
		default:
			return '#eeeeee';
	}
};

export const Landing = () => (
	<>
		<TextHeader>
			Explore Your{' '}
			<TextLoop>
				<BrandColor brand='spotify'>Listening</BrandColor>
				<BrandColor brand='discord'>Message</BrandColor>
				<BrandColor brand='spotify'>Playlist</BrandColor>
				<BrandColor brand='discord'>Activity</BrandColor>
			</TextLoop>{' '}
			History
		</TextHeader>
		<StyledCardGroup centered>
			<StyledCard>
				<Card.Content>
					<CardHeader brand='spotify' content='Spotify' />
					<CardDescription content='Explore your listening history through top tracks, first listens, unique artists, device filters, and more.' />
					<Link to='/spotify'>
						<CardButton animated>
							<Button.Content visible>Next</Button.Content>
							<Button.Content hidden>
								<Icon name='arrow right' />
							</Button.Content>
						</CardButton>
					</Link>
				</Card.Content>
			</StyledCard>
			<StyledCard>
				<Card.Content>
					<CardHeader brand='discord' content='Discord' />
					<CardDescription content="Explore your past activity on Discord, including statistics on various actions plus who you've talked to, and where." />
					<CardButton animated href='/discord'>
						<Button.Content visible>Next</Button.Content>
						<Button.Content hidden>
							<Icon name='arrow right' />
						</Button.Content>
					</CardButton>
				</Card.Content>
			</StyledCard>
		</StyledCardGroup>
		<ComingSoonCard centered>
			<ComingSoonCardContent>
				More sites coming soon...
			</ComingSoonCardContent>
		</ComingSoonCard>
	</>
);

const TextHeader = styled.h1`
	margin-top: 100px;
	margin-bottom: 25px;
	text-align: center;
	color: #eeeeee;
`;

const BrandColor = styled.span`
	color: ${({ brand }) => handleColorType(brand)};
`;

const CardHeader = styled(Card.Header)`
	color: ${({ brand }) => handleColorType(brand)} !important;
	text-align: center;
`;

const CardDescription = styled(Card.Description)`
	color: lightgrey !important;
	text-align: center;
	margin: 20px;
`;

const ComingSoonCardContent = styled(Card.Content)`
	color: lightgray !important;
	text-align: center;
	padding: 10px !important;
`;

const StyledCard = styled(Card)`
	box-shadow: none !important;
	background-color: #23272a !important;
`;

const ComingSoonCard = styled(StyledCard)`
	width: 594px !important;
`;

const CardButton = styled(Button)`
	width: 100%;
`;

const StyledCardGroup = styled(Card.Group)`
	box-shadow: none !important;
`;
