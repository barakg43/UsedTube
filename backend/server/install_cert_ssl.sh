apt-get update -y
apt-get install wget libnss3-tools -y
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
mv mkcert-v1.4.3-linux-amd64 /usr/bin/mkcert
chmod +x /usr/bin/mkcert
mkcert -install
cd ssl
mkcert -cert-file cert.pem -key-file key.pem 10.10.40.180 localhost 127.0.0.1 ::1