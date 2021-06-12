---
title: 'HTB: Curling'
date: '2020-11-22 02:45:00 -0400'
categories:
  - HackTheBox
  - Write-ups
tags:
  - HTB
  - Cewl
  - Joomla
published: true
---

IP: 10.10.10.150

We'll start off with an Nmap scan.

![96a1876ef9519f700e813372461f4f06.png](./../../assets/img/96a1876ef9519f700e813372461f4f06.png)

There is a custom site running on port 80.

![fa3e418c601b3598b8dd09f595608086.png](./../../assets/img/fa3e418c601b3598b8dd09f595608086.png)

The mention of “Cewl” in the page name might be a hint about using Cewl to generate a worldlist for a dictionary attack. Page source shows that this is Joomla.

![33b6f8a74c0d2694ec61d377215338da.png](./../../assets/img/33b6f8a74c0d2694ec61d377215338da.png)

We can run `joomscan -h http://10.10.10.150:80/` to enumerate the page.

![fb2b36953e263c45b70ba65cb369bb05.png](./../../assets/img/fb2b36953e263c45b70ba65cb369bb05.png)

There is an LFI CVE for this version of Joomla, but no public exploit or documentation about how it works. The page source contains a comment about secret.txt.

![b99bd22d1b67e0ad1858a937794704f8.png](./../../assets/img/b99bd22d1b67e0ad1858a937794704f8.png)

This password is “Curling2018!” in Base64.

![c4ae422238cdf71bdad3d1515f4e7bb6.png](./../../assets/img/c4ae422238cdf71bdad3d1515f4e7bb6.png)

Looking at the post from Floris, this looks like their password.

![67a8fcc629e96c7776863a005d7e35ce.png](./../../assets/img/67a8fcc629e96c7776863a005d7e35ce.png)

We're able to login as `Floris:Curling2018!`

![2d04d9804d8feff0551650854f149f56.png](./../../assets/img/2d04d9804d8feff0551650854f149f56.png)

Since this is the Super User, we'll see if we can login to the admin portal.

![333027f8b9c35726211ba0ab5ba65f72.png](./../../assets/img/333027f8b9c35726211ba0ab5ba65f72.png) 

Go to Extensions > templates > templates.

![034ac00cea8cf01208f01b1ee8c92a86.png](./../../assets/img/034ac00cea8cf01208f01b1ee8c92a86.png)

Click on Breez3.

![1602c9f5bc682a8d99fd2b3b3a4789f5.png](./../../assets/img/1602c9f5bc682a8d99fd2b3b3a4789f5.png)

Copy and edit php-reverse-shell.php.

![a15caa890c6844b42ba5d67a6743d9d7.png](./../../assets/img/a15caa890c6844b42ba5d67a6743d9d7.png)

Click on index.php and paste the revshell.php contents.

![ac560ba2cecaaca2e37ff9556fef6a56.png](./../../assets/img/ac560ba2cecaaca2e37ff9556fef6a56.png)

Click save.

![cc6706ad681db3951d6c59ece211d42c.png](./../../assets/img/cc6706ad681db3951d6c59ece211d42c.png)

Start a NC listener with `nc -lvp 443` and then click Template Preview.

![52059c3edbedaec692b89b49d90d50de.png](./../../assets/img/52059c3edbedaec692b89b49d90d50de.png)
![dd4b1147ea813e35e614896d36d433f4.png](./../../assets/img/dd4b1147ea813e35e614896d36d433f4.png)

Break out with Python3.

![05910fd28ed356116eec739b06e7d200.png](./../../assets/img/05910fd28ed356116eec739b06e7d200.png)

We can't access the user flag, but we can access a password_backup file in /home/floris.

![6cb0904f2b55bc4b3ec666f5d5114a85.png](./../../assets/img/6cb0904f2b55bc4b3ec666f5d5114a85.png)

We should be able to reverse this is `xxd -r`

![734a45209e064e9423b901d8c8da9256.png](./../../assets/img/734a45209e064e9423b901d8c8da9256.png)

This seems to be layered compression. To clean things up, we'll start over from the hex file.

![00c247fcbd8a1a9637f7eb50aa4402e0.png](./../../assets/img/00c247fcbd8a1a9637f7eb50aa4402e0.png)

Using this password we can change over to Floris.

![521dfb90d1b4d9786dfe42daf9957ad9.png](./../../assets/img/521dfb90d1b4d9786dfe42daf9957ad9.png)

For a cleaner shell, we'll SSH into the box with this account.

![1736bbc694ba9f2ea8512a28679b6337.png](./../../assets/img/1736bbc694ba9f2ea8512a28679b6337.png)

Grab the user flag.

![e189a8367fd686e52ac50d9b67d6ae40.png](./../../assets/img/e189a8367fd686e52ac50d9b67d6ae40.png)

After some digging it looks like input and report in the admin-area directory are being updated every minute or so.

![daf82d6618fd2fb753e271e0d851e539.png](./../../assets/img/daf82d6618fd2fb753e271e0d851e539.png)

The input file appears to take a URL, and the output seems to be the result of that. To see how this is being called, we'll update the URL to `url = “file:///var/spool/cron/crontabs/root”` to print the root cron entries.

![b1280ec463a15fff67cbaa23f9056329.png](./../../assets/img/b1280ec463a15fff67cbaa23f9056329.png)

We can see that this is based on Curl, which makes sense given the box name. If we look at the man page for curl with man curl we can see the `-K` flag can take a few options.

![daaebf008c5127597b246396c39fcca4.png](./../../assets/img/daaebf008c5127597b246396c39fcca4.png)

If we add an output argument to the input file, we should be able to change where the results are written.

![4fe70d5123f78367f158ca62f5607099.png](./../../assets/img/4fe70d5123f78367f158ca62f5607099.png)

After a minute, it looks like it worked.

![b569f0fd03299c1006c8de77813065a2.png](./../../assets/img/b569f0fd03299c1006c8de77813065a2.png)

Instead of just having it grab the root flag, we want to gain a root shell. We could add Floris to sudoers, but that would potentially alter things for other people using the box. A different option would be to add a new user to /etc/passwd that has root privileges.

![2ea1f9eee51f19b91baee02290e50e03.png](./../../assets/img/2ea1f9eee51f19b91baee02290e50e03.png)

Now we'll use OpenSSL to generate a password hash.

![8f4a5f9f563d7f6aa169b019651306dc.png](./../../assets/img/8f4a5f9f563d7f6aa169b019651306dc.png)
![6a671a78b13d1e6db8968b246d156e6c.png](./../../assets/img/6a671a78b13d1e6db8968b246d156e6c.png)

Host them with `python -m SimpleHTTPServer 80`

![b0acfa05f38e70f1e85469d689114f7a.png](./../../assets/img/b0acfa05f38e70f1e85469d689114f7a.png)

Now update the input file to download passwd and save it over the real one.

![ac34a6cef3ad664f041c40323d278a03.png](./../../assets/img/ac34a6cef3ad664f041c40323d278a03.png)
![89d73333dfaad1091b0d91cf812dc19d.png](./../../assets/img/89d73333dfaad1091b0d91cf812dc19d.png)
![4b4a3076afb2a739eb4621348a8bdf4a.png](./../../assets/img/4b4a3076afb2a739eb4621348a8bdf4a.png)

Now we can open a root shell.

![48358897349c3837a38cce78af997821.png](./../../assets/img/48358897349c3837a38cce78af997821.png)

