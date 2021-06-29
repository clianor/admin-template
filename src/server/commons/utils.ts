import { keyBy, transform, isObject } from 'lodash';

export const deepOmit = (obj, keysToOmit) => {
  const keysToOmitIndex = keyBy(
    Array.isArray(keysToOmit) ? keysToOmit : [keysToOmit],
  );

  const omitFromObject = (obj) => {
    return transform(obj, (result, value, key) => {
      if (key in keysToOmitIndex) {
        return;
      }

      result[key] = isObject(value) ? omitFromObject(value) : value;
    });
  };

  return omitFromObject(obj);
};
