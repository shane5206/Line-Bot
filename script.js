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
    const formStatus = document.getElementById('formStatus');
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
    
    // 顯示表單提交狀態指示器
    function showFormStatus() {
        formStatus.style.display = 'flex';
    }
    
    // 隱藏表單提交狀態指示器
    function hideFormStatus() {
        formStatus.style.display = 'none';
    }
    
    // 監聽 iframe 載入完成事件
    hiddenIframe.addEventListener('load', function() {
        console.log('iframe 已載入完成');
        
        // 隱藏表單提交狀態指示器
        hideFormStatus();
        
        try {
            // 檢查 iframe 內容是否包含成功訊息
            const iframeContent = hiddenIframe.contentDocument || hiddenIframe.contentWindow.document;
            const iframeText = iframeContent.body.innerText || '';
            
            console.log('iframe 內容:', iframeText);
            
            // 如果 iframe 內容包含特定文字，表示提交成功
            if (iframeText.includes('感謝您') || iframeText.includes('您的回覆已記錄') || 
                iframeText.includes('Thank you') || iframeText.includes('Your response has been recorded')) {
                // 顯示成功消息
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // 重置表單
                orderForm.reset();
                
                // 重置提交按鈕狀態
                const submitButton = orderForm.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = '提交訂單';
                
                // 移除提交中的視覺效果
                orderForm.classList.remove('submitting');
                
                // 3秒後隱藏成功消息
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
                
                console.log('表單提交成功');
            } else {
                // 如果沒有找到成功訊息，可能是提交失敗
                console.log('表單提交可能失敗，iframe 內容不包含成功訊息');
                
                // 顯示成功消息（因為 Google 表單可能不會返回明確的成功訊息）
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // 重置表單
                orderForm.reset();
                
                // 重置提交按鈕狀態
                const submitButton = orderForm.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = '提交訂單';
                
                // 移除提交中的視覺效果
                orderForm.classList.remove('submitting');
                
                // 3秒後隱藏成功消息
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        } catch (e) {
            // 如果無法讀取 iframe 內容（可能是因為跨域限制），假設提交成功
            console.log('無法讀取 iframe 內容，可能是因為跨域限制:', e);
            
            // 顯示成功消息
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            
            // 重置表單
            orderForm.reset();
            
            // 重置提交按鈕狀態
            const submitButton = orderForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = '提交訂單';
            
            // 移除提交中的視覺效果
            orderForm.classList.remove('submitting');
            
            // 3秒後隱藏成功消息
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
            
            console.log('假設表單提交成功');
        }
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
        
        // 添加表單提交中的視覺效果
        orderForm.classList.add('submitting');
        
        // 顯示表單提交狀態指示器
        showFormStatus();
        
        // 添加控制台日誌
        console.log('表單正在提交...');
        console.log('表單數據:', new FormData(orderForm));
        
        // 表單會自動提交到隱藏的 iframe
        // 不需要額外的 fetch 請求
        
        // 設置超時處理，以防 iframe 載入事件沒有觸發
        setTimeout(() => {
            // 如果 10 秒後按鈕仍然處於禁用狀態，則假設提交成功
            if (submitButton.disabled) {
                console.log('表單提交超時，假設提交成功');
                
                // 隱藏表單提交狀態指示器
                hideFormStatus();
                
                // 顯示成功消息
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // 重置表單
                orderForm.reset();
                
                // 重置提交按鈕狀態
                submitButton.disabled = false;
                submitButton.textContent = '提交訂單';
                
                // 移除提交中的視覺效果
                orderForm.classList.remove('submitting');
                
                // 3秒後隱藏成功消息
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        }, 10000);
    });
    
    // 添加表單重置事件處理
    orderForm.addEventListener('reset', function() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // 隱藏表單提交狀態指示器
        hideFormStatus();
        
        // 重置提交按鈕狀態
        const submitButton = orderForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = '提交訂單';
        
        // 移除提交中的視覺效果
        orderForm.classList.remove('submitting');
        
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