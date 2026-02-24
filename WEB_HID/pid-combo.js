// PID COMBO 數值來源 JSON
const pidComboData = [
  { CHIP_ID: '8100', Display_Name: 'CHIP 1' },
  { CHIP_ID: '8301', Display_Name: 'CHIP 2' }
];

window.addEventListener('DOMContentLoaded', () => {
  const pidCombo = document.getElementById('pidCombo');
  const pidInput = document.getElementById('pid');
  if (pidCombo) {
    pidCombo.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- 請選擇 CHIP --';
    pidCombo.appendChild(defaultOption);
    pidComboData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.CHIP_ID;
      option.textContent = item.Display_Name;
      pidCombo.appendChild(option);
    });
    // 連動到 pid input
    if (pidInput) {
      pidCombo.addEventListener('change', function() {
        if (this.value) {
          pidInput.value = this.value;
        }
      });
    }
  }
});
