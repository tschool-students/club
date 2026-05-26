# 部署指南 — tschool-clubs 社團總覽

---

## 一、Google Sheet 欄位設計

### 1-1. 建立試算表

新增一個 Google 試算表，**第一列為欄位標頭**，從第二列起每一列代表一個社團。

### 1-2. 欄位說明

| 欄位名稱 | 必填 | 說明 | 範例 |
|---|---|---|---|
| `id` | 否 | 社團唯一識別碼（留空會自動產生）| `programming` |
| `name` | **是** | 社團名稱 | `程式設計社` |
| `category` | **是** | 分類標籤（**直接決定前端篩選按鈕**）| `學術` |
| `description` | 否 | 社團簡介 | `學習演算法與競賽程式設計` |
| `charter_url` | 否 | 社團章程連結（Google Doc 或任意 URL）| `https://docs.google.com/...` |
| `cover_image` | 否 | 封面圖片的直接圖片 URL（非 Drive 預覽頁）| `https://images.unsplash.com/...` |
| `gallery` | 否 | 相簿圖片，**以半形逗號 `,` 分隔多張 URL** | `https://img1.jpg,https://img2.jpg` |
| `instagram` | 否 | Instagram 個人檔案連結 | `https://instagram.com/club` |
| `facebook` | 否 | Facebook 粉絲頁連結 | `https://facebook.com/club` |
| `youtube` | 否 | YouTube 頻道連結 | `https://youtube.com/@club` |
| `discord` | 否 | Discord 邀請連結 | `https://discord.gg/xxxxx` |
| `line` | 否 | LINE 官方帳號或群組連結 | `https://line.me/...` |
| `officer1_role` | 否 | 第 1 位幹部職稱 | `社長` |
| `officer1_name` | 否 | 第 1 位幹部姓名 | `陳小明` |
| `officer2_role` | 否 | 第 2 位幹部職稱 | `副社長` |
| `officer2_name` | 否 | 第 2 位幹部姓名 | `林小華` |
| `officer3_role` ~ `officer10_role` | 否 | 最多支援 10 位幹部 | |
| `officer3_name` ~ `officer10_name` | 否 | | |

> **分類標籤說明**：`category` 欄填什麼，前端就會動態新增一個篩選按鈕。例如填 `學術`、`藝術`、`體育`、`服務`，頁面上就會出現這四個按鈕。不需要事先設定，完全由 Sheet 資料決定。

### 1-3. 試算表格式（固定 4 行結構）

試算表**前 4 行**請照以下格式固定填寫，從**第 5 行**起才是社團資料：

```
官網後台資料：社團資訊彙整,,,,,,,,,,,,,,
,,,,,,,,,,,,,,
序號,社團名稱,類別,敘述,更多資訊,,,Instagram 帳號,Facebook 帳號,Discord 帳號,Line 帳號,第一負責人職稱,第一負責人姓名,第二負責人職稱,第二負責人姓名
id,name,category,description,charter_url,cover_image,gallery,instagram,facebook,discord,line,officer1_role,officer1_name,officer2_role,officer2_name
programming,程式設計社,學術,學習演算法與競賽程式設計,https://docs.google.com/xxx,https://images.unsplash.com/photo-xxx,https://img1.jpg,https://instagram.com/prog,,,, 社長,陳小明,副社長,林小華
photography,攝影社,藝術,探索光影藝術記錄美好瞬間,,https://images.unsplash.com/photo-yyy,,https://instagram.com/photo,,,, 社長,張美玲,,
```

> 第 1 行為標題說明、第 2 行為空白、第 3 行為中文欄位說明、**第 4 行為程式讀取的欄位名稱**（不可修改）。

---

## 二、發布 Google Sheet 為公開 CSV

1. 開啟試算表 → 上方選單「**檔案**」→「**共用**」→「**發布到網路**」
2. 「連結」下拉選擇你的工作表（預設 Sheet1）
3. 格式選「**逗號分隔值 (.csv)**」
4. 按下「**發布**」，複製產生的 URL

