import React from 'dom-chef';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';

async function makeApiRequest(action: string, issueUrl: string): Promise<void> {
	try {
		// Extract issue/PR information from the URL
		const urlParts = issueUrl.split('/');
		const owner = urlParts[3];
		const repo = urlParts[4];
		const issueNumber = urlParts[6];
		const issueType = urlParts[5]; // 'issues' or 'pull'

		// Simple API request payload
		const payload = {
			action,
			owner,
			repo,
			issueNumber,
			issueType,
			timestamp: new Date().toISOString(),
		};

		// Make API request (replace with actual Devin API endpoint)
		const response = await fetch('https://api.devin.example.com/github-action', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Add authentication headers as needed
				// 'Authorization': 'Bearer YOUR_API_KEY',
			},
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			const result = await response.json();
			console.log(`${action} request successful:`, result);
			// Show success message
			alert(`${action} request sent successfully!`);
		} else {
			throw new Error(`API request failed: ${response.status}`);
		}
	} catch (error) {
		console.error(`${action} API request failed:`, error);
		// For now, show the payload in console for debugging
		console.log('Would send payload:', {
			action,
			issueUrl,
			timestamp: new Date().toISOString(),
		});
		alert(`${action} request initiated (check console for details)`);
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
					onClick={() => makeApiRequest('scope', currentUrl)}
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
					onClick={() => makeApiRequest('complete', currentUrl)}
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
