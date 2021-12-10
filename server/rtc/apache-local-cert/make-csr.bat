
echo You need to have installed openSSL or install XAMP and find it.

openssl x509 -x509toreq -in server.crt -out server.csr -signkey server.key

pause
