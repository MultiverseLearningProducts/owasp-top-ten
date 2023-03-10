# Injection

**Injection** is basically when you're not validating/filtering/sanitizing user-supplied or third party data. It's a vulnerability that lets an attacker execute arbitrary code. We're going to look at **cross-site scripting** (XSS) and **SQL injection**.

## XSS

Try submitting the following message:

```html
<img
	src="x"
	onerror="window.addEventListener(''keyup'', (e) => console.log(e.key))"
/>
```

Because we're not _escaping_ the output, an HTML image element gets displayed on the page. It has an invalid `src`, so it fires an `error` event that we can hook into. We've basically created a [keylogger](https://en.wikipedia.org/wiki/Keystroke_logging). We're just logging whatever the user types to the console, but we could also...

1. Send the keystrokes to a remote server.
2. Redirect the user to a website that looks identical, i.e. [phishing](https://en.wikipedia.org/wiki/Phishing).
3. Send requests on the user's behalf, making use of their session ID.
4. Do anything else you can think of!

In our application, we can fix this by setting the `autoescape` property to `true` in our Nunjucks config:

```js
nunjucks.configure("views", {
	autoescape: true, // make sure this is true
	express: app,
});
```

If you reload the page, you should see that the image is displayed as plaintext rather than interpreted as HTML.

## SQL injection

Try submitting the following message:

```
pwnd'); DROP TABLE messages; --
```

The result is that the `messages` table gets dropped!

Take a look at the route in `index.js`:

```js
app.post("/create", (req, res, next) => {
	db.exec(
		`INSERT INTO messages VALUES (null, '${req.body.value}')`,
		(err) => {
			if (err) {
				next(err);
			} else {
				res.redirect("/");
			}
		}
	);
});
```

We're directly inserting whatever the user typed straight into our query, blindly trusting it. So if they insert a genuine message, this is the SQL statement that runs:

```sql
INSERT INTO messages VALUES (null, 'hello');
```

But this is what the malicious message ends up doing:

```sql
INSERT INTO messages VALUES (null, 'pwnd'); DROP TABLE messages; --');
```

It inserts a real message, but then it executes _another_ statement to drop the `messages` table. The final part of the original statement is commented out.

To show how to fix this, you'll need to recreate the database first. Run `sqlite3 db.sqlite` in your terminal to access the database via the CLI. Then run the following:

```sql
CREATE TABLE messages (id INTEGER PRIMARY KEY, value TEXT NOT NULL);
```

Type `.exit` to exit the CLI. To fix the SQL injection vulnerability, we need to use a _prepared statement_. Let's update the route:

```js
const insert = db.prepare("INSERT INTO messages VALUES (null, ?)");
app.post("/create", (req, res, next) => {
	insert.run(req.body.value, (err) => {
		if (err) {
			next(err);
		} else {
			res.redirect("/");
		}
	});
});
```

Try submitting the malicious message again, and you'll see that it doesn't work anymore.
