// @flow

'use strict';

import {ReactRelayContext} from 'react-relay';
import {getRequest, createOperationDescriptor} from 'relay-runtime';
import React, {useRef, useMemo, useState, useLayoutEffect} from 'react';

import type {Node} from 'react';
import type {GraphQLTaggedNode, IEnvironment, Variables} from 'relay-runtime';

import useDeepCompare from './useDeepCompare';

type Props = {
  environment: IEnvironment,
  query: GraphQLTaggedNode,
  // $FlowFixMe
  render: ({props: ?Object}) => Node,
  variables: Variables,
};

function LocalQueryRenderer(props: Props): Node {
  const {environment, query, variables, render} = props;
  const latestVariables = useDeepCompare(variables);
  const operation = useMemo(() => {
    const request = getRequest(query);
    return createOperationDescriptor(request, latestVariables);
  }, [query, latestVariables]);

  const relayContext = useMemo(
    () => ({
      environment,
      variables: {},
    }),
    [environment],
  );

  // Use a ref to prevent rendering twice when data changes
  // because of props change
  const dataRef = useRef(null);
  const [, forceUpdate] = useState(null);
  const cleanupFnRef = useRef(null);

  const snapshot = useMemo(() => {
    environment.check(operation.root);
    const res = environment.lookup(operation.fragment, operation);
    dataRef.current = res.data;

    // Run effects here so that the data can be retained
    // and subscribed before the component commits
    const retainDisposable = environment.retain(operation.root);
    const subscribeDisposable = environment.subscribe(res, newSnapshot => {
      dataRef.current = newSnapshot.data;
      forceUpdate(dataRef.current);
    });
    let disposed = false;
    function nextCleanupFn() {
      if (!disposed) {
        disposed = true;
        cleanupFnRef.current = null;
        retainDisposable.dispose();
        subscribeDisposable.dispose();
      }
    }
    if (cleanupFnRef.current) {
      cleanupFnRef.current();
    }
    cleanupFnRef.current = nextCleanupFn;
    return res;
  }, [environment, operation]);

  useLayoutEffect(() => {
    const cleanupFn = cleanupFnRef.current;
    return () => {
      cleanupFn && cleanupFn();
    };
  }, [snapshot]);

  return (
    <ReactRelayContext.Provider value={relayContext}>
      {render({props: dataRef.current})}
    </ReactRelayContext.Provider>
  );
}

export default LocalQueryRenderer;
