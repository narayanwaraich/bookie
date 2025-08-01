import { useState, useEffect } from 'react';

export function useActiveTabInfo() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        if (tabs[0]) {
          setUrl(tabs[0].url || '');
          setTitle(tabs[0].title || '');
        }
      }
    );
  }, []);

  return { url, setUrl, title, setTitle };
}
