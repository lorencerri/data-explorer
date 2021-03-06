/* eslint-disable no-param-reassign */
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router-dom';
import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';
import { parseCSV } from './Helpers';

const useDiscordData = () => {
	const history = useHistory();

	const [isValid, setIsValid] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(false);
	const [data, setData] = useState({ user: {}, messagesIndex: {} });
	const [errorMessage, setErrorMessage] = useState(false);

	const err = message => {
		setLoadingMessage(false);
		setErrorMessage(message);
	};

	const earliest = dates =>
		dates.reduce(
			(pre, cur) => (Date.parse(pre) > Date.parse(cur) ? cur : pre),
			new Date()
		);

	const readLineByLine = file =>
		new Promise(res => {
			if (!file) res({}); // Check if valid file

			// Set up incremental variables
			const dates = [];
			const eventCounts = {};
			const durationConnected = {};

			// Decode File
			const decoder = new DecodeUTF8();

			file.ondata = (_err, u8data, final) => {
				decoder.push(u8data, final);
			};

			let prevEnd = '';

			decoder.ondata = (str, final) => {
				const lines = str.split('\n');
				if (prevEnd.length > 0) {
					lines[0] = prevEnd + lines[0];
					prevEnd = '';
				}
				if (!lines[lines.length - 1].endsWith('}')) {
					prevEnd = lines[lines.length - 1];
					lines.pop();
				}
				for (let i = 0; i < lines.length; i += 1) {
					const line = JSON.parse(lines[i]);
					// if (i === 0) console.log(line);

					// Count Event Occurrences
					if (eventCounts[line.event_type] === undefined) {
						eventCounts[line.event_type] = 1;
					} else eventCounts[line.event_type] += 1;

					// Sums
					if (line.duration_connected) {
						console.log(line);
						dates.push(new Date(JSON.parse(line.timestamp)));
						if (!durationConnected[line.guild_id])
							durationConnected[line.guild_id] = parseInt(
								line.duration_connected
							);
						else
							durationConnected[line.guild_id] += parseInt(
								line.duration_connected
							);
					}
				}
				if (final) {
					res({
						eventCounts,
						durationConnected,
						earliestVCJoinDate: earliest(dates),
					});
				}
			};
			file.start();
		});

	const unzip = async Uint8Arr => {
		const files = [];
		const parsed = {
			user: {},
			messagesIndex: {},
			guildsIndex: {},
			channels: [],
		};

		const unzipper = new Unzip();
		unzipper.register(AsyncUnzipInflate);
		unzipper.onfile = f => files.push(f);

		for (let i = 0; i < Uint8Arr.length; i += 65536) {
			unzipper.push(Uint8Arr.subarray(i, i + 65536));
		}

		const getFile = name => files.find(file => file.name === name);
		const readFile = path =>
			new Promise(res => {
				const file = getFile(path);
				if (!file) return res(null);
				const fileContent = [];
				const decoder = new DecodeUTF8();
				file.ondata = (err, dat, final) => {
					if (err) err(`Reading ${path} failed.`);
					decoder.push(dat, final);
				};
				decoder.ondata = (str, final) => {
					fileContent.push(str);
					if (final) res(fileContent.join(''));
				};
				file.start();
			});

		setLoadingMessage('Reading account/user.json...');
		parsed.user = JSON.parse(await readFile('account/user.json'));
		if (!parsed.user) return err('account/user.json not found');

		setLoadingMessage('Reading messages/index.json...');
		parsed.messagesIndex = JSON.parse(
			await readFile('messages/index.json')
		);
		if (!parsed.messagesIndex) return err('messages/index.json not found');

		const messagesPathRegex = /messages\/c?([0-9]{16,32})\/$/;
		const channelsIDsFile = files.filter(file =>
			messagesPathRegex.test(file.name)
		);

		const pkgPrefix =
			channelsIDsFile[0].name.match(
				/messages\/(c)?([0-9]{16,32})\/$/
			)[1] === undefined
				? ''
				: 'c';
		const channelIDs = channelsIDsFile.map(
			file => file.name.match(messagesPathRegex)[1]
		);

		setLoadingMessage(`${channelIDs.length} channels found...`);

		let messagesRead = 0;

		await Promise.all(
			channelIDs.map(
				channelID =>
					new Promise(res => {
						Promise.all([
							readFile(
								`messages/${pkgPrefix}${channelID}/channel.json`
							),
							readFile(
								`messages/${pkgPrefix}${channelID}/messages.csv`
							),
						]).then(([rawData, rawMessages]) => {
							if (!rawData || !rawMessages) {
								setErrorMessage(
									`Failed to read channelID: ${channelID}...`
								);
								return res();
							}
							messagesRead += 1;

							const parsedData = JSON.parse(rawData);
							const parsedMessages = parseCSV(rawMessages);
							const name = parsed.messagesIndex[parsedData.id];
							const isDM = parsedData?.recipients?.length === 2;
							const dmUserID = isDM
								? parsedData.recipients.find(
										userID => userID === parsed.user.id
								  )
								: undefined;

							parsed.channels.push({
								parsedData,
								parsedMessages,
								name,
								isDM,
								dmUserID,
							});

							res();
						});
					})
			)
		);

		if (messagesRead === 0)
			return err('Your data package was missing messages!');

		setLoadingMessage('Loading channel stats...');

		parsed.channelCount = parsed.channels.filter(c => !c.isDM).length;
		parsed.dmChannelCount = parsed.channels.length - parsed.channelCount;
		parsed.characterCount = parsed.channels
			.map(c => c.parsedMessages)
			.flat()
			.map(m => m.length)
			.reduce((prev, cur) => prev + cur, 0);

		parsed.wordsCount = parsed.channels
			.map(c => c.parsedMessages)
			.flat()
			.reduce((prev, cur) => prev + cur.words.length, 0);

		setLoadingMessage('Loading servers/index.json...');
		parsed.guildsIndex = JSON.parse(await readFile('servers/index.json'));
		if (!parsed.guildsIndex) return err('servers/index.json not found');
		parsed.guildCount = Object.keys(parsed.guildsIndex).length;
		if (!parsed.guildCount) return err('Unable to count guilds ');
		const activityFile = files.find(file =>
			/activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(
				file.name
			)
		);

		if (!activityFile) return err('Unable to find activity file ');
		if (!activityFile.name)
			return err('Unable to find activity index file path');
		setLoadingMessage(`Loading ${activityFile.name}`);

		parsed.activity = await readLineByLine(activityFile);

		setData(parsed);
		setLoadingMessage(false);
		setIsValid(true);
		history.push('/discord/explore');
	};

	const upload = file => {
		setLoadingMessage('Unpacking .zip file...');
		const fr = new FileReader();
		fr.onloadend = () => {
			unzip(new Uint8Array(fr.result));
		};
		fr.readAsArrayBuffer(file[0]);
	};

	return { upload, isValid, data, loadingMessage, errorMessage };
};

export const DiscordData = createContainer(useDiscordData);
