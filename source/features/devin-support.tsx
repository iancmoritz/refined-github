import React from 'dom-chef';
import * as pageDetect from 'github-url-detection';

import features from '../feature-manager.js';
import observe from '../helpers/selector-observer.js';

async function addSidebarButton(reviewersSection: Element): Promise<void> {
	// Create a container for the button
	const buttonContainer = (
		<div className="discussion-sidebar-item">
			<button
				type="button"
				className="btn btn-block mt-2"
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span className="mr-2">New Button</span>
			</button>
		</div>
	);

	// Add the button after the Reviewers section
	reviewersSection.after(buttonContainer);
}

function init(signal: AbortSignal): void {
	// Look for the Reviewers section and add the button below it
	observe('[aria-label="Select reviewers"]', addSidebarButton, {signal});
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
