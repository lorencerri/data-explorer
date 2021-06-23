import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import {
	Grid,
	Card,
	Header,
	Divider,
	List,
	Modal,
	Table,
	Label,
} from 'semantic-ui-react';

import { DiscordData } from '../Processors/Discord';

export const DiscordExplore = () => {
	const history = useHistory();
	const DiscordDataContainer = DiscordData.useContainer();
	const [data, setData] = useState({
		user: {
			guild_settings: [],
			notes: {},
			payments: [],
			user_activity_application_statistics: [],
		},
	});

	useEffect(() => {
		if (!DiscordDataContainer.files.length) {
			history.push('/discord/upload');
		}

		const fetchData = async () => {
			setData({
				user: JSON.parse(
					await DiscordDataContainer.readFile('account/user.json')
				),
			});
		};

		fetchData();
	}, [DiscordDataContainer, history]);
	console.log(data);
	return (
		<>
			<Grid centered columns={1}>
				<StyledCard>
					<Card.Content>
						<CardDescription>
							<Header as='h2'>
								<GrayText>
									Hey there {data.user.username}#
									{data.user.discriminator},
								</GrayText>
								<Divider />
							</Header>
							<b>account/user.json</b>
							<StyledList bulleted>
								<List.Item>
									You've joined{' '}
									<b>{data.user.guild_settings.length} </b>
									servers.
								</List.Item>
								<List.Item>
									You've received{' '}
									<b>
										{data.user.guild_settings.reduce(
											(prev, cur) =>
												prev +
												cur.message_notifications,
											0
										)}
									</b>{' '}
									message notifications.
									<StyledList bulleted>
										<List.Item>
											<i>
												Above most likely isn't
												accurate, it's just what the
												file says.
											</i>
										</List.Item>
									</StyledList>
								</List.Item>
								<List.Item>
									You've created{' '}
									<b>{Object.keys(data.user.notes).length}</b>{' '}
									user notes.{' '}
									<Modal
										trigger={
											<ModalText>View notes.</ModalText>
										}
										header='User Notes'
										content={
											<Grid centered>
												<StyledTable>
													<Table.Header>
														<Table.Row>
															<Table.HeaderCell>
																User ID
															</Table.HeaderCell>
															<Table.HeaderCell>
																Note
															</Table.HeaderCell>
														</Table.Row>
													</Table.Header>
													<Table.Body>
														{Object.keys(
															data.user.notes
														).map(id => (
															<Table.Row>
																<Table.Cell>
																	{id}
																</Table.Cell>
																<Table.Cell>
																	{
																		data
																			.user
																			.notes[
																			id
																		]
																	}
																</Table.Cell>
															</Table.Row>
														))}
													</Table.Body>
												</StyledTable>
											</Grid>
										}
										actions={[
											{
												key: 'close',
												content: 'Close',
												positive: true,
											},
										]}
									/>
								</List.Item>
								<List.Item>
									You've spent{' '}
									<b>
										{data.user.payments.reduce(
											(prev, cur) => prev + cur.amount,
											0
										) / 100}{' '}
										{data.user.payments[0]?.currency?.toUpperCase() ||
											''}
									</b>{' '}
									on Discord.{' '}
									<Modal
										trigger={
											<ModalText>
												View payments.
											</ModalText>
										}
										header='Payments'
										content={
											<Grid centered>
												<StyledTable>
													<Table.Header>
														<Table.Row>
															<Table.HeaderCell>
																Item
															</Table.HeaderCell>
															<Table.HeaderCell>
																Price
															</Table.HeaderCell>
															<Table.HeaderCell>
																Date
															</Table.HeaderCell>
														</Table.Row>
													</Table.Header>
													<Table.Body>
														{Object.values(
															data.user.payments
														).map(payment => (
															<Table.Row>
																<Table.Cell>
																	{
																		payment.description
																	}
																</Table.Cell>
																<Table.Cell>
																	{payment.amount /
																		100}{' '}
																	{payment.currency.toUpperCase()}
																</Table.Cell>
																<Table.Cell>
																	{
																		payment.created_at
																	}
																</Table.Cell>
															</Table.Row>
														))}
													</Table.Body>
												</StyledTable>
											</Grid>
										}
										actions={[
											{
												key: 'close',
												content: 'Close',
												positive: true,
											},
										]}
									/>
								</List.Item>
								<List.Item>
									You've had{' '}
									<b>
										{
											data.user
												.user_activity_application_statistics
												.length
										}
									</b>{' '}
									unique games/applications in your user
									status.{' '}
									<Modal
										trigger={
											<ModalText>
												View applications.
											</ModalText>
										}
										header='Applications'
										content={
											<Grid centered>
												<StyledTable>
													<Table.Header>
														<Table.Row>
															<Table.HeaderCell>
																Application ID
															</Table.HeaderCell>
															<Table.HeaderCell>
																Last Played
															</Table.HeaderCell>
															<Table.HeaderCell>
																Duration Played
															</Table.HeaderCell>
														</Table.Row>
													</Table.Header>
													<Table.Body>
														{Object.values(
															data.user
																.user_activity_application_statistics
														).map(application => (
															<Table.Row>
																<Table.Cell>
																	{
																		application.application_id
																	}
																</Table.Cell>
																<Table.Cell>
																	{
																		application.last_played_at
																	}
																</Table.Cell>
																<Table.Cell>
																	{
																		application.total_duration
																	}
																</Table.Cell>
															</Table.Row>
														))}
													</Table.Body>
												</StyledTable>
											</Grid>
										}
										actions={[
											{
												key: 'close',
												content: 'Close',
												positive: true,
											},
										]}
									/>
								</List.Item>
							</StyledList>
							<b>messages/</b>
						</CardDescription>
					</Card.Content>
				</StyledCard>
			</Grid>
		</>
	);
};

const StyledTable = styled(Table)`
	width: 90% !important;
	margin: 25px !important;
`;

const ModalText = styled.span`
	color: #4183c4;
	cursor: pointer;
	:hover {
		color: #0183c4;
	}
`;

const StyledList = styled(List)`
	*:before {
		color: #eeeeee !important;
	}
`;

const GrayText = styled.span`
	color: #eeeeee;
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
	width: 650px !important;
	min-width: max(40%, 300px) !important;
`;
