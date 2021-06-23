import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router-dom';
import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';
import { useToasts } from 'react-toast-notifications';

const useDiscordData = () => {
	const history = useHistory();
	const { addToast } = useToasts();

	const [isValid, setIsValid] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(false);
	const [data, setData] = useState({ user: {}, messagesIndex: {} });

	const unzip = async U8 => {
		const files = [];

		const err = message =>
			addToast(
				`Error: ${message}. Please ensure you're uploading the correct .zip file and try again.`,
				{
					appearance: 'error',
				}
			);

		const getFile = name => files.find(file => file.name === name);
		const readFile = path =>
			new Promise(resolve => {
				setLoadingMessage(`Reading ${path}...`);
				const file = getFile(path);
				if (!file) return resolve(null);
				const fileContent = [];
				const decoder = new DecodeUTF8();
				file.ondata = (_err, dat, final) => {
					decoder.push(dat, final);
				};
				decoder.ondata = (str, final) => {
					fileContent.push(str);
					if (final) resolve(fileContent.join(''));
				};
				file.start();
			});

		const unzipper = new Unzip();
		unzipper.register(AsyncUnzipInflate);
		unzipper.onfile = f => files.push(f);

		for (let i = 0; i < U8.length; i += 65536) {
			unzipper.push(U8.subarray(i, i + 65536));
		}

		const user = JSON.parse(await readFile('account/user.json'));
		if (!user) return err('account/user.json not found');
		const messagesIndex = JSON.parse(await readFile('messages/index.json'));
		if (!messagesIndex) return err('messages/index.json not found');

		setData({ messagesIndex, user });

		setLoadingMessage(false);
		setIsValid(true);
		history.push('/discord/explore');
	};

	const upload = file => {
		setLoadingMessage('Starting script...');
		const fr = new FileReader();
		fr.onloadend = () => {
			unzip(new Uint8Array(fr.result));
		};
		fr.readAsArrayBuffer(file[0]);
	};

	return {
		upload,
		isValid,
		data,
		loadingMessage,
	};
};

export const DiscordData = createContainer(useDiscordData);
