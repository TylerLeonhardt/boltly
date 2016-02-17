babel src --out-dir build --copy-files --ignore 'node_modules/','src/bower_components/' &&
cp -r ./src/node_modules ./build/node_modules &&
cp -r ./src/bower_components ./build/bower_components &&
electron main.js
