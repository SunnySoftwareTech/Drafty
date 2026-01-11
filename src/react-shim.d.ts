// Minimal React & JSX shims for editor/type-checker when @types/react aren't resolved
// This file provides lightweight declarations so TS/IDE tools won't report missing JSX types.

declare module 'react' {
  // common types used in the codebase
  export type ReactNode = any
  export type ChangeEvent<T = any> = any
  export type MouseEvent<T = any> = any

  export function useState<T = any>(initial?: T): [T, (v: T) => void]
  export function useEffect(cb: (...args: any[]) => any, deps?: any[]): void
  export function useMemo<T>(cb: () => T, deps?: any[]): T
  export function useRef<T = any>(initial?: T): { current: T }

  export const Fragment: any
  export function createElement(...args: any[]): any

  const React: any
  export default React
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any
  export function jsxs(type: any, props?: any, key?: any): any
  export function jsxDEV(type: any, props?: any, key?: any, isStatic?: any, source?: any, self?: any): any
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // allow any HTML/SVG tag
      [elemName: string]: any
    }
    interface Element {}
    interface ElementClass {}
    interface ElementAttributesProperty { props: any }
    interface ElementChildrenAttribute { children: any }
  }
}

export {}
