yarn build
cp public/favicon.ico build
ssh notexists.top 'mkdir release/jollacn-webclient'
scp -r build/* notexists.top:release/jollacn-webclient
