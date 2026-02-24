// 區域選擇 COMBO 數值來源 JSON
const zoneComboData = [
  { ZONE_VALUE: '08', Display_Name: 'ZONE1' },
  { ZONE_VALUE: '0b', Display_Name: 'ZONE2' }
];

window.addEventListener('DOMContentLoaded', () => {
  const zoneCombo = document.getElementById('zoneCombo');
  const byte0 = document.getElementById('byte0');
  if (zoneCombo) {
    zoneCombo.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- 請選擇區域 --';
    zoneCombo.appendChild(defaultOption);
    zoneComboData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.ZONE_VALUE;
      option.textContent = item.Display_Name;
      zoneCombo.appendChild(option);
    });
    // 連動到 byte0
    if (byte0) {
      zoneCombo.addEventListener('change', function() {
        if (this.value) {
          byte0.value = this.value;
        }
      });
    }
  }
});
