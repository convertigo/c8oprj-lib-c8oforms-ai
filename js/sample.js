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
				name: 'identity_row',
				type: 'layout',
				cols: [
					{ size: 6 },
					{ size: 6 },
					{ size: 0 },
					{ size: 0 },
					{ size: 0 },
					{ size: 0 }
				],
				children: [
					{
						name: 'firstname',
						description: "What's your <b>first name</b>",
						type: 'text',
						placeholder: 'First name'
					},
					{
						name: 'lastname',
						description: "What's your <b>last name</b>",
						type: 'text',
						placeholder: 'Last name'
					}
				]
			},
			{
				name: 'photo',
				description: 'Take a <i>picture</i> of <u>yourself</u>',
				type: 'img'
			},
			{
				name: 'age',
				description: 'How old are <b>you</b>?',
				min: 0,
				max: 130,
				step: 1,
				type: 'slider'
			},
			{
				name: 'birthdate',
				description: 'When were you <b>born</b>?',
				type: 'datetime'
			},
			{
				name: 'meeting_time',
				description: 'Preferred <b>meeting time</b>?',
				type: 'time'
			},
			{
				name: 'personnal',
				description: 'Next questions are more <b>personnal</b>.',
				type: 'description'
			},
			{
				name: 'gender',
				description: 'What is your gender?',
				type: 'radio',
				values: ['male', 'female', 'non-binary']
			},
			{
				name: 'animals',
				description: 'Do you have <b>animals</b> at home?',
				type: 'checkbox',
				values: ['dog', 'cat', 'fish', 'other']
			},
			{
				name: 'address',
				description: 'Where do you live?',
				type: 'location'
			},
			{
				name: 'submit_request',
				type: 'button',
				flow: 'flow_submit_request',
				config: { label: 'Submit request' }
			}
		]
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
				name: 'equipment',
				description: 'List your <b>equipment</b>',
				type: 'grid',
				columns: [
					{ name: 'Item', type: 'text' },
					{ name: 'Qty', type: 'number' }
				]
			}, {
				name: 'favorite_chart',
				description: 'A simple <b>chart</b>',
				type: 'chart'
			}, {
				name: 'meetup_map',
				description: 'Meeting <b>point</b>',
				type: 'map'
			}, {
				name: 'barcode_id',
				description: 'Scan your <b>badge</b>',
				type: 'barcode'
			}, {
				name: 'resume',
				description: 'Upload your <b>CV</b>',
				type: 'file'
			}
		]
	}],
	flows: [
		{
			id: 'formulas',
			elements: [
				{
					name: 'full_name',
					type: 'business_logic',
					expression: 'fields.firstname + " " + fields.lastname'
				},
				{
					name: 'warn_toto',
					type: 'business_logic',
					expression: '(async () => { if ((fields.firstname ?? "").toString().trim() === "toto") { await page.executeFlow({flow:"flow_toast_toto"}, false); } return null; })()'
				}
			]
		},
		{
			id: 'flow_toast_toto',
			name: 'Toast when toto',
			elements: [
				{ type: 'toast', message: 'Name cannot be "toto".' }
			]
		},
		{
			id: 'flow_submit_request',
			name: 'After submit',
			elements: [
				{ type: 'submit' },
				{ type: 'toast', message: 'Thanks!' }
			]
		}
	]
};
