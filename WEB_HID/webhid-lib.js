const clearOutputBtn = document.getElementById('clearOutput');

if (clearOutputBtn) {
  clearOutputBtn.addEventListener('click', () => {
    output.textContent = '';
  });
}
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
const connectLedDeviceBtn = document.getElementById('connectLedDevice');
const effectCombo = document.getElementById('effectCombo');

// 載入效果清單（從外部 effects-data.js 載入）
function loadEffects() {
  try {
    if (!effectCombo) {
      console.error('effectCombo element not found');
      return;
    }
    if (typeof effectsData === 'undefined') {
      console.error('effectsData not found, please include effects-data.js');
      if (output) {
        output.textContent += '\n載入效果清單失敗: 找不到 effectsData';
      }
      return;
    }
    effectsData.forEach(effect => {
      const option = document.createElement('option');
      option.value = effect.Effect;
      option.textContent = `Effect ${effect.Effect} - ${effect.DESP} (Zone: ${effect.LightZone})`;
      effectCombo.appendChild(option);
    });
  } catch (err) {
    if (output) {
      output.textContent += `\n載入效果清單失敗: ${err.message}`;
    }
    console.error('載入效果清單失敗:', err);
  }
}

// 頁面載入時執行
if (effectCombo) {
  loadEffects();
  
  // 當選擇效果時，將 Effect 數值回填到 byte2
  effectCombo.addEventListener('change', () => {
    const selectedEffect = effectCombo.value;
    if (selectedEffect) {
      const byte2Input = document.getElementById('byte2');
      if (byte2Input) {
        // 將數值轉為16進位，並補0到兩位數
        byte2Input.value = parseInt(selectedEffect).toString(16).padStart(2, '0');
      }
    }
  });
}

// 亮度滑塊控制
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
if (brightnessSlider && brightnessValue) {
  brightnessSlider.addEventListener('input', () => {
    const brightness = parseInt(brightnessSlider.value);
    brightnessValue.textContent = brightness;
    
    // 將亮度值填入 byte3（轉為16進位）
    const byte3Input = document.getElementById('byte3');
    if (byte3Input) {
      byte3Input.value = brightness.toString(16).padStart(2, '0');
    }
  });
}

// 速度滑塊控制
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
if (speedSlider && speedValue) {
  speedSlider.addEventListener('input', () => {
    const speed = parseInt(speedSlider.value);
    speedValue.textContent = speed;
    
    // 將速度值填入 byte4（轉為16進位）
    const byte4Input = document.getElementById('byte4');
    if (byte4Input) {
      byte4Input.value = speed.toString(16).padStart(2, '0');
    }
  });
}

// 連接LED裝置: 先請求授權再自動指定ID連線
connectLedDeviceBtn.addEventListener('click', async () => {
  try {
    await navigator.hid.requestDevice({ filters: [] });
    // 直接呼叫指定ID連線的流程
    connectByIdBtn.click();
  } catch (err) {
    output.textContent = `錯誤: ${err.message}`;
  }
});

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
  try {
    const vid = parseInt(vidInput.value, 16);
    const pid = parseInt(pidInput.value, 16);
    const reportId = parseInt(reportIdInput.value, 16) || parseInt(reportIdInput.value, 10);
    if (isNaN(vid) || isNaN(pid) || isNaN(reportId)) {
      output.textContent = '請輸入正確的16進位 VID、PID 與 Report ID。';
      return;
    }
    const devices = await navigator.hid.getDevices();
    // 找到同時符合VID/PID且有對應Feature reportId的裝置
    const device = devices.find(d => {
      if (d.vendorId !== vid || d.productId !== pid) return false;
      // 只檢查featureReports
      return d.collections.some(col =>
        col.featureReports.some(r => r.reportId === reportId)
      );
    });
    if (!device) {
      output.textContent = `找不到指定 VID: ${vidInput.value} PID: ${pidInput.value} 且有 Report ID: ${reportIdInput.value} 的裝置，請確認已授權且有該 Report ID。`;
      return;
    }
    if (device.opened) {
      try {
        await device.close();
      } catch (closeErr) {
        output.textContent += `\n關閉裝置時發生錯誤: ${closeErr.message}`;
      }
    }
    await device.open();
    currentDevice = device;
    printReportInfo(device);
    output.textContent = `已連接: ${device.productName} (VID: ${device.vendorId.toString(16)}, PID: ${device.productId.toString(16)}, Report ID: ${reportId.toString(16)})\n`;

    device.addEventListener('inputreport', event => {
      const { data, reportId } = event;
      output.textContent += `收到報告 (ID: ${reportId}): ${Array.from(new Uint8Array(data.buffer)).join(', ')}\n`;
    });
  } catch (err) {
    output.textContent = `連線失敗: ${err.message}`;
  }
});

// 發送9個byte到HID
send8BytesBtn.addEventListener('click', async () => {
  const reportId = parseInt(reportIdInput.value, 16) || parseInt(reportIdInput.value, 10);
  const bytes = [];
  
  // 先讀取 byte0-byte6（不包含 checksum）
  for (let i = 0; i < 7; i++) {
    const val = document.getElementById(`byte${i}`).value;
    const num = parseInt(val, 16);
    if (isNaN(num) || num < 0 || num > 255) {
      output.textContent += `\n第 ${i + 1} 個 byte 輸入錯誤，請輸入 00~FF`;
      return;
    }
    bytes.push(num);
  }
  
  // 計算 CheckSUM (對 byte0-byte6 求和)
  let checksum = 0;
  for (let i = 0; i < 7; i++) {
    checksum += bytes[i];
  }
  
  // byte7 = checksum 低位元組
  const byte7 = checksum & 0xFF;
  // byte8 = checksum 高位元組
  const byte8 = (checksum >> 8) & 0xFF;
  
  // 更新 byte7 和 byte8 的顯示
  document.getElementById('byte7').value = byte7.toString(16).padStart(2, '0');
  document.getElementById('byte8').value = byte8.toString(16).padStart(2, '0');
  
  // 將 checksum bytes 加入
  bytes.push(byte7);
  bytes.push(byte8);
  
  if (!currentDevice || !currentDevice.opened) {
    output.textContent += '\n請先連接裝置！';
    return;
  }
  safeSendReport(reportId, new Uint8Array(bytes));
  if (currentDevice) {
    output.textContent += `\n已發送: 裝置(VID: ${currentDevice.vendorId.toString(16)}, PID: ${currentDevice.productId.toString(16)}) reportId=${reportId}, data=[${bytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
  } else {
    output.textContent += `\n已發送: reportId=${reportId}, data=[${bytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
  }
});

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