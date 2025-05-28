document.addEventListener('DOMContentLoaded', function() {
    // 初始化日期選擇器
    const datePicker = flatpickr("#deliveryDate", {
        locale: "zh-tw",
        dateFormat: "Y-m-d",
        minDate: "today",
        disableMobile: "true",
        allowInput: true,
        placeholder: "請選擇日期"
    });

    // 新增訂購項目功能
    const addItemBtn = document.getElementById('addItemBtn');
    const orderItemsContainer = document.querySelector('.order-items');
    const combinedItemsInput = document.getElementById('combinedItems');
    let itemCounter = 1;

    // 更新組合後的項目文字
    function updateCombinedItems() {
        const items = [];
        const orderItems = document.querySelectorAll('.order-item');
        
        orderItems.forEach(item => {
            const nameInput = item.querySelector('input[name="item_name"]');
            const quantityInput = item.querySelector('input[name="item_quantity"]');
            
            if (nameInput && nameInput.value.trim() && quantityInput && quantityInput.value) {
                items.push(`${nameInput.value.trim()} x ${quantityInput.value}`);
            }
        });
        
        // 將所有項目組合成一個字串，用換行符分隔
        combinedItemsInput.value = items.join('\n');
    }

    // 為所有項目輸入框添加事件監聽器
    function addItemInputListeners(item) {
        const inputs = item.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', updateCombinedItems);
        });
    }

    // 初始化第一個項目的監聽器
    addItemInputListeners(document.querySelector('.order-item'));

    addItemBtn.addEventListener('click', function() {
        itemCounter++;
        const newItem = document.createElement('div');
        newItem.className = 'order-item';
        newItem.innerHTML = `
            <input type="text" name="item_name" placeholder="請輸入項目名稱" required>
            <input type="number" name="item_quantity" min="1" value="1" required placeholder="數量">
            <button type="button" class="btn-remove">刪除</button>
        `;
        
        // 將新增的項目插入到「新增項目」按鈕之前
        orderItemsContainer.insertBefore(newItem, addItemBtn);
        
        // 為新項目添加事件監聽器
        addItemInputListeners(newItem);
        
        // 為刪除按鈕添加事件監聽器
        const removeBtn = newItem.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            newItem.remove();
            updateCombinedItems(); // 更新組合後的項目文字
        });
    });

    // 表單提交處理
    const orderForm = document.getElementById('orderForm');
    const hiddenIframe = document.getElementById('hidden_iframe');
    
    // 創建成功和錯誤消息元素
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = '表單已成功提交！感謝您的訂購。';
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = '提交表單時發生錯誤，請稍後再試。';
    
    // 將消息元素添加到表單前面
    orderForm.parentNode.insertBefore(successMessage, orderForm);
    orderForm.parentNode.insertBefore(errorMessage, orderForm);
    
    // 監聽 iframe 載入完成事件
    hiddenIframe.addEventListener('load', function() {
        // 假設表單提交成功
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // 重置表單
        orderForm.reset();
        
        // 重置提交按鈕狀態
        const submitButton = orderForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = '提交訂單';
        
        // 3秒後隱藏成功消息
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
        // 添加控制台日誌
        console.log('表單提交成功');
    });
    
    // 表單提交事件處理
    orderForm.addEventListener('submit', function(e) {
        // 更新組合後的項目文字
        updateCombinedItems();
        
        // 檢查表單是否有效
        if (!orderForm.checkValidity()) {
            // 觸發瀏覽器的原生表單驗證
            orderForm.reportValidity();
            return;
        }

        // 顯示提交中的狀態
        const submitButton = orderForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '提交中...';
        
        // 表單會自動提交到隱藏的 iframe
        // 不需要額外的 fetch 請求
    });
    
    // 添加表單重置事件處理
    orderForm.addEventListener('reset', function() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // 重置提交按鈕狀態
        const submitButton = orderForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = '提交訂單';
        
        // 重置組合後的項目文字
        setTimeout(updateCombinedItems, 0);
    });
    
    // 添加電話號碼驗證
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function() {
        // 移除非數字字符
        this.value = this.value.replace(/\D/g, '');
        
        // 限制長度為 10 位
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
    
    // 添加自定義樣式到刪除按鈕
    const style = document.createElement('style');
    style.textContent = `
        .btn-remove {
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s;
        }
        
        .btn-remove:hover {
            background-color: #c0392b;
        }
    `;
    document.head.appendChild(style);
}); 