type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type PathOf<
  T,
  Prefix extends string = "",
  Depth extends number = 6
> = Depth extends 0
  ? never
  : T extends object
  ? {
      [K in Extract<keyof T, string>]:
        | `${Prefix}${K}`
        | (T[K] extends Array<infer U>
            ?
                | `${Prefix}${K}[number]`
                | PathOf<U, `${Prefix}${K}[number].`, Prev[Depth]>
            : PathOf<T[K], `${Prefix}${K}.`, Prev[Depth]>);
    }[Extract<keyof T, string>]
  : never;
