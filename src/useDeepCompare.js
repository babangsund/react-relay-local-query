/**
 * @private
 *
 * Use deep comparison to memoize object reference value.
 * Returns true if both arguments have the same keys and values.
 * Example usage:
 *
 * const cachedObject = useDeepCompare(myObject);
 *
 * @flow
 */

'use strict';

import React from 'react';
import areEqual from 'fbjs/lib/areEqual';
import {deepFreeze} from 'relay-runtime';

function useDeepCompare<T: {}>(value: T): T {
  const latestValue = React.useRef(value);
  if (!areEqual(latestValue.current, value)) {
    if (__DEV__) {
      deepFreeze(value);
    }
    latestValue.current = value;
  }
  return latestValue.current;
}

export default useDeepCompare;
