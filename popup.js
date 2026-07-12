document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const cmdOutput = document.getElementById('cmdOutput');
  const copyBtn = document.getElementById('copyBtn');

  // 固定本地的工具链存放目录
  const TOOL_DIR = "E:\\\\Software\\\\tools"; 

  // 所有工具链统一调用该目录下的绝对路径执行程序
  const RE_EXE_PATH = `"${TOOL_DIR}\\\\N_m3u8DL-RE.exe"`; 
  const YT_DLP_PATH = `"${TOOL_DIR}\\\\yt-dlp.exe"`; 
  const DENO_PATH = `"${TOOL_DIR}\\\\deno.exe"`; 
  const SAVE_DIR = "E:\\\\Downloads\\\\Edge";

  // 1. 获取当前活动标签页
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const currentTabUrl = (tab.url || "").toLowerCase(); // 转换为小写，防止大小写错乱导致不匹配
  let pageTitle = tab.title || "video_output";
  pageTitle = pageTitle.replace(/[\\/:*?"<>|]/g, "_").trim(); // 过滤 Windows 非法字符

  // 【核心修复】：放宽匹配条件，只要网址里包含 bilibili.com 或 b23.tv 就算是 B 站
  const isYouTube = currentTabUrl.includes('youtube.com') || currentTabUrl.includes('youtu.be') || currentTabUrl.includes('/shorts/');
  const isBilibili = currentTabUrl.includes('bilibili.com') || currentTabUrl.includes('b23.tv');

  // 2. 【分流处理器 1】：处理 YouTube 平台
  if (isYouTube) {
    statusDiv.innerHTML = `
      <div style="margin-bottom: 8px;">
        <span style='background: #ff0000; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;'>🔴 已智能锁定 YouTube 平台</span>
      </div>
      <div style="font-size: 11px; color: #666; word-break: break-all; background: #f8f9fa; padding: 6px; border: 1px solid #eee; border-radius: 4px;">
        <strong>视频标题:</strong> ${pageTitle}<br>
        <span style="color:#28a745; font-weight:bold;">✨ 已挂载 Deno 脚本解密链，绕过 403 限制</span>
      </div>
    `;

    const ytCmd = `${YT_DLP_PATH} "${tab.url}" --js-runtimes "deno:${DENO_PATH}" -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 -P "${SAVE_DIR}" -o "${pageTitle}.%(ext)s"`;
    cmdOutput.value = ytCmd;

  // 3. 【分流处理器 2】：处理 Bilibili 平台
  } else if (isBilibili) {
    statusDiv.innerHTML = `
      <div style="margin-bottom: 8px;">
        <span style='background: #00a1d6; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;'>🔵 已智能锁定 Bilibili 平台</span>
      </div>
      <div style="font-size: 11px; color: #666; word-break: break-all; background: #f8f9fa; padding: 6px; border: 1px solid #eee; border-radius: 4px;">
        <strong>视频标题:</strong> ${pageTitle}<br>
        <span style="color:#28a745; font-weight:bold;">✨ 核心安全注入：已成功无感同步当前页面会话凭证</span>
      </div>
    `;

    // 使用原本带有大小写的 tab.url 来精准获取 Cookie，100% 绕过 Windows DPAPI 锁 [INDEX]
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      let cookieString = "";
      if (cookies && cookies.length > 0) {
        cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      }

      const bbiCmd = `${YT_DLP_PATH} "${tab.url}" --add-header "Cookie: ${cookieString}" -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 -P "${SAVE_DIR}" -o "${pageTitle}.%(ext)s"`;
      cmdOutput.value = bbiCmd;
    });

  // 4. 【分流处理器 3】：处理其他通用 m3u8 直播流网站
  } else {
    chrome.runtime.sendMessage({ action: "getM3u8", tabId: tab.id }, (response) => {
      const currentM3u8Url = response ? response.url : "";

      if (!currentM3u8Url) {
        statusDiv.innerHTML = `
          <span style='color: #cc0000;'>❌ 未检测到通用 m3u8 视频流。</span><br>
          <button id="retryBtn" style="margin-top:8px; padding:4px; font-size:11px; background:#666; color:white; border:none; border-radius:3px; cursor:pointer;">强制刷新页面重试</button>
        `;
        document.getElementById('retryBtn')?.addEventListener('click', () => {
          chrome.tabs.reload(tab.id, { bypassCache: true });
          window.close();
        });
        return;
      }

      let resolutionBadge = "";
      if (currentM3u8Url.toLowerCase().includes('1080')) {
        resolutionBadge = "<span style='background: #28a745; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;'>🟢 成功锁定 1080p Full HD</span>";
      } else if (currentM3u8Url.toLowerCase().includes('720')) {
        resolutionBadge = "<span style='background: #ffc107; color: #333; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;'>🟡 锁定 720p HD 画质</span>";
      } else {
        resolutionBadge = "<span style='background: #6c757d; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;'>⚪ 锁定通用画质视频流</span>";
      }

      statusDiv.innerHTML = `
        <div style="margin-bottom: 8px;">${resolutionBadge}</div>
        <div style="font-size: 11px; color: #666; word-break: break-all; background: #f8f9fa; padding: 6px; border: 1px solid #eee; border-radius: 4px;">
          <strong>视频标题:</strong> ${pageTitle}<br>
          <strong style="display:inline-block; margin-top:4px;">流地址:</strong> ${currentM3u8Url.substring(0, 45)}...
        </div>
      `;

      const reCmd = `${RE_EXE_PATH} "${currentM3u8Url}" --save-dir "${SAVE_DIR}" --save-name "${pageTitle}" --auto-select -M format=mp4`;
      cmdOutput.value = reCmd;
    });
  }

  // 5. 原生文本节点劫持复制器
  copyBtn.addEventListener('click', () => {
    const textToCopy = cmdOutput.value;
    if (!textToCopy) return;

    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    tempTextArea.style.position = "fixed";
    tempTextArea.style.top = "0";
    tempTextArea.style.left = "0";
    tempTextArea.style.opacity = "0";
    
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('🎉 命令行已完美复制到剪贴板！');
      } else {
        alert('复制失败，请手动在文本框内全选复制。');
      }
    } catch (err) {
      alert('复制发生异常，请手动全选复制。');
    }
    
    document.body.removeChild(tempTextArea);
  });

  // 6. 【安全跳出处理器】：监听下载依赖标签的点击事件，无感在新标签页中打开官方 GitHub Releases
  document.querySelectorAll('.tool-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = e.currentTarget.getAttribute('data-url');
      if (targetUrl) {
        chrome.tabs.create({ url: targetUrl });
      }
    });
  });
});
