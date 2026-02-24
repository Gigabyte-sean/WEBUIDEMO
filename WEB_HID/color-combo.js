// 顏色資料來源 JSON
const colorData = [
  { ColorINDEX: 1, DisplayName: '紅' },
  { ColorINDEX: 2, DisplayName: '綠' },
  { ColorINDEX: 3, DisplayName: '黃' },
  { ColorINDEX: 4, DisplayName: '藍' },
  { ColorINDEX: 5, DisplayName: '橙' },
  { ColorINDEX: 6, DisplayName: '紫' },
  { ColorINDEX: 7, DisplayName: '白' },
  { ColorINDEX: 9, DisplayName: '自訂顏色' }
];

window.addEventListener('DOMContentLoaded', () => {
  const colorCombo = document.getElementById('colorCombo');
  const byte5 = document.getElementById('byte5');
  if (colorCombo) {
    // 保留第一個預設選項
    colorData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.ColorINDEX;
      option.textContent = item.DisplayName;
      colorCombo.appendChild(option);
    });
    // colorCombo 選擇時，將值填入 byte5
    if (byte5) {
      colorCombo.addEventListener('change', function() {
        if (this.value) {
          byte5.value = this.value.toString().padStart(2, '0');
        }
      });
    }
  }
});
