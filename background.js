let capturedUrls = {};

// 监听所有网络请求，只要包含 .m3u8 或者是 master.json 就记录下来
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url;
    if (url.includes('.m3u8') || url.includes('master.json')) {
      // 按照标签页 ID (tabId) 分类存储，防止多窗口串线
      capturedUrls[details.tabId] = url;
    }
  },
  { urls: ["<all_urls>"] }
);

// 监听来自 popup.js 的询问，把抓到的 URL 吐给前端界面
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getM3u8" && message.tabId) {
    sendResponse({ url: capturedUrls[message.tabId] || "" });
  }
  return true; // 保持通道开放，支持异步响应
});

// 当标签页关闭时，清除内存释放资源
chrome.tabs.onRemoved.addListener((tabId) => {
  delete capturedUrls[tabId];
});
