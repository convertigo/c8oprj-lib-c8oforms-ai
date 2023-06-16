const sample = {
	language: 'english',
	question: 'Tell me About you',
	name: 'Tell about you',
	backgroundColor: 'rgba(208,36,36,0.1)',
	thumbnailFromPexelsPrompt: 'smilling girl',
	description: 'Tell <u>more</u> about <b>YOU</b>',
	pages: [{
		name: 'General informations',
		description: '<b>General</b> informations',
		ionicIcon: 'information',
		iconFromIonicons: 'information',
		bannerFromPexelsPrompt: 'paper sheet with a pen',
		fields: [
			{
				name: 'fullname',
				description: "What's your <b>name</b>",
				type: 'text',
				placeholder: 'Enter your name'
			}, {
				name: 'face',
				description: 'Take a <i>picture</i> of <u>yourself</u>',
				type: 'camera',
			}, {
				name: 'age',
				description: 'How old are <b>you</b>?',
				min: 0,
				max: 130,
				step: 1,
				type: 'slider',
			}, {
				name: 'personnal',
				description: 'Next questions are more <b>personnal</b>.',
				type: 'description'
			}, {
				name: 'gender',
				description: 'What is your gender?',
				type: 'radio',
				values: ['male', 'female', 'non-binary']
			}, {
				name: 'animals',
				description: 'Do you have <b>animals</b> at home?',
				type: 'checkbox',
				values: ['dog', 'cat', 'fish', 'other']
			}, {
				name: 'address',
				description: 'Where do you live?',
				type: 'location',
			}
		],
	}, {
		name: 'Hobbies',
		description: 'About your <b>hobbies</b>',
		ionicIcon: 'musical-notes-outline',
		iconFromIonicons: 'musical-notes-outline',
		bannerFromPexelsPrompt: 'listen music at restaurant',
		fields: [
			{
				name: 'music',
				description: 'Do you listen <b>music</b>?',
				placeholder: 'Make a choice',
				type: 'select',
				values: ['Yes, a lot!', 'Not so much :(']
			}, {
				name: 'sports',
				description: 'Do you play <b>sports</b>?',
				type: 'radio_group',
				columns: ['leisure', 'professional'],
				rows: ['football', 'tennis', 'volleyball', 'swimming']
			}, {
				name: 'food',
				description: 'When do you eat this <b>food</b>?',
				type: 'checkbox_group',
				columns: ['week', 'week-end'],
				rows: ['noddle', 'rice', 'burger', 'pizza']
			}, {
				name: 'agree',
				description: '',
				type: 'checkbox',
				values: ['I agree to send <b>results</b>']
			}
		],
	}]
};