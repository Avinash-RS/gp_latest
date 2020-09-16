
echo Installing NPM modules
npm install --exact

echo Building for $2 environment
ng build --configuration=$2 --aot=false --build-optimizer=false

echo Moving .htaccess
cp .htaccess dist/GP/

echo Done Building application for $2 environment!!!

if [ $1 = remote ]
 then
 # echo Moving build to the destination folder /var/www/html
 rm -rfv /var/www/html/
 mv dist/GP/* /var/www/html/
 echo Moving completed!!!
fi
