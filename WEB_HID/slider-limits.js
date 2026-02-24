

// 上下限數值由 JSON 物件取得
const sliderLimits = {
  brightness: { min: 1, max: 11 },
  speed: { min: 0, max: 50 }
};

window.addEventListener('DOMContentLoaded', () => {
  // 設定 brightnessSlider 的上下限
  const brightnessSlider = document.getElementById('brightnessSlider');
  if (brightnessSlider) {
    brightnessSlider.min = sliderLimits.brightness.min;
    brightnessSlider.max = sliderLimits.brightness.max;
  }
  // 同步 min/max 標籤
  const brightnessMinLabel = document.getElementById('brightnessMin');
  const brightnessMaxLabel = document.getElementById('brightnessMax');
  if (brightnessMinLabel) brightnessMinLabel.textContent = sliderLimits.brightness.min;
  if (brightnessMaxLabel) brightnessMaxLabel.textContent = sliderLimits.brightness.max;

  // 設定 speedSlider 的上下限
  const speedSlider = document.getElementById('speedSlider');
  if (speedSlider) {
    speedSlider.min = sliderLimits.speed.min;
    speedSlider.max = sliderLimits.speed.max;
  }
  // 同步 min/max 標籤
  const speedMinLabel = document.getElementById('speedMin');
  const speedMaxLabel = document.getElementById('speedMax');
  if (speedMinLabel) speedMinLabel.textContent = sliderLimits.speed.min;
  if (speedMaxLabel) speedMaxLabel.textContent = sliderLimits.speed.max;
});
