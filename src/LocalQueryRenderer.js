// @flow

'use strict';

import React, {useMemo} from 'react';
import {ReactRelayContext} from 'react-relay';

import type {Node} from 'react';
import type {GraphQLTaggedNode, IEnvironment, Variables} from 'relay-runtime';

import useLocalQuery from './useLocalQuery';

type Props = {
  environment: IEnvironment,
  query: GraphQLTaggedNode,
  // $FlowFixMe
  render: ({props: ?Object}) => Node,
  variables: Variables,
};

function LocalQueryRenderer(props: Props): Node {
  const {environment, query, variables, render} = props;

  const localQuery = useLocalQuery({
    query,
    variables,
    environment,
  });

  const relayContext = useMemo(
    () => ({
      environment,
      variables: {},
    }),
    [environment],
  );

  return (
    <ReactRelayContext.Provider value={relayContext}>
      {render({props: localQuery})}
    </ReactRelayContext.Provider>
  );
}

export default LocalQueryRenderer;
