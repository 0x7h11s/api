const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 目标live.txt的RAW地址（必须用raw地址，不能用blob地址）
const LIVE_TXT_URL =
  "https://raw.githubusercontent.com/Supprise0901/TVBox_live/main/live.txt";
// 输出的JSON文件路径（根目录的live.json）
const OUTPUT_JSON_PATH = path.resolve(__dirname, "live");

const list = ["🇨🇳组播线路,", "🇨🇳IPV4线路,"];
/**
 * 抓取live.txt内容并转换为JSON
 */
async function fetchLiveTxtAndConvertToJson() {
  try {
    console.log("开始抓取live.txt内容...");
    // 1. 抓取live.txt原始内容
    const response = await axios.get(LIVE_TXT_URL, {
      responseType: "text", // 确保获取纯文本
      timeout: 10000, // 10秒超时
    });
    const liveTxtContent = response.data;
    console.log("成功抓取live.txt内容，长度：", liveTxtContent.length);

    // 2. 转换为JSON格式（两种方式可选，按需切换）
    // 方式1：将整个文本作为字符串存入JSON（推荐，保留原格式）

    const data = convertTvSource(liveTxtContent);
    const newData = listMap(data);
    const strData = restoreTvSource(newData);

    // 3. 写入live文件（格式化输出，便于阅读）
    fs.writeFileSync(OUTPUT_JSON_PATH, strData, "utf8");
    console.log(`成功写入live文件：${OUTPUT_JSON_PATH}`);
  } catch (error) {
    console.error("执行失败：", error.message);
    // 捕获错误后终止脚本，让Action标记失败
    process.exit(1);
  }
}

function convertTvSource(text) {
  // 最终结果数组
  const result = [];
  // 按行拆分文本，处理换行符兼容（\n或\r\n）
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);

  let currentGenre = "";
  let currentSource = [];

  // 遍历每一行进行处理
  lines.forEach((line) => {
    // 识别分类行（包含#genre#）
    if (line.includes("#genre#")) {
      // 如果已有未保存的分类数据，先保存
      if (currentGenre && currentSource.length > 0) {
        result.push({
          genre: currentGenre,
          source: [...currentSource],
        });
        currentSource = [];
      }
      // 提取分类名称（去掉#genre#部分）
      currentGenre = line.replace("#genre#", "").trim();
    }
    // 识别频道行（包含逗号分隔的名称和地址）
    else if (line.includes(",")) {
      // 拆分频道名和地址（处理地址中可能包含逗号的情况，只拆分第一个逗号）
      const commaIndex = line.indexOf(",");
      const name = line.substring(0, commaIndex).trim();
      const url = line.substring(commaIndex + 1).trim();

      // 过滤无效的地址（空地址或非http/rtmp开头的）
      if (url && (url.startsWith("http") || url.startsWith("rtmp"))) {
        currentSource.push({
          name,
          url,
        });
      }
    }
  });

  // 保存最后一个分类的数据
  if (currentGenre && currentSource.length > 0) {
    result.push({
      genre: currentGenre,
      source: currentSource,
    });
  }

  return result;
}

function restoreTvSource(convertedArray) {
  // 校验输入：如果不是数组或空数组，返回空字符串
  if (!Array.isArray(convertedArray) || convertedArray.length === 0) {
    return "";
  }

  // 用于存储每一行的内容
  const lines = [];

  // 遍历每个分类对象
  convertedArray.forEach((genreItem) => {
    // 跳过无效的分类项（无分类名或无频道源）
    if (
      !genreItem.genre ||
      !Array.isArray(genreItem.source) ||
      genreItem.source.length === 0
    ) {
      return;
    }

    // 1. 添加分类行：#genre# + 分类名称
    lines.push(`${genreItem.genre.trim()}#genre#`);

    // 2. 遍历该分类下的所有频道，添加频道行（名称,URL）
    genreItem.source.forEach((channel) => {
      // 跳过无效的频道项（无名称或无URL）
      if (!channel.name || !channel.url) {
        return;
      }
      // 拼接频道行（确保名称和URL无多余空格）
      const channelLine = `${channel.name.trim()},${channel.url.trim()}`;
      lines.push(channelLine);
    });
  });

  // 将所有行用换行符（\n）连接，生成最终的TXT文本
  // 如需兼容Windows换行符，可改用 \r\n
  return lines.join("\n");
}

function listMap(attr) {
  const newattr = [];
  list.forEach((item) => {
    attr.forEach((attrItem) => {
      if (attrItem.genre == item) {
        newattr.push(attrItem);
      }
    });
  });
  return newattr;
}

// 执行主函数
fetchLiveTxtAndConvertToJson();
