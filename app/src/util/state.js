export const hasDrizzleKeys = keys =>
    !keys.some(({ drizzleKey }) => !drizzleKey);

export const hasValues = values =>
    !values.some(({ value }) => value === undefined || value === null);
// !values.some(({ value }) => value === undefined);
