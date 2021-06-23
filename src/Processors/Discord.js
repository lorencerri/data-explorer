/* eslint-disable no-param-reassign */
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router-dom';
import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';
import { snakeCase } from 'snake-case';
import eventsData from './events.json';
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

	const readAnalyticsFile = file =>
		new Promise(res => {
			if (!file) res({});
			const count = {};
			for (const eventName of eventsData.eventsEnabled)
				count[eventName] = 0;
			const decoder = new DecodeUTF8();
			file.ondata = (_err, line, final) => {
				decoder.push(line, final);
			};
			let prevChkEnd = '';
			decoder.ondata = (str, final) => {
				str = prevChkEnd + str;
				for (const event of Object.keys(count)) {
					const eventName = snakeCase(event);
					// eslint-disable-next-line no-constant-condition
					while (true) {
						const index = str.indexOf(eventName);
						if (index === -1) break;
						str = str.slice(index + eventName.length);
						count[event] += 1;
					}
					prevChkEnd = str.slice(-eventName.length);
				}
				if (final) {
					res(count);
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
				file.ondata = (_err, dat, final) => {
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

		const activityFile = files.find(file =>
			/activity\/analytics\/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json/.test(
				file.name
			)
		);

		setLoadingMessage(`Loading ${activityFile.name}`);
		parsed.activity = await readAnalyticsFile(activityFile);
		console.log(parsed);
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
