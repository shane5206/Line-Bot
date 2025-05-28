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
    let itemCounter = 1;

    addItemBtn.addEventListener('click', function() {
        itemCounter++;
        const newItem = document.createElement('div');
        newItem.className = 'order-item';
        newItem.innerHTML = `
            <select name="entry.915539579_${itemCounter}" required>
                <option value="" disabled selected>選擇項目</option>
                <option value="項目A">項目A</option>
                <option value="項目B">項目B</option>
                <option value="項目C">項目C</option>
                <option value="項目D">項目D</option>
            </select>
            <input type="number" name="entry.915539579_quantity_${itemCounter}" min="1" value="1" required>
            <button type="button" class="btn-remove">刪除</button>
        `;
        
        // 將新增的項目插入到「新增項目」按鈕之前
        orderItemsContainer.insertBefore(newItem, addItemBtn);
        
        // 為刪除按鈕添加事件監聽器
        const removeBtn = newItem.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            newItem.remove();
        });
    });

    // 照片上傳預覽功能
    const photoUpload = document.getElementById('photoUpload');
    const filePreview = document.getElementById('filePreview');
    const photoUploadField = document.querySelector('input[name="entry.1027703396"]');
    
    // 創建一個隱藏欄位用於存儲上傳的文件信息
    if (!photoUploadField) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = 'entry.1027703396';
        hiddenField.id = 'photoUploadField';
        photoUpload.parentNode.appendChild(hiddenField);
    }
    
    // 存儲上傳的文件信息
    let uploadedFiles = [];
    
    photoUpload.addEventListener('change', function() {
        filePreview.innerHTML = '';
        uploadedFiles = [];
        
        if (this.files) {
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                
                // 檢查文件類型
                if (!file.type.match('image.*')) {
                    continue;
                }
                
                // 檢查文件大小 (限制為 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert(`文件 ${file.name} 超過 5MB 大小限制，將不會被上傳。`);
                    continue;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.title = file.name;
                    
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'preview-item';
                    imgContainer.appendChild(img);
                    
                    filePreview.appendChild(imgContainer);
                    
                    // 模擬文件上傳到 Google Drive 並獲取文件 ID
                    // 注意：這只是一個模擬，實際應用中需要使用 Google Drive API
                    const fileId = 'file_' + Math.random().toString(36).substring(2, 15);
                    uploadedFiles.push([fileId, file.name, file.type]);
                    
                    // 更新隱藏欄位的值
                    const photoUploadField = document.getElementById('photoUploadField');
                    if (photoUploadField) {
                        photoUploadField.value = JSON.stringify(uploadedFiles);
                    }
                };
                
                reader.readAsDataURL(file);
            }
        }
    });

    // 表單提交處理
    const orderForm = document.getElementById('orderForm');
    
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
    
    // 表單提交事件處理
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 檢查表單是否有效
        if (!orderForm.checkValidity()) {
            // 觸發瀏覽器的原生表單驗證
            orderForm.reportValidity();
            return;
        }

        // 顯示提交中的狀態
        const submitButton = orderForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = '提交中...';
        
        // 獲取表單數據
        const formData = new FormData(orderForm);
        
        // 使用 fetch API 提交表單
        fetch(orderForm.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // 這是必要的，因為 Google 表單不允許跨域請求
        })
        .then(() => {
            // 由於使用了 no-cors 模式，我們無法獲取響應狀態
            // 但我們可以假設表單已成功提交
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            
            // 重置表單
            orderForm.reset();
            filePreview.innerHTML = '';
            uploadedFiles = [];
            
            // 重置提交按鈕狀態
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // 3秒後隱藏成功消息
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);

            // 添加控制台日誌
            console.log('表單提交成功');
        })
        .catch(error => {
            console.error('提交表單時發生錯誤:', error);
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            
            // 重置提交按鈕狀態
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // 3秒後隱藏錯誤消息
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        });
    });
    
    // 添加表單重置事件處理
    orderForm.addEventListener('reset', function() {
        filePreview.innerHTML = '';
        uploadedFiles = [];
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
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
        
        .preview-item {
            position: relative;
            display: inline-block;
        }
        
        .preview-item img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
    `;
    document.head.appendChild(style);
}); 