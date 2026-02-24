// 全區域 checkbox 行為與數值來源 JSON
const globalCheckboxConfig = {
  SYNC_Value: '02',
  unSYNC_Value: '00',
  SYNC_BYTE0: '08'
};

window.addEventListener('DOMContentLoaded', () => {
  const globalCheckbox = document.getElementById('globalCheckbox');
  const byte1 = document.getElementById('byte1');
  const byte0 = document.getElementById('byte0');
  if (globalCheckbox && byte1) {
    globalCheckbox.addEventListener('change', function() {
      byte1.value = this.checked ? globalCheckboxConfig.SYNC_Value : globalCheckboxConfig.unSYNC_Value;
      // 選取時 byte0 改為 08
      if (byte0 && this.checked) {
        byte0.value = globalCheckboxConfig.SYNC_BYTE0;
      }
    });
  }
});
