ionic cordova build android --prod --release
echo 'Removing Walton-86.apk...'
rm ./release-builds/android/Walton-86.apk
echo 'Removing Walton-arm.apk...'
rm ./release-builds/android/Walton-arm.apk
echo 'Removing android-armv7-release-unsigned...'
rm android-armv7-release-unsigned.apk
echo 'Removing android-x86-release-unsigned...'
rm android-x86-release-unsigned.apk
echo 'Removed!'
echo 'Copying unsigned apk...'
cp ./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk android-x86-release-unsigned.apk
echo 'Copied!'
echo 'Signing APK...'
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-x86-release-unsigned.apk alias_name
echo 'zipalign apk'
zipalign -v 4 android-x86-release-unsigned.apk Walton-x86.apk
echo 'FINISHED!'
echo 'Copying unsigned apk...'
cp ./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk android-armv7-release-unsigned.apk
echo 'Copied!'
echo 'Signing APK...'
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-armv7-release-unsigned.apk alias_name
echo 'zipalign apk'
zipalign -v 4 android-armv7-release-unsigned.apk Walton-arm.apk
mkdir ./release-builds/android/
mv Walton-arm.apk ./release-builds/android/
mv Walton-x86.apk ./release-builds/android/
echo 'FINISHED!'
