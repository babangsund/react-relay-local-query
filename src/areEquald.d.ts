declare module 'fbjs/lib/areEqual' {
  export default function areEqual<T extends object>(
    value1: T,
    value2: T
  ): boolean;
}
