export type PathOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in Extract<keyof T, string>]:
        | `${Prefix}${K}`
        | (T[K] extends Array<infer U>
            ? `${Prefix}${K}[number]` | PathOf<U, `${Prefix}${K}[number].`>
            : PathOf<T[K], `${Prefix}${K}.`>);
    }[Extract<keyof T, string>]
  : never;
