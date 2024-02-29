import initReloadClient from '../initReloadClient';

export default function addHmrIntoScript(watchPath: string) {
  const reload = () => {
    console.log({watchPath})
    chrome.runtime.reload();
  };

  initReloadClient({
    watchPath,
    onUpdate: reload,
    onForceReload: reload,
  });
}
