// 請將此替換為你部署的 Google Apps Script API 的 URL。
// 這個 URL 將用於處理試算表查詢。
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzaCq3HU_9nwm9pE3E1m9cPDFGqw3qV4hhQ1EwBZJGyIrVnLsduiTW0R0NzREz1R7kD/exec'; 
 
// 取得網頁上的 HTML 元素參考
const nameInput = document.getElementById('nameInput');
const queryButton = document.getElementById('queryButton');
const resultDiv = document.getElementById('result');

// 為查詢按鈕添加點擊事件監聽器
queryButton.addEventListener('click', queryData);

// 允許在輸入框中按 Enter 鍵觸發查詢
nameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        queryData();
    }
});

/**
 * 執行資料查詢的非同步函式。
 * 它會向 Apps Script API 發送請求，並在網頁上顯示查詢結果。
 */
async function queryData() {
    const name = nameInput.value.trim(); // 取得輸入框中的值，並移除前後空白
    resultDiv.innerHTML = ''; // 清空之前的查詢結果

    if (!name) {
        resultDiv.innerHTML = '<span class="error">請輸入姓名才能查詢喔！</span>';
        resultDiv.style.color = '#dc3545';
        return;
    }

    // 顯示載入中的訊息
    resultDiv.innerHTML = '查詢中...';
    resultDiv.style.color = '#555';

    try {
        // 使用 fetch API 向你的 Apps Script URL 發送 GET 請求
        // 將查詢的姓名作為 URL 參數傳遞 (例如: ?name=張三)
        const response = await fetch(`${APPS_SCRIPT_URL}?name=${encodeURIComponent(name)}`);

        // 檢查 HTTP 回應是否成功 (例如 HTTP 狀態碼 200 OK)
        if (!response.ok) {
            throw new Error(`網路回應錯誤: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // 解析 Apps Script 返回的 JSON 格式資料

        if (data.found) {
            // 如果找到資料，顯示姓名和金額
            resultDiv.innerHTML = `姓名：${data.name}<br>金額：${data.amount}`;
            resultDiv.style.color = '#0056b3';
        } else {
            // 如果找不到資料，顯示找不到的訊息
            resultDiv.innerHTML = `<span class="error">找不到姓名為「${name}」的資料。</span>`;
            resultDiv.style.color = '#dc3545';
        }
    } catch (error) {
        // 捕獲並處理查詢過程中可能發生的任何錯誤 (例如網路連線問題)
        console.error('查詢失敗:', error);
        resultDiv.innerHTML = '<span class="error">查詢失敗，請檢查網路或稍後再試。</span>';
        resultDiv.style.color = '#dc3545';
    }
}
