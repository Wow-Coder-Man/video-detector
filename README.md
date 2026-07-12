🚀 全网高清视频下载器 (AI特调版) 使用说明书本插件支持 通用M3U8直播流/在线视频、YouTube（突破403限制） 以及 Bilibili（解锁最高1080P/4K画质） 的一键多线程无损下载与自动打包。
⚠️ 注意：插件目录是固定写死的，请先确保tools目录和下载目录存在，如果想更改请转到第四步。
📂 第一步：本地下载与目录准备（工具链配置）
本插件是一套“前端嗅探+本地终端执行”的组合拳，需要在本地建立一个工具箱。
1 新建工具文件夹：在你的 E盘 新建一个名为 Software 的文件夹，并在里面再建一个 tools 文件夹。最终绝对路径必须为：E:\Software\tools
  ⚠️ 注意：不一定是E:\Software\tools，可以更改，但是要修改对应代码，具体查看第四步。
2 下载核心组件（可以直接点击插件面板上的链接直达官方 Releases 页面下载）：
N_m3u8DL-RE.exe（通用M3U8下载器）：下载 Windows 64位版本，解压出 N_m3u8DL-RE.exe。
yt-dlp.exe（YouTube/B站下载核心）：下载 yt-dlp.exe 文件。
deno.exe（JavaScript运行时，用于YouTube动态解密）：下载 Windows 的 zip 包，解压出 deno.exe。
ffmpeg.exe（音视频无损打包混流器）：去 FFmpeg 官网下载 Windows 编译版本，把其中的 ffmpeg.exe 提取出来。
3 统一归放：
将上述下载好的 4个 .exe 文件，全部整整齐齐地丢进 E:\Software\tools 目录下。
  💡 此时 E:\Software\tools 目录内应包含：N_m3u8DL-RE.exeyt-dlp.exedeno.exeffmpeg.exe (注意：yt-dlp和RE工具在合并视频时会自动调用同目录下的ffmpeg，无需手动运行它)
🌐 第二步：在浏览器中安装插件
1 打开 Edge 浏览器（或 Chrome 浏览器），在地址栏输入：edge://extensions/（Chrome 输入 chrome://extensions/）进入扩展程序管理页面。
2 在页面右上角（或左下角）找到并开启 “开发者模式” (Developer mode)。
3 点击左上角弹出的 “加载已解压的扩展程序” (Load unpacked) 按钮。
4 选择你存放插件代码（包含 manifest.json、popup.html 等文件）的整个根文件夹。
5 安装成功！点击浏览器右上角的拼图块图标，把“全网高清视频下载器”固定到工具栏。
🎬 第三步：实战下载操作
1. 下载通用 M3U8 网页视频 / 直播
   打开含有视频的网页，等待视频开始正常播放。
   点击插件图标，插件会自动亮起绿灯：🟢 成功锁定 1080p 或 ⚪ 锁定通用画质。
   点击 [复制运行命令]。
   键盘按下 Win + R 输入 cmd 打开电脑的命令提示符（黑色窗口）。
   鼠标右键粘贴命令，敲下回车，视频就会多线程飙满网速下载。
2. 下载 YouTube 视频
   打开 YouTube 视频页面，务必先按 F5 刷新一下页面。
   点击插件图标，会自动亮起红灯：🔴 已智能锁定 YouTube 平台。
   点击 [复制运行命令]。
   同样打开 cmd（黑色窗口）粘贴并回车。
   命令会自动调用本地的 deno.exe 绕过大厂403限制，并调用 ffmpeg 自动把分离的音视频轨无损合成为一个 MP4。
3. 下载 Bilibili 视频
   打开 B 站视频页面，务必先按 F5 刷新一下页面。
   点击插件图标，会自动亮起蓝灯：🔵 已智能锁定 Bilibili 平台。
   点击 [复制运行命令]。
   同样打开 cmd（黑色窗口）粘贴并回车。yt-dlp 会以你当前 B 站账号的最高画质权限（大会员直接解锁 1080P 高码率或 4K）进行满速无损下载！
  🎉 所有下载完的视频，都会以网页本来的视频标题命名，自动保存到：E:\Downloads\Edge 文件夹下！
🛠️ 第四步：个性化进阶修改指南（怎么改目录？）
如果你不想用默认的 E 盘目录，可以用记事本打开 popup.js 文件，修改文件最开头（第 6 行到第 11 行）的路径配置：
  // 1. 如果你的工具放到了别的地方（比如 D 盘的 download-tools 文件夹）
  // 只需要把 "E:\\\\Software\\\\tools" 改为 "D:\\\\download-tools" (注意保持四个反斜杠)
  const TOOL_DIR = "E:\\\\Software\\\\tools"; 
  
  // 2. 如果你想改变视频下载完后的保存目录（比如想存到 D 盘的 Video 文件夹）
  // 只需要把 "E:\\\\Downloads\\\\Edge" 改为 "D:\\\\Video" (同样保持四个反斜杠)
  const SAVE_DIR = "E:\\\\Downloads\\\\Edge";

修改完成后，保存 popup.js。回到浏览器的插件扩展程序管理页面，找到本插件，点击卡片右下角的 “刷新 (Reload)” 循环箭头图标，最新路径即可瞬间生效！
