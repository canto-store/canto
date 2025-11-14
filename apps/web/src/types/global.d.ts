export {};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pwa-install": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        name?: string;
        icon?: string;
        description?: string;
        "disable-install-description"?: string;
        "disable-screenshots"?: string;
        "manual-apple"?: string;
        "manual-chrome"?: string;
        "install-description"?: string;
        "disable-chrome"?: string;
        "disable-edge"?: string;
        "disable-firefox"?: string;
        "disable-samsung"?: string;
        "disable-other"?: string;
      };
    }
  }
}
