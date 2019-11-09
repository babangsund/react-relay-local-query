/**
 * @public
 *
 * Query local data without a network request.
 * Example usage:
 *
 * <LocalQueryRenderer
 *   environment={environment}
 *   query={graphql`
 *     query AppQuery {
 *       viewer {
 *         __typename
 *         someLocalField
 *       }
 *     }
 *   `}
 *   render={({props}) => {
 *     return (
 *       <div>{props.viewer.someLocalField}</div>
 *     );
 *   }}
 * />;
 */
import React, { useMemo } from 'react';
import { ReactRelayContext } from 'react-relay';
import { GraphQLTaggedNode, IEnvironment, Variables, SelectorData } from 'relay-runtime';

// project
import useLocalQuery from './useLocalQuery';

type Props = {
  variables: Variables,
  query: GraphQLTaggedNode,
  environment: IEnvironment,
  render: ({ props }: { props: SelectorData | null }) => React.ReactNode,
};

function LocalQueryRenderer(props: Props): React.ReactNode {
  const { environment, query, variables, render } = props;

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
      {render({ props: localQuery })}
    </ReactRelayContext.Provider>
  );
}

export default LocalQueryRenderer;
