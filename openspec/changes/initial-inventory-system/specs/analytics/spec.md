## ADDED Requirements

### Requirement: 歷史價格分析
系統 SHALL 提供歷史進貨價格（PriceHistory）分析功能。

#### Scenario: 自動記錄歷史價格
- **WHEN** 進貨單完成
- **THEN** 系統自動記錄該次進貨的廠商、產品、日期、單價

#### Scenario: 價格趨勢查詢
- **WHEN** 使用者查詢產品的價格趨勢
- **THEN** 系統顯示該產品在不同時期的進貨價格
- **AND** 依日期排序

### Requirement: 比價分析
系統 SHALL 提供比價分析（PriceComparison）功能，比較不同廠商的價格。

#### Scenario: 供應商比價
- **WHEN** 使用者選擇產品進行比價
- **THEN** 系統顯示不同廠商提供該產品的價格
- **AND** 顯示歷史價格與最新價格

#### Scenario: 最佳供應商推薦
- **WHEN** 系統分析歷史價格
- **THEN** 系統可推薦最具價格優勢的廠商

### Requirement: 部門支出分析
系統 SHALL 提供部門支出（DepartmentExpense）分析功能。

#### Scenario: 月度支出彙整
- **WHEN** 系統執行月度彙整
- **THEN** 系統按館別/部門彙整進貨金額
- **AND** 包含稅額與總金額

#### Scenario: 部門支出報表
- **WHEN** 使用者查詢部門支出報表
- **THEN** 系統顯示各部門的月度支出情況
- **AND** 可比較不同月份的支出變化

### Requirement: 營運儀表板
系統 SHALL 提供儀表板（DashboardData）功能，顯示關鍵營運指標。

#### Scenario: 月度進貨總額
- **WHEN** 使用者查看儀表板
- **THEN** 系統顯示本月進貨總額
- **AND** 可與上月或去年同期比較

#### Scenario: 月度銷貨總額
- **WHEN** 使用者查看儀表板
- **THEN** 系統顯示本月銷貨總額
- **AND** 可與上月或去年同期比較

#### Scenario: 毛利指標
- **WHEN** 使用者查看儀表板
- **THEN** 系統顯示本月毛利與毛利率
- **AND** 顯示各產品或部門的毛利貢獻

#### Scenario: KPI 趨勢分析
- **WHEN** 系統累積歷史資料
- **THEN** 系統可產生趨勢圖表
- **AND** 支援月度/年度比較

### Requirement: 成本分析
系統 SHALL 提供成本分析功能。

#### Scenario: 平均進貨價計算
- **WHEN** 使用者查詢產品的平均進貨價
- **THEN** 系統計算該產品所有進貨紀錄的平均單價
- **AND** 可指定時間範圍

#### Scenario: 成本變動分析
- **WHEN** 使用者查看成本變動
- **THEN** 系統顯示產品成本的趨勢與變動幅度

