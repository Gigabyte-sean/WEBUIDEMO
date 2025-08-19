const requestBtn = document.getElementById('request');
const listBtn = document.getElementById('list');
const connectByIdBtn = document.getElementById('connectById');
const vidInput = document.getElementById('vid');
const pidInput = document.getElementById('pid');
const output = document.getElementById('output');
const reportIdInput = document.getElementById('reportId');
const send8BytesBtn = document.getElementById('send8Bytes');
const connectByIndexBtn = document.getElementById('connectByIndex');
const deviceIndexInput = document.getElementById('deviceIndex');

let currentDevice = null;

// 請求裝置授權
requestBtn.addEventListener('click', async () => {
  try {
    await navigator.hid.requestDevice({ filters: [] });
    output.textContent = '已請求裝置授權，請點擊「列舉所有裝置」。';
  } catch (err) {
    output.textContent = `錯誤: ${err.message}`;
  }
});

// 列舉所有已授權裝置
listBtn.addEventListener('click', async () => {
  const devices = await navigator.hid.getDevices();
  if (devices.length === 0) {
    output.textContent = '目前沒有已授權的 HID 裝置，請先授權。';
    return;
  }
  output.textContent = '已授權裝置清單：\n';
  devices.forEach((device, idx) => {
    output.textContent += `${idx + 1}. ${device.productName} (VID: ${device.vendorId.toString(16)}, PID: ${device.productId.toString(16)})\nCol:\n${printReportInfo(device)}\n`;
  });
});

function printReportInfo(device) {
  let info = '';
  device.collections.forEach((col, idx) => {
    col.inputReports.forEach(r => {
      info += `Input Report: id=${r.reportId}, items=${r.items.length}\n`;
    });
    col.outputReports.forEach(r => {
      info += `Output Report: id=${r.reportId}, items=${r.items.length}\n`;
    });
    col.featureReports.forEach(r => {
      info += `Feature Report: id=${r.reportId}, items=${r.items.length}\n`;
    });  
  });
  return info;
}

// 依輸入的ID自動連線
connectByIdBtn.addEventListener('click', async () => {
  const vid = parseInt(vidInput.value, 16);
  const pid = parseInt(pidInput.value, 16);
  if (isNaN(vid) || isNaN(pid)) {
    output.textContent = '請輸入正確的16進位 VID 與 PID。';
    return;
  }
  const devices = await navigator.hid.getDevices();
  const device = devices.find(
    d => d.vendorId === vid && d.productId === pid
  );
  if (!device) {
    output.textContent = `找不到指定 VID: ${vidInput.value} PID: ${pidInput.value} 的裝置，請確認已授權。`;
    return;
  }
  await device.open();
  currentDevice = device;
  printReportInfo(device);
  output.textContent = `已連接: ${device.productName} (VID: ${device.vendorId.toString(16)}, PID: ${device.productId.toString(16)})\n`;

  device.addEventListener('inputreport', event => {
    const { data, reportId } = event;
    output.textContent += `收到報告 (ID: ${reportId}): ${Array.from(new Uint8Array(data.buffer)).join(', ')}\n`;
  });
});

// ...existing code...
send8BytesBtn.addEventListener('click', async () => {
  const Send_length = parseInt(document.getElementById('Sendlength').value, 10);
  const reportId = parseInt(reportIdInput.value, 16) || parseInt(reportIdInput.value, 10);
  const bytes = [];
for (let i = 0; i < Send_length; i++) { // 由sendlength決定發送的byte數量
    const el = document.getElementById(`byte${i}`);
    let num = 0;
    if (el && el.value.trim() !== "") {
      const val = el.value;
      num = parseInt(val, 16);
      if (isNaN(num) || num < 0 || num > 255) {
        output.textContent += `\n第 ${i + 1} 個 byte 輸入錯誤，請輸入 00~FF`;
        return;
      }
    }
    // 若找不到元素或值為空，num 預設為 0
    bytes.push(num);
  }
  if (!currentDevice || !currentDevice.opened) {
    output.textContent += '\n請先連接裝置！';
    return;
  }
  safeSendReport(reportId, new Uint8Array(bytes)); 
  output.textContent += `\n已發送: reportId=${reportId}, data=[${bytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
});
// ..

async function safeSendReport(reportId, data) {
  try {
    if (!currentDevice.opened) {
      await currentDevice.open();
    }
    await currentDevice.sendFeatureReport(reportId, data);
    output.textContent += `\nFeature Report 發送成功 (reportId=${reportId})`;
  } catch (err) {
    output.textContent += `\nFeature Report 發送失敗: ${err.message}\n嘗試重新連線...`;
    console.error('Feature Report 發送失敗:', err);
    // 嘗試重新開啟裝置
    try {
      await currentDevice.close();
    } catch (e) {}
  }
}

connectByIndexBtn.addEventListener('click', async () => {
  const devices = await navigator.hid.getDevices();
  const idx = parseInt(deviceIndexInput.value, 10) - 1; // 使用者輸入從1開始
  if (isNaN(idx) || idx < 0 || idx >= devices.length) {
    output.textContent = `請輸入正確的裝置序號（1~${devices.length}）`;
    return;
  }
  const device = devices[idx];
  await device.open();
  currentDevice = device;
  output.textContent = `已連接第${idx + 1}個裝置: ${device.productName} (VID: ${device.vendorId.toString(16)}, PID: ${device.productId.toString(16)})\n`;
  output.textContent += printReportInfo(currentDevice);

  device.addEventListener('inputreport', event => {
    const { data, reportId } = event;
    output.textContent += `收到報告 (ID: ${reportId}): ${Array.from(new Uint8Array(data.buffer)).join(', ')}\n`;
  });
});