// --- 設定區塊 ---
const SPREADSHEET_ID = '1jt500QSTd0FsY6juvAwEVpGIrYdsV9xNwuOlKG0ZBaM';
const SHEET_NAME = '工作表1';

// 當瀏覽網頁網址時執行
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('紫皇天乙真慶宮 - 線上查詢')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 供前端呼叫的查詢函式
function searchSheet(name) {
  let results = []; // 用來存放所有符合的紀錄
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // 取得所有資料 (二維陣列)
    const data = sheet.getDataRange().getValues();
    const searchName = name.trim();

    // 從第 2 列開始跑 (索引 1)，檢查每一列
    for (let i = 1; i < data.length; i++) {
      let rowName = data[i][0].toString().trim(); // 第一欄姓名
      let rowAmount = data[i][1];                // 第二欄金額

      // 如果姓名符合，就把這筆資料塞進 results 陣列
      if (rowName === searchName) {
        results.push({
          name: data[i][0].toString(),
          amount: rowAmount
        });
      }
    }
    
    // 回傳結果物件給前端
    return { 
      found: results.length > 0, 
      list: results 
    };
    
  } catch (error) {
    console.error("錯誤：" + error.message);
    return { found: false, error: "伺服器錯誤" };
  }
}
