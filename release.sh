yarn build
ssh notexists.top 'mkdir -p release/jollacn-webclient'
scp -r build/* notexists.top:release/jollacn-webclient
