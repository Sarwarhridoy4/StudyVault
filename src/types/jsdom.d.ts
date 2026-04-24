// @ts-ignore
import 'jsdom';

declare module 'jsdom' {
  interface JSDOM {
    window: any;
  }
}
