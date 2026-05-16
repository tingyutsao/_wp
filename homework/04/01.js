function convertTemperature(degree, type) {
  let celsius;
  let result;

  if (type === "C") {
    celsius = degree;
    result = degree * (9 / 5) + 32;
    console.log(`攝氏 ${degree}°C 轉換為華氏為 ${result.toFixed(1)}°F`);
  } else if (type === "F") {
    result = (degree - 32) * (5 / 9);
    celsius = result;
    console.log(`華氏 ${degree}°F 轉換為攝氏為 ${result.toFixed(1)}°C`);
  } else {
    console.log("未知的溫度類型，請輸入 'C' 或 'F'");
    return;
  }

  if (celsius > 30) {
    console.log("天氣好熱！");
  } else if (celsius < 15) {
    console.log("天氣好冷！");
  }
}

convertTemperature(35, "C");
convertTemperature(50, "F");