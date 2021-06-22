/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import {
	Grid,
	List,
	Card,
	Header,
	Divider,
	Icon,
	Segment,
} from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';

export const DiscordUpload = () => {
	const { getRootProps, getInputProps } = useDropzone();

	return (
		<>
			<Grid centered columns={1}>
				<StyledCard>
					<Card.Content>
						<CardDescription>
							<Header as='h2'>
								<GrayText>Step 1</GrayText>
								<Header.Subheader>
									<GrayText>Request Discord Data</GrayText>
								</Header.Subheader>
								<Divider />
							</Header>

							<StyledList ordered>
								<List.Item>
									Open <b>User Settings</b> by clicking the
									gear icon in the bottom left of Discord.
									<StyledList>
										<List.Item>
											If you're on mobile, swipe to the
											right and click your avatar instead.
										</List.Item>
									</StyledList>
								</List.Item>
								<List.Item>
									Click on <b>Privacy & Safety</b>.
								</List.Item>
								<List.Item>
									Scroll down until you see{' '}
									<b>"Request all of my Data"</b> and press
									the button.
								</List.Item>
								<List.Item>
									Your data will be emailed to you within 30
									days, typically sooner.
								</List.Item>
							</StyledList>
						</CardDescription>
					</Card.Content>
				</StyledCard>
			</Grid>
			<Grid centered columns={1}>
				<StyledCard>
					<Card.Content>
						<CardDescription>
							<Header as='h2'>
								<GrayText>Step 2</GrayText>
								<Header.Subheader>
									<DarkGrayText>
										All data is processed in your web
										browser. No data is collected.
									</DarkGrayText>
								</Header.Subheader>
								<Divider />
							</Header>

							<StyledSegment
								placeholder
								{...getRootProps({ className: 'dropzone' })}
							>
								<Header icon>
									<input {...getInputProps()} />
									<Icon name='folder' />
									Click or drag <b>package.zip</b> here for
									processing
								</Header>
							</StyledSegment>
						</CardDescription>
					</Card.Content>
				</StyledCard>
			</Grid>
		</>
	);
};

const StyledSegment = styled(Segment)`
	height: 100px !important;
	min-height: 150px !important;
	background-color: #2c2f33 !important;
	* {
		color: #eeeeee !important;
	}
`;

const DarkGrayText = styled.span`
	color: darkgrey;
`;

const GrayText = styled.span`
	color: #eeeeee;
`;

const StyledList = styled(List)`
	*:before {
		color: #eeeeee !important;
	}
`;

const CardDescription = styled(Card.Description)`
	color: lightgrey !important;
	text-align: left;
	margin: 20px;
`;

const StyledCard = styled(Card)`
	box-shadow: none !important;
	background-color: #23272a !important;
	margin-top: 25px !important;
	width: max(40%, 300px) !important;
`;
