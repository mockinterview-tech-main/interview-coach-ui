// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type SupabaseClient = import('@supabase/supabase-js').SupabaseClient;
		type Session = import('@supabase/supabase-js').Session;
		interface Locals {
			supabase: SupabaseClient;
			getSession: () => Promise<Session | null>;
		}
		interface Window {
			SpeechRecognition: any;
			SpeechGrammarList: any;
			SpeechRecognitionEvent: any;
		}
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
