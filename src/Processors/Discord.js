import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { useHistory } from 'react-router-dom';
import { Unzip, AsyncUnzipInflate, DecodeUTF8 } from 'fflate';

const useDiscordData = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (files.length) {
			setLoading(false);
			history.push('/discord/explore');
		}
	}, [files, history]);

	const getFile = name => files.find(file => file.name === name);

	const readFile = path =>
		new Promise(resolve => {
			const file = getFile(path);
			if (!file) return resolve(null);
			const fileContent = [];
			const decoder = new DecodeUTF8();
			file.ondata = (_err, data, final) => {
				decoder.push(data, final);
			};
			decoder.ondata = (str, final) => {
				fileContent.push(str);
				if (final) resolve(fileContent.join(''));
			};
			file.start();
		});

	const unzip = U8 => {
		const unzipper = new Unzip();
		const unzippedFiles = [];
		unzipper.register(AsyncUnzipInflate);
		unzipper.onfile = f => {
			unzippedFiles.push(f);
		};
		for (let i = 0; i < U8.length; i += 65536) {
			unzipper.push(U8.subarray(i, i + 65536));
		}
		setFiles(unzippedFiles);
	};

	const upload = file => {
		setLoading(true);
		const fr = new FileReader();
		fr.onloadend = () => {
			unzip(new Uint8Array(fr.result));
		};
		fr.readAsArrayBuffer(file[0]);
	};

	return {
		upload,
		loading,
		files,
		readFile,
	};
};

export const DiscordData = createContainer(useDiscordData);
