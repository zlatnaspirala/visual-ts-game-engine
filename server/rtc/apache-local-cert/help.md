
## Easy generate certification (crt and key) with XAMPP Apache (on windows)

Find yout XAMPP folder:
```
C:\xampp\apache
```

Just run `makecert.bat`

If everything is fine copy files :

From `C:\xampp\apache\conf\ssl.crt\server.crt` to `project\visual-ts\server\rtc\apache-local-cert`
From `C:\xampp\apache\conf\ssl.key\server.key` to `project\visual-ts\server\rtc\apache-local-cert`

Install it:
![install cert](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/nonproject-files/cert-install-win.png)


Must be placed or copied intro:
![install cert](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/nonproject-files/certmgr-mmc.png)

Now you have CRT and KEY File, run: `make-csr.bat` to generate CSR File.

Restart XAMPP Apache also clear cache from browser.
