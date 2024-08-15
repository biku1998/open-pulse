export const convertSnakeCaseObjectToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((element) =>
      typeof element === 'object' &&
      element !== null &&
      !(element instanceof Date)
        ? convertSnakeCaseObjectToCamelCase(element)
        : element,
    ) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );

        // Check if the value is an object and not a Date instance
        result[camelKey] =
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !(obj[key] instanceof Date)
            ? convertSnakeCaseObjectToCamelCase(obj[key])
            : obj[key];
      }
    }
    return result as T;
  } else {
    return obj;
  }
};
