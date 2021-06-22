import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useDiscordData = (initialState = []) => {
	const [state, setState] = useState(initialState);

	const upload = file => {
		console.log(file);
	};

	return { state, upload };
};

export const DiscordData = createContainer(useDiscordData);
