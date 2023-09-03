# Interview Coach User Interface

## Local Development
1. Add a .env.local file to the root of this project. It should look like the .env.example included but with your own keys.
2. run `npm install` and `npm run dev`
3. set up the [backend](https://github.com/dcaponi/QandAService)
4. run a local authenticator service instance
   1. cd into `./pocketbase` and run `docker compose up`
   2. follow configuration instructions for first time setup 
      1. [email/pass only](https://github.com/dcaponi/sveltekit-pocketbase-starter#%EF%B8%8F-emailpassword-flow-with-confirmation-email)
      2. [OAuth/Social Login](https://github.com/dcaponi/sveltekit-pocketbase-starter#-oauth-flow)
