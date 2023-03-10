# Security misconfiguration

**Security misconfiguration** is basically when something is misconfigured and this exposes a vulnerability. In this example, we've got two scripts in our `package.json` file: `dev` and `start`. The `dev` script displays detailed stack traces while the `start` script does not. Try running both.

There is no `messages` table, so the app throws an error. If we used the wrong script in production&mdash;`dev` instead of `start`&mdash;we could be revealing sensitive information that we wouldn't want an attacker to see!

```
Error: SQLITE_ERROR: no such table: messages
--> in Database#all('SELECT * FROM messages', [], [Function (anonymous)])
    at /home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/index.js:26:5
    at Layer.handle [as handle_request] (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/route.js:144:13)
    at Route.dispatch (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/route.js:114:3)
    at Layer.handle [as handle_request] (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/layer.js:95:5)
    at /home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/index.js:346:12)
    at next (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/express/lib/router/index.js:280:10)
    at urlencodedParser (/home/kieran/student-beans/01-owasp-top-ten/05-security-misconfiguration/node_modules/body-parser/lib/types/urlencoded.js:91:7)
```

They can see the name of the table and also the names of some of the packages we're using. If any of these has a known vulnerability, the attacker could use that to get into our system.
