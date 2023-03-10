# Cryptographic failures

**Cryptographic failures** basically means anything related to cryptography that you might screw up, such as storing passwords in plaintext. In this directory, we have a password hashed with the [MD5 algorithm](https://en.wikipedia.org/wiki/MD5) and stored in a database. Once popular for password hashing, it is now known to have extensive vulnerabilities and is no longer suitable. Additionally, we aren't using a [salt](https://mv-swe.netlify.app/notes/module-2/basic-auth.html#hashing-alone-isn-t-enough), which is another cryptographic failure.

Make sure you have [SQLite](https://www.sqlite.org/index.html) installed. From this directory, run `sqlite3 db.sqlite` to access the database via the CLI. Run `SELECT hash FROM Users WHERE id = 1;` to grab the hashed password. We're going to use a tool called [hashcat](https://hashcat.net/hashcat/) to crack it.

1. `docker pull kalilinux/kali-rolling`
2. `docker run -it kalilinux/kali-rolling`
3. `cd /root`
4. `apt update && apt -y install hashcat wordlists`
5. `echo -n "e6078b9b1aac915d11b9fd59791030bf" > md5.txt`
6. `hashcat -m 0 -a 0 md5.txt /usr/share/wordlists/rockyou.txt.gz`

You should see some output like the following. It will show you the plaintext for the hash:

```
Host memory required for this attack: 2 MB

Dictionary cache building /usr/share/wordlists/rockyou.txt.gz: 33553434 bytes (6Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt.gz
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 2 secs

e6078b9b1aac915d11b9fd59791030bf:opensesame
```

For more, see [How to Crack Hashes with Hashcat — a Practical Pentesting Guide](https://www.freecodecamp.org/news/hacking-with-hashcat-a-practical-guide/).
