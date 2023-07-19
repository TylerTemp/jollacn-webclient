yarn build
ssh tyler@notexists.top 'mkdir -p release/jollacn-webclient'
scp -r build/* tyler@notexists.top:release/jollacn-webclient
