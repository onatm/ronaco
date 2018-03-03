# ronaco

`Monaco Editor` for `React` with `typescript` type definitions.

## Getting started

Install `ronaco` using npm.

```bash
npm install --save git://github.com/onatm/ronaco.git
```

Add `copy-webpack-plugin` to your webpack.config.js:

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
      }
    ])
  ]
};
```

Import `MonacoEditor` from the library:

```javascript
import { MonacoEditor } from 'ronaco/dist';
```

## Documentation

### Prop Types

| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| language | `"typescript"`, `"javascript"` |  | Editor language; defaults to `"javascript"` |
| theme | `"vs"`, `"vs-dark"`, `"hc-black"` |  | Editor theme; defaults to `"vs"` |
| width | String |  | Editor width; defaults to `"100%"` |
| height | String |  | Editor height; defaults to `"100%"` |
| value | String |  | Initial editor model content; defaults to `undefined` |
| onChange | Function |  | `onChange` handler for editor model content; defaults to `{ }` |

### Example

```javascript
import * as React from 'react';
import { MonacoEditor } from 'ronaco/dist';

export default class App extends React.Component {
  render() {
    return <MonacoEditor language="typescript" />;
  }
}
```

## Credits

This library builds on the work of [Leon Shi](https://github.com/superRaytin)'s excellent [`react-monaco-editor`](https://github.com/superRaytin/react-monaco-editor) and [Ted Driggs](https://github.com/TedDriggs)' amazing [`inferno-monaco-editor`](https://github.com/TedDriggs/inferno-monaco-editor).
