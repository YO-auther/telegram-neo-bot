let currentScene = 'intro';

async function performAction(action) {
    // Анимация нажатия
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
        btn.style.opacity = '0.5';
        btn.disabled = true;
    });

    try {
        const response = await fetch('/api/show/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                scene: currentScene
            })
        });
        
        const data = await response.json();
        
        // Обновляем текст шоу с анимацией
        const textElement = document.getElementById('show-text');
        textElement.style.opacity = '0';
        setTimeout(() => {
            textElement.textContent = data.text;
            textElement.style.opacity = '1';
        }, 200);
        
        // Обновляем кнопки
        const actionsPanel = document.getElementById('actions-panel');
        actionsPanel.innerHTML = '';
        
        data.actions.forEach(actionText => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = actionText;
            btn.onclick = () => performAction(actionText);
            actionsPanel.appendChild(btn);
        });
        
        // Обновляем текущую сцену (просто для логики, сервер сам управляет)
        // Но сервер не возвращает новую сцену, поэтому делаем небольшой костыль
        if (action === '🏠 Закрыть шоу') {
            setTimeout(() => {
                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.close();
                } else {
                    alert('Шоу окончено! Закройте окно.');
                }
            }, 1500);
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('show-text').textContent = 
            'ОЙ! Кажется, мой процессор перегрелся. Попробуйте ещё раз. 🤖💥';
    } finally {
        setTimeout(() => {
            const btns = document.querySelectorAll('.action-btn');
            btns.forEach(btn => {
                btn.style.opacity = '1';
                btn.disabled = false;
            });
        }, 300);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Начальные кнопки (intro)
    const initialActions = ['👋 Помахать Нео', '🎭 Рассказать о себе', '💀 Спровоцировать монстра', '🍿 Просто смотреть'];
    const actionsPanel = document.getElementById('actions-panel');
    
    initialActions.forEach(actionText => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = actionText;
        btn.onclick = () => performAction(actionText);
        actionsPanel.appendChild(btn);
    });
    
    // Сообщаем Telegram WebApp, что мы готовы
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});