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

export const SpotifyUpload = () => {
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
									<GrayText>Request Spotify Data</GrayText>
								</Header.Subheader>
								<Divider />
							</Header>
							The following is from the{' '}
							<b>Requesting Your Data</b> section of{' '}
							<a href='https://docs.google.com/document/d/1IhFMol3wZs24uKnh2rbxHpLaxhETcfB8KqzYIkEW_iM/edit#heading=h.osk7qfptsw1j'>
								this Google Document
							</a>
							.
							<StyledList ordered>
								<List.Item>
									Go to{' '}
									<a href='https://spotify.com'>
										https://spotify.com
									</a>
									.
								</List.Item>
								<List.Item>
									In the top right, click <b>Profile</b>,
									click <b>Account</b>, then go to{' '}
									<b>Privacy Settings</b>.
								</List.Item>
								<List.Item>
									Scroll down to <b>"Download your data,"</b>{' '}
									then press <b>contact us</b>.
								</List.Item>
								<List.Item>
									Select{' '}
									<b>
										"I want to download a copy of my data,"
									</b>{' '}
									click <b>"I still need help,"</b> then click{' '}
									<b>"Start Chat."</b>
									<StyledList>
										<List.Item>
											<b>NOTE:</b> There are three levels
											of data. <b>Level 1:</b> Personal
											Data. <b>Level 2:</b> Technical Log.{' '}
											<b>Level 3:</b> Listening History.{' '}
											<b>
												You need the level 3 data, so
												emphasize this every step of the
												way.
											</b>
										</List.Item>
									</StyledList>
								</List.Item>
								<List.Item>
									Paste the following text to support:
									<StyledList>
										<List.Item>
											<i>
												Hello! I would like to download
												a copy specifically of my Level
												3 data, which includes my
												extended streaming history since
												the time I created my account.
												I’m in NO need of my Level 1 or
												Level 2 data, just Level 3 will
												do. Thanks!
											</i>
										</List.Item>
										<List.Item>
											If support is unavaible, send the
											text in email to{' '}
											<b>support@spotify.com</b> with the
											subject{' '}
											<b>
												"Downloading Personal Data -
												Extended Streaming History
												(Level 3 Data)"
											</b>
										</List.Item>
									</StyledList>
								</List.Item>
								<List.Item>
									You should receive an email with your data
									within 30 days.
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
									Click or drag <b>
										my_spotify_data.zip
									</b>{' '}
									here for processing
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
