// connectById 與 connectLedDevice 參考 pidCombo
window.addEventListener('DOMContentLoaded', function() {
  const pidCombo = document.getElementById('pidCombo');
  const pidInput = document.getElementById('pid');
  const connectByIdBtn = document.getElementById('connectById');
  const connectLedDeviceBtn = document.getElementById('connectLedDevice');
  
  function getSelectedPid() {
    return pidCombo && pidCombo.value ? pidCombo.value : (pidInput ? pidInput.value : '');
  }
  
  if (connectByIdBtn) {
    connectByIdBtn.addEventListener('click', function(e) {
      if (pidInput) pidInput.value = getSelectedPid();
    });
  }
  
  if (connectLedDeviceBtn) {
    connectLedDeviceBtn.addEventListener('click', function(e) {
      if (pidInput) pidInput.value = getSelectedPid();
    });
  }
});
