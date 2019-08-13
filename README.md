# react-relay-local-query

Local queries for react-relay.  
For querying local data without sending a request to the server ([local state management](https://babangsund.com/relay_local_state_management/)).

Provides functionality (likely) found in the *next* build of [relay](https://relay.dev/):  
https://github.com/facebook/relay/blob/master/packages/react-relay/ReactRelayLocalQueryRenderer.js.

Note that the Relay compiler still requires you to include a server schema field in the query.  
Ideally, you would use a schema agnostic field, like an introspection field.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-relay-local-query

Using [yarn](https://yarnpkg.com/):

    $ yarn add react-relay-local-query

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// Using ES6 Modules
import { useLocalQuery, LocalQueryRenderer } from "react-relay-local-query";
// using CommonJS modules
const useLocalQuery = require("react-relay-local-query").useLocalQuery;
const LocalQueryRenderer = require("react-relay-local-query").LocalQueryRenderer;
```


## Usage

This package contains two modules.  
`LocalQueryRenderer` and `useLocalQuery`.

`LocalQueryRenderer` is used just like a regular [QueryRenderer](https://relay.dev/docs/en/query-renderer).  

```jsx
// App.js
import React from 'react';
import {LocalQueryRenderer} from 'react-relay-local-query';

function MyApp({children}) {
  return (
    <LocalQueryRenderer
      variables={{}}
      environment={environment}
      query={graphql`
        query AppQuery {
          __typename
          settings {
            title
          }
        }
      `}
      render={({props}) => {
        return <div>{props.settings.title}</div>;
      }}
    />
  );
}
```

`useLocalQuery` is the hook implementation of `LocalQueryRenderer`.

```jsx
// App.js
import React from 'react';
import {useLocalQuery} from 'react-relay-local-query';

function MyApp({children}) {
  const data = useLocalQuery({
    environment,
    query: graphql`
      query AppQuery {
        __typename
        settings {
          title
        }
      }
    `,
  });

  return <div>{data.settings.title}</div>;
}
```

Unlike `QueryRenderer` and `fetchQuery`, `LocalQueryRenderer` and `useLocalQuery` return a data snapshot on the initial render.

## Credits

react-relay-local-query is built and maintained by **babangsund**.

[@blog](https://babangsund.com/).  
[@github](https://github.com/babangsund).  
[@twitter](https://twitter.com/babangsund).  
