// zoneCombo 預設禁用，globalCheckbox 未選取時啟用
window.addEventListener('DOMContentLoaded', function() {
  const zoneCombo = document.getElementById('zoneCombo');
  const globalCheckbox = document.getElementById('globalCheckbox');
  if (zoneCombo) zoneCombo.disabled = true;
  if (globalCheckbox && zoneCombo) {
    globalCheckbox.addEventListener('change', function() {
      zoneCombo.disabled = this.checked;
    });
  }
});