URL 格式：
```
https://docs.google.com/spreadsheets/d/e/{SHEET_ID}/pub?gid=0&single=true&output=csv
```

> 試算表本身**不需要公開**，只需「發布到網路」即可。資料變更後約 **1–5 分鐘**生效。

---

## 三、本地開發

```bash
# 1. 複製範本
cp .env.local.example .env.local

# 2. 填入你的 Google Sheet CSV URL
# 編輯 .env.local，將 {YOUR_SHEET_ID} 替換成實際的 Sheet ID

# 3. 安裝依賴
pnpm install

# 4. 啟動開發伺服器
pnpm dev
```

若未設定 `CLUBS_SHEET_URL`，頁面會自動使用 `lib/club-data.ts` 中的靜態資料作為備用。

---

## 四、部署到 Vercel

### 4-1. 一鍵部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 4-2. 手動步驟

1. 將程式碼推送到 GitHub
2. 至 [vercel.com](https://vercel.com) 匯入該 repository
3. 在「**Environment Variables**」中新增：

   | 名稱 | 值 |
   |---|---|
   | `CLUBS_SHEET_URL` | 步驟二取得的 CSV URL |

4. 按下「**Deploy**」

### 4-3. 更新環境變數後重新部署

變更 Sheet URL 後，在 Vercel 的「Settings → Environment Variables」更新值，然後到「Deployments」手動觸發 Redeploy。

---

## 五、快取與更新機制

| 項目 | 說明 |
|---|---|
| ISR 重新驗證週期 | **5 分鐘**（`revalidate = 300`，設定於 `app/page.tsx`）|
| 修改週期 | 可在 `app/page.tsx` 調整 `export const revalidate` 的秒數 |
| 防快取 | `fetch-clubs.ts` 的 URL 附加 `t=Date.now()`，確保每次 ISR 觸發時抓到最新 CSV |
| 錯誤備援 | 若 Sheet 無法存取，自動 fallback 至 `lib/club-data.ts` 靜態資料 |

若需要**即時更新**（不等 ISR），可將 `revalidate` 改為 `0`（每次請求都重新抓取），但這會增加頁面載入時間。

---

## 六、圖片注意事項

- `cover_image` 與 `gallery` 欄位需填入**可公開存取的直接圖片 URL**
- Google Drive 的分享連結**無法直接使用**，需轉換格式或改用其他圖床
- 推薦圖床：Imgur、Cloudinary、GitHub Raw
- Google Drive 轉換方式：分享連結中的 `id=FILE_ID` → `https://drive.google.com/uc?export=view&id=FILE_ID`

### 圖片比例建議

圖片使用 `object-cover object-center`，會從中心自動裁切填滿顯示區域，**任何比例都可使用**，但以下比例效果最佳：

#### 封面圖（`cover_image`）

| 項目 | 建議值 |
|---|---|
| **比例** | **4:3**（最佳）或 16:9 |
| 最小尺寸 | 800 × 600 px |
| 建議尺寸 | 1200 × 900 px |
| 最大檔案大小 | 500 KB |
| 格式 | JPG / WebP |

卡片縮圖顯示高度固定為 208px，主體請**置中構圖**，避免重要內容靠近邊緣被裁掉。

#### 相簿圖（`gallery`）

| 項目 | 建議值 |
|---|---|
| **比例** | **4:3**（配合彈窗左側顯示區） |
| 最小尺寸 | 800 × 600 px |
| 建議尺寸 | 1200 × 900 px |
| 最大檔案大小 | 800 KB |
| 格式 | JPG / WebP |
| 建議張數 | 3–8 張（超過 10 張載入明顯變慢） |

> 若社團照片大多是手機直拍（9:16），建議上傳前裁切為 4:3，或確保主體在畫面中央，系統會自動裁去上下。

---

## 七、新增或移除分類

**完全不需修改程式碼**。

在 Google Sheet 的 `category` 欄位填入新分類名稱（如 `服務性`），儲存後約 5 分鐘，前端篩選按鈕會自動出現「服務性」選項。刪除所有該分類的社團，按鈕也會自動消失。
