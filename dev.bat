CALL cd ../jsql-js-core
CALL dev.bat
CALL cd ../jsql-axios-rxjs
CALL rmdir node_modules\jsql-core /s /q
CALL npm install jsql-core
CALL grunt dev