import Papa from 'papaparse';

export const getCreatedTimestamp = id => {
	const EPOCH = 1420070400000;
	return id / 4194304 + EPOCH;
};

export const perDay = (value, userID) =>
	parseInt(
		value /
			((Date.now() - getCreatedTimestamp(userID)) / 24 / 60 / 60 / 1000)
	);

export const parseCSV = input =>
	Papa.parse(input, {
		header: true,
		newline: ',\r',
	})
		.data.filter(m => m.Contents)
		.map(m => ({
			id: m.ID,
			timestamp: m.Timestamp,
			length: m.Contents.length,
			words: m.Contents.split(' '),
			// content: m.Contents,
			// attachments: m.Attachments
		}));
