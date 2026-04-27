/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/login` | `/(auth)/register` | `/(auth)/welcome` | `/(doctor)` | `/(doctor)/` | `/(doctor)/appointment-detail` | `/(doctor)/appointments` | `/(doctor)/change-password` | `/(doctor)/earnings` | `/(doctor)/edit-profile` | `/(doctor)/notifications` | `/(doctor)/patient-detail` | `/(doctor)/patients` | `/(doctor)/profile` | `/(doctor)/reviews` | `/(doctor)/slots` | `/(doctor)/write-prescription` | `/(doctor)\` | `/(patient)` | `/(patient)/` | `/(patient)/appointment-detail` | `/(patient)/appointments` | `/(patient)/change-password` | `/(patient)/doctor-detail` | `/(patient)/doctors` | `/(patient)/edit-profile` | `/(patient)/family` | `/(patient)/favorites` | `/(patient)/notifications` | `/(patient)/payments` | `/(patient)/prescriptions` | `/(patient)/profile` | `/_sitemap` | `/appointment-detail` | `/appointments` | `/change-password` | `/doctor-detail` | `/doctors` | `/earnings` | `/edit-profile` | `/family` | `/favorites` | `/login` | `/notifications` | `/patient-detail` | `/patients` | `/payments` | `/prescriptions` | `/profile` | `/register` | `/reviews` | `/slots` | `/welcome` | `/write-prescription`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
