declare module "*.css" {
  const classes: { [key: string]: string };

  export default classes;
}

declare module "@rootsdk/client-app" {
  export type RootThemeMode = "light" | "dark";

  export enum RootClientThemeEvent {
    ThemeUpdate = "ThemeUpdate",
  }

  interface ThemeClient {
    getTheme(): RootThemeMode;
    on(event: RootClientThemeEvent, handler: (mode: RootThemeMode) => void): void;
    off(event: RootClientThemeEvent, handler: (mode: RootThemeMode) => void): void;
  }

  export const rootClient: {
    theme: ThemeClient;
  };
}
