# Broken access control

[**Broken access control**](https://owasp.org/Top10/A01_2021-Broken_Access_Control/) is basically when an attacker is able to take an action that they don't have the permissions to do, e.g. accessing admin privileges from a regular user account. The example in this directory is called [**cross-site request forgery**](https://portswigger.net/web-security/csrf) (CSRF). This is a vulnerability that lets an attacker trick an authenticated user into performing an action.

1. In a terminal window, run `npm install`.
2. In the same terminal window, run `npm run dev`.
3. In a **different** terminal window, run `npm run csrf`.

At http://localhost:3000, you should see an application with a login form. You can log in with `kieran.barker@multiverse.io` and `opensesame`. You have the ability to change the email address to something else; give it a go to verify that it works.

This exploit does require some social engineering. But imagine an attacker sent the user a link as follows, in classic spammy style: [you've won a £500 Amazon gift card](http://localhost:3001)! If you click on it, your email address will be changed to get@rekt.com. Now the attacker would be able to reset your password and completely take over your account. 😱

This works because the server is only checking that the current server-side session ID is equal to to the session ID cookie that the browser sends with its request. Because the attacker's form posts directly to the `/email/change` endpoint, if the user is already logged into that website, their browser will automatically send the session ID cookie along, effectively allowing the attacker to hijack it.

To fix this, we should add a CSRF token **and** enforce [`SameSite` cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).
