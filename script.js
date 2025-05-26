document.addEventListener('DOMContentLoaded', () => {
    // 游戏状态变量
    let currentLevel = 1;
    let isPressed = false;
    let feedbackElements = [];
    let clickedElementsCount = 0;
    
    // DOM 元素引用
    const gameContainer = document.getElementById('gameContainer');
    const levelInfo = document.getElementById('levelInfo');
    const instructions = document.getElementById('instructions');
    const levelCompleteModal = document.getElementById('levelComplete');
    const levelCompleteText = document.getElementById('levelCompleteText');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    
    // 设备类型检测
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 设置事件监听器
    if (isMobile) {
        gameContainer.addEventListener('touchstart', handlePress);
        gameContainer.addEventListener('touchend', handleRelease);
    } else {
        gameContainer.addEventListener('mousedown', handlePress);
        gameContainer.addEventListener('mouseup', handleRelease);
        // 防止右键菜单弹出
        gameContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // 初始关卡设置
    updateLevelDisplay();
    
    // 3秒后隐藏操作指引
    setTimeout(() => {
        instructions.style.opacity = '0';
    }, 3000);
    
    // 下一关按钮事件
    nextLevelBtn.addEventListener('click', () => {
        levelCompleteModal.classList.remove('show');
        startNewLevel();
    });
    
    /**
     * 处理按下事件（鼠标或触摸）
     */
    function handlePress(event) {
        if (isPressed) return;
        isPressed = true;
        
        // 阻止默认行为和事件冒泡
        event.preventDefault();
        
        // 获取点击坐标
        const pressPosition = getPressPosition(event);
        
        // 生成当前关卡数量的反馈元素
        for (let i = 0; i < currentLevel; i++) {
            createFeedbackElement(pressPosition);
        }
    }
    
    /**
     * 处理释放事件（鼠标或触摸）
     */
    function handleRelease() {
        if (!isPressed) return;
        isPressed = false;
        
        // 移除所有未点击的反馈元素
        removeUnclickedElements();
        
        // 重置计数器
        clickedElementsCount = 0;
        feedbackElements = [];
    }
    
    /**
     * 获取点击坐标
     */
    function getPressPosition(event) {
        let x, y;
        
        if (event.type.includes('touch')) {
            // 触摸事件
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            // 鼠标事件
            x = event.clientX;
            y = event.clientY;
        }
        
        return { x, y };
    }
    
    /**
     * 生成反馈元素（距离点击点至少50px）
     */
    function createFeedbackElement(pressPosition) {
        const element = document.createElement('div');
        element.className = 'feedback-element';
        element.innerText = '打不到我呀！';
        
        // 尝试生成位置，最多重试10次
        let validPosition = false;
        let attempts = 0;
        let position;
        
        while (!validPosition && attempts < 10) {
            position = generateRandomPosition();
            const distance = calculateDistance(position, pressPosition);
            
            // 检查是否距离点击位置至少50px
            if (distance >= 50) {
                validPosition = true;
            }
            
            attempts++;
        }
        
        // 设置元素位置
        element.style.left = `${position.x}px`;
        element.style.top = `${position.y}px`;
        
        // 添加点击事件监听器
        element.addEventListener('click', (e) => handleElementClick(e, element));
        element.addEventListener('touchstart', (e) => handleElementClick(e, element), { passive: false });
        
        // 添加到游戏容器并存储引用
        gameContainer.appendChild(element);
        feedbackElements.push(element);
    }
    
    /**
     * 生成随机位置
     */
    function generateRandomPosition() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const elementWidth = 100; // 与CSS中的宽度对应
        const elementHeight = 40; // 与CSS中的高度对应
        
        // 确保元素完全在视口内
        const maxX = containerWidth - elementWidth;
        const maxY = containerHeight - elementHeight;
        
        const x = Math.max(0, Math.floor(Math.random() * maxX));
        const y = Math.max(0, Math.floor(Math.random() * maxY));
        
        return { x, y };
    }
    
    /**
     * 计算两点间距离
     */
    function calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 处理反馈元素被点击
     */
    function handleElementClick(event, element) {
        // 阻止事件冒泡以避免触发释放事件
        event.stopPropagation();
        
        if (event.type === 'touchstart') {
            // 阻止默认行为以避免触发鼠标事件
            event.preventDefault();
        }
        
        // 如果已经被点击，则忽略
        if (element.classList.contains('clicked')) {
            return;
        }
        
        // 标记为已点击
        element.classList.add('clicked');
        clickedElementsCount++;
        
        // 动画结束后移除元素
        setTimeout(() => {
            element.remove();
        }, 300);
        
        // 检查是否所有元素都被点击
        if (clickedElementsCount === currentLevel) {
            setTimeout(showLevelComplete, 500);
        }
    }
    
    /**
     * 移除所有未点击的元素
     */
    function removeUnclickedElements() {
        feedbackElements.forEach(element => {
            if (!element.classList.contains('clicked')) {
                element.remove();
            }
        });
    }
    
    /**
     * 显示关卡完成弹窗
     */
    function showLevelComplete() {
        currentLevel++;
        levelCompleteText.innerText = `进入第 ${currentLevel} 关`;
        levelCompleteModal.classList.add('show');
    }
    
    /**
     * 更新关卡显示
     */
    function updateLevelDisplay() {
        levelInfo.innerText = `第 ${currentLevel} 关`;
    }
    
    /**
     * 开始新关卡
     */
    function startNewLevel() {
        updateLevelDisplay();
    }
}); 