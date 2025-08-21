declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  interface Window {
    electronAPI: {
      fetchVerse: (input: string) => Promise<string>;
      ping: () => Promise<string>;
      generatePpt: (input: string) => Promise<string>;
    };
  }
}
