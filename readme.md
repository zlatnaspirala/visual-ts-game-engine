#To make all dependency works in build proccess we need some plugins.

<code>
npm install
</code>
...

npm install typescript
npm i clean-webpack-plugin --save-dev
npm i html-webpack-plugin --save-dev

#Possible fix : 

<code>
npm i webpack --save-dev
npm i extract-text-webpack-plugin --save-dev
</code>

#Fix code format : 

tslint -c tslint.json 'src/**/*.ts' --fix
