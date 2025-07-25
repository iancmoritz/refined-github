import React from 'dom-chef';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';

async function makeApiRequest(action: string, _issueUrl: string): Promise<void> {
	try {
		const response = await chrome.runtime.sendMessage({
			type: 'API_REQUEST',
			payload: {
				pokemon: action.toLowerCase(), // e.g., "pikachu"
			}
		});

		if (response.success) {
			console.log(`Pokémon data:`, response.result);
			alert(`Fetched ${response.result.name}! Base XP: ${response.result.base_experience}`);
		} else {
			throw new Error(response.error || 'Unknown error');
		}
	} catch (error) {
		console.error(`Error fetching Pokémon data:`, error);
		alert(`Error fetching Pokémon info. Check console.`);
	}
}


async function addSidebarButton(reviewersSection: Element): Promise<void> {
	// Get the current issue/PR URL
	const currentUrl = globalThis.location.href;

	// Create a container with both buttons horizontally inline
	const buttonsContainer = (
		<div className="discussion-sidebar-item">
			<div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
				<button
					type="button"
					className="btn btn-sm"
					style={{
						flex: '1',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#0969da',
						color: 'white',
						border: '1px solid #0969da',
						gap: '6px',
					}}
					onClick={() => makeApiRequest('pikachu', currentUrl)}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2L8 6h8l-4-4zM6 8v8l4-4-4-4zm12 0l-4 4 4 4V8zM8 18h8l-4 4-4-4z" />
					</svg>
					<span>Scope with Devin</span>
				</button>
				<button
					type="button"
					className="btn btn-sm"
					style={{
						flex: '1',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#0969da',
						color: 'white',
						border: '1px solid #0969da',
						gap: '6px',
					}}
					onClick={() => makeApiRequest('charizard', currentUrl)}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2L8 6h8l-4-4zM6 8v8l4-4-4-4zm12 0l-4 4 4 4V8zM8 18h8l-4 4-4-4z" />
					</svg>
					<span>Complete with Devin</span>
				</button>
			</div>
		</div>
	);

	// Add the buttons container after the Reviewers section
	reviewersSection.after(buttonsContainer);
}

function init(signal: AbortSignal): void {
	// Look for the Open Tag section and add the button below it
	observe('[class^="HeaderMetadata-module__metadataContent"]', addSidebarButton, {signal});
}

void features.add(import.meta.url, {
	include: [
		pageDetect.isIssue,
		pageDetect.isPR,
	],
	awaitDomReady: true,
	init,
});

/*
Test URLs:
- Issue: https://github.com/refined-github/sandbox/issues/3
- PR: https://github.com/refined-github/sandbox/pull/4
*/
