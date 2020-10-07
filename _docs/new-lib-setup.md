## New lib setup
Generate new lib:

```bash
$ ng g library my-lib
```

### First steps after generating lib
- Go to `angular.json` and update selector prefix for library components, it defaults to 'lib'.

- Go to `package.json` (for my-lib) and update lib name and version (Add preffix for scoped packages for example).

- Building:
```bash
$ ng build my-lib
```

- While developing use the folloing command (so changes are reflected automatically - i.e. rebuilded): 
```bash
$ ng build my-lib --watch
```

### Updating TS paths
- Go to `tsconfig.json` (root) and update generated paths for the lib. By default it generated the following paths:
```json
"my-lib": [
  "dist/my-lib"
],
"my-lib/*": [
  "dist/my-lib/*"
]
```
However the generated paths seems to be unresolvable in some cases (even when adjusting TS `baseUrl`) and in my case I needed to change to the paths below in order to be able to import the lib module:
```json
"my-lib": [
  "../dist/my-lib"
],
"my-lib/*": [
  "../dist/my-lib/*"
]
```

These paths still point to the compiled version of the lib (dist), and even when building using `--watch` parameter we are still unable to serve the app that imports the lib and have the lib auto re-compiles simultaneously. 
In order to achieve that the following needs to be changed:
- Go to `projects/my-lib/src/lib/`, create `index.ts` file that exports all lib exports (begin with copying and adjusting `public-api.ts`). 

- Now update `public-api.ts` file so it exports all from the previously created `index.ts` (so we only need to keep `index.ts` file updated with new exports) file as follows:
```typescript
export * from './lib';
```

- Once `index.ts` file is created, update generated paths in `tsconfig.json` (root) to the following:
```json
"my-lib": [
  "../projects/my-lib/src/lib"
],
"my-lib/*": [
  "../projects/my-lib/src/lib/*"
]
```

This way we will mimick imports from the lib while developing, all by having auto reloading if code changes either in app or lib code. Also, nothing needs to be changed additionally once decided to publish the lib!
(In order to import lib code from `node_modules` (installed) while developing we just need to remove TS paths we created above).


### Development
- Go to generated lib component and update selector prefix, add HTML and SCSS files if needed and link them in the component.

- Go to `package.json` (for my-lib) and add missing peer dependencies (if any new added during development).

- Go to my-library module and import Angular Common module and other Angular modules used in the lib code. (NOT NEEDED!?)


### Publishing
- Update `package.json` of the lib with addl info like "license", "description", etc.

- Increment version of the lib in the `package.json`

- Build lib:
```bash
$ ng build code-show --prod
```

- Go to `dist/my-lib` and run:
```bash
$ npm publish --access=public
```


### Additional info
For additional info visit: 
https://angular.io/guide/creating-libraries
https://medium.com/@esanjiv/complete-beginner-guide-to-publish-an-angular-library-to-npm-d42343801660