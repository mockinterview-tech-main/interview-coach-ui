// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type PocketBase = import('pocketbase').default;
		interface Locals {
			pb?: PocketBase;
		}
		interface Window {
			SpeechRecognition: any;
			SpeechGrammarList: any;
			SpeechRecognitionEvent: any;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
