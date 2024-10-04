import { getSummaries } from '$lib/serviceApi';
import type { InterviewSummary } from '$lib/stores/summaryStore.js';
import type { PageLoad } from './$types';

export const ssr = false; // Needs browser to send cookie for auth

export const load: PageLoad = async () => {
		const summariesResponse = await getSummaries();
    let summaries: InterviewSummary[] = [];

		if (summariesResponse) {
			summaries = summariesResponse?.map((summary: InterviewSummary) => {
				try {
					if (summary.summary_text) {
						let parts = JSON.parse(summary?.summary_text);
						return { ...summary, ...parts } as InterviewSummary;
					} else {
						return { ...summary } as InterviewSummary;
					}
				} catch (e) {
					console.log('model returned invalid json');
					return { ...summary } as InterviewSummary;
				}
			});
		}
	return {summaries};
};