## New lib setup
Generate new lib:

```bash
$ ng g library my-library-name
```

### First steps
- Go to `angular.json` and update selector prefix for library components, it defaults to 'lib'.
- Go to `package.json` and update name and version (Add preffix for scoped packages for example).
- Go to generated started component and update selector prefix, add HTML and SCSS files if needed.
- ...


