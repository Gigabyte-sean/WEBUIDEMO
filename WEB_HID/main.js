const localBase = "http://127.0.0.1:54321";

fetch(`${localBase}/Get`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("deviceInfo").textContent = JSON.stringify(data, null, 2);
  })
  .catch(err => {
    document.getElementById("deviceInfo").textContent = "⚠️ 無法連線到本地服務。";
  });

function sendDownload() {
  const driverList = {
    driver: "abc123_driver",
    version: "1.2.3"
  };

  fetch(`${localBase}/Download_Run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driverList)
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("result").textContent = `✅ 執行成功：${JSON.stringify(data)}`;
  })
  .catch(err => {
    document.getElementById("result").textContent = `⚠️ 發送失敗：${err.message}`;
  });
}