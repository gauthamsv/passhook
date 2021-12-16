Okta Password Import Inline Hook
This application provides an external service to receive requests from an Okta Passworrd Import Inline Hook, and checks the users's credentials against a simple data store. If the user's credentials are verified, the user password imports into the Okta org, and the Inline Hook no longer triggers on future access. If the user's credentials are not verified, the Inline Hook stays active and the password is not imported.

Your Project
On the front-end,

Edit views/index.html to change the content of the webpage
public/client.js is the javacript that runs when you load the webpage
public/style.css is the styles for views/index.html
Drag in assets, like images or music, to add them to your project
On the back-end,

your app starts at server.js
the data store and verification logic lies in users.js
add frameworks and packages in package.json
safely store app secrets in .env (nobody can see this but you and people you invite)
Click Show in the header to see your app live. Updates to your code will instantly deploy.

Made by Glitch
Glitch is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more about Glitch.

( ᵔ ᴥ ᵔ )