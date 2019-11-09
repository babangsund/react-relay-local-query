/**
 * @public
 *
 * Query local data without a network request.
 * Example usage:
 *
 * const {viewer} = useLocalQuery({
 *   environment,
 *   query: graphql`
 *     query AppQuery {
 *       viewer {
 *         __typename
 *         someLocalField
 *       }
 *     }
 *   `
 * });
 *
 */

import { useRef, useMemo, useState, useLayoutEffect } from 'react';
import {
  Variables,
  getRequest,
  IEnvironment,
  SelectorData,
  GraphQLTaggedNode,
  createOperationDescriptor,
} from 'relay-runtime';

// project
import useDeepCompare from './useDeepCompare';

type Props = {
  environment: IEnvironment;
  query: GraphQLTaggedNode;
  variables: Variables;
};

function useLocalQuery(props: Props): SelectorData | null {
  const { environment, query, variables } = props;
  const latestVariables = useDeepCompare(variables);
  const operation = useMemo(() => {
    const request = getRequest(query);
    return createOperationDescriptor(request, latestVariables);
  }, [query, latestVariables]);

  // Use a ref to prevent rendering twice when data changes
  // because of props change
  const dataRef = useRef<SelectorData | null>(null);
  const cleanupFnRef = useRef<(() => void) | null>(null);
  const [, forceUpdate] = useState<SelectorData | null>(null);

  const snapshot = useMemo(() => {
    environment.check(operation.root);
    const res = environment.lookup(operation.fragment);
    dataRef.current = res.data;

    // Run effects here so that the data can be retained
    // and subscribed before the component commits
    const retainDisposable = environment.retain(operation.root);
    const subscribeDisposable = environment.subscribe(res, newSnapshot => {
      dataRef.current = newSnapshot.data;
      forceUpdate(dataRef.current);
    });
    let disposed = false;
    function nextCleanupFn(): void {
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

  return dataRef.current;
}

export default useLocalQuery;
