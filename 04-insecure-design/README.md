# Insecure design

**Insecure design** is basically where, _regardless_ of how well the system is implemented in code, it is still vulnerable because the design is fundamentally flawed. In this example, we're _forcing_ the user to create a password that meets the following criteria:

-   Min. 5 characters
-   Max. 8 characters
-   1+ uppercase letters
-   1+ lowercase letters
-   1+ numbers
-   1+ "special" characters

As the [famous XKCD comic](https://xkcd.com/936/) says:

> Through 20 years of effort, we've successfully trained everyone to use passwords that are hard for humans to remember, but easy for computers to guess.

![A comic shows that four random words actually have more entropy than a seemingly random string of letters, numbers, and symbols.](https://imgs.xkcd.com/comics/password_strength.png)

Basically, although a **truly random** 8-character string is more secure than a string of 4 **truly random** words, this isn't true in practice. Not only do people not make **truly random** strings (unless they use a password manager), they also tend to stick complex passwords on post-it notes. The complex format also establishes a _pattern_, where people might just keep incrementing the number at the end of their password, for example.

For more on this, there's a great [explanation of the XKCD comic](https://www.explainxkcd.com/wiki/index.php/936:_Password_Strength). There's also a fun [video from The Modern Rogue](https://www.youtube.com/watch?v=NlJjY9rCYzM).
