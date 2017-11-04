ionic-app-scripts build --prod
cp ./electron-prod.js www/electron.js
cp ./package.json www/package.json
cp ./resources/icon.icns www/icon.icns
cd www
npm run package-mac
npm run package-win
npm run package-linux
cd ../release-builds
tar -zcvf Pepper-Darwin-x64.tar.gz Pepper-darwin-x64/
zip -r Pepper-win32-ia32.zip Pepper-win32-ia32/
tar -zcvf Pepper-linux-x64.tar.gz Pepper-linux-x64/
