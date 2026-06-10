// ======================== ТЕМА ========================
function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
    else setTheme('system');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            if (current === 'light') setTheme('dark');
            else if (current === 'dark') setTheme('system');
            else setTheme('light');
        });
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') setTheme('system');
    });
}

// ======================== ИНСТРУМЕНТЫ (20 русских + 20 английских) ========================
const toolsData = {
    ru: [
        { name: 'Калькулятор процентов', fields: ['Сумма', 'Процент'], compute: (v) => `${(v[0] * v[1] / 100).toFixed(2)}` },
        { name: 'Конвертер валют (USD→RUB)', fields: ['Сумма USD'], compute: (v) => `${(v[0] * 92.5).toFixed(2)} RUB` },
        { name: 'ИМТ (Индекс массы тела)', fields: ['Вес (кг)', 'Рост (м)'], compute: (v) => { let bmi = v[0]/(v[1]*v[1]); return `${bmi.toFixed(2)} (${bmi<18.5?'Недостаток':bmi<25?'Норма':bmi<30?'Избыток':'Ожирение'})`; } },
        { name: 'Генератор пароля', fields: ['Длина (6-20)'], compute: (v) => { let len = Math.min(20,Math.max(6,v[0])); let chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'; return Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); } },
        { name: 'Конвертер длины (м→ft)', fields: ['Метры'], compute: (v) => `${(v[0]*3.28084).toFixed(2)} ft` },
        { name: 'Конвертер температуры (°C→°F)', fields: ['°C'], compute: (v) => `${(v[0]*9/5+32).toFixed(1)} °F` },
        { name: 'Калькулятор возраста', fields: ['Год рождения'], compute: (v) => `${new Date().getFullYear()-v[0]} лет` },
        { name: 'Генератор QR кода', fields: ['Текст или URL'], compute: (v) => `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(v[0])}" alt="QR">` },
        { name: 'Конвертер систем счисления', fields: ['Число (dec)'], compute: (v) => `Hex: ${Number(v[0]).toString(16).toUpperCase()}, Bin: ${Number(v[0]).toString(2)}` },
        { name: 'Таймер слов (сек на слово)', fields: ['Слов в минуту'], compute: (v) => `${(60/v[0]).toFixed(1)} сек/слово` },
        { name: 'Скидка на товар', fields: ['Цена', 'Скидка %'], compute: (v) => `${(v[0]*(100-v[1])/100).toFixed(2)} руб` },
        { name: 'Конвертер объёма (л→гал)', fields: ['Литры'], compute: (v) => `${(v[0]*0.264172).toFixed(2)} gal` },
        { name: 'Конвертер скорости (км/ч→миль/ч)', fields: ['км/ч'], compute: (v) => `${(v[0]*0.621371).toFixed(2)} mph` },
        { name: 'Площадь круга', fields: ['Радиус'], compute: (v) => `${(Math.PI * v[0]**2).toFixed(2)} кв. ед.` },
        { name: 'Давление (атм→Па)', fields: ['атм'], compute: (v) => `${(v[0]*101325).toFixed(0)} Па` },
        { name: 'Энергия (Дж→кал)', fields: ['Джоули'], compute: (v) => `${(v[0]*0.239006).toFixed(2)} кал` },
        { name: 'Расход топлива (л/100км→mpg)', fields: ['л/100км'], compute: (v) => `${(235.214583/v[0]).toFixed(1)} mpg` },
        { name: 'Размер текста в байтах', fields: ['Текст'], compute: (v) => `${new Blob([v[0]]).size} байт` },
        { name: 'Конвертер веса (кг→фунт)', fields: ['кг'], compute: (v) => `${(v[0]*2.20462).toFixed(2)} lb` },
        { name: 'Калькулятор времени (дни→часы)', fields: ['Дни'], compute: (v) => `${v[0]*24} часов` }
    ],
    en: [
        { name: 'Percentage Calculator', fields: ['Amount', 'Percent (%)'], compute: (v) => `${(v[0] * v[1] / 100).toFixed(2)}` },
        { name: 'Currency Converter (USD→EUR)', fields: ['USD'], compute: (v) => `${(v[0] * 0.92).toFixed(2)} EUR` },
        { name: 'BMI Calculator', fields: ['Weight (kg)', 'Height (m)'], compute: (v) => { let bmi = v[0]/(v[1]*v[1]); return `${bmi.toFixed(2)} (${bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese'})`; } },
        { name: 'Password Generator', fields: ['Length (6-20)'], compute: (v) => { let len = Math.min(20,Math.max(6,v[0])); let chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'; return Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); } },
        { name: 'Length Converter (m→ft)', fields: ['Meters'], compute: (v) => `${(v[0]*3.28084).toFixed(2)} ft` },
        { name: 'Temperature Converter (°C→°F)', fields: ['°C'], compute: (v) => `${(v[0]*9/5+32).toFixed(1)} °F` },
        { name: 'Age Calculator', fields: ['Birth year'], compute: (v) => `${new Date().getFullYear()-v[0]} years` },
        { name: 'QR Code Generator', fields: ['Text or URL'], compute: (v) => `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(v[0])}" alt="QR">` },
        { name: 'Numeral System Converter', fields: ['Decimal number'], compute: (v) => `Hex: ${Number(v[0]).toString(16).toUpperCase()}, Bin: ${Number(v[0]).toString(2)}` },
        { name: 'Words Timer (sec per word)', fields: ['Words per minute'], compute: (v) => `${(60/v[0]).toFixed(1)} sec/word` },
        { name: 'Discount Calculator', fields: ['Price', 'Discount %'], compute: (v) => `${(v[0]*(100-v[1])/100).toFixed(2)} ${v[0]<1000?'USD':'EUR'}` },
        { name: 'Volume Converter (L→gal)', fields: ['Liters'], compute: (v) => `${(v[0]*0.264172).toFixed(2)} gal` },
        { name: 'Speed Converter (km/h→mph)', fields: ['km/h'], compute: (v) => `${(v[0]*0.621371).toFixed(2)} mph` },
        { name: 'Circle Area', fields: ['Radius'], compute: (v) => `${(Math.PI * v[0]**2).toFixed(2)} sq units` },
        { name: 'Pressure (atm→Pa)', fields: ['atm'], compute: (v) => `${(v[0]*101325).toFixed(0)} Pa` },
        { name: 'Energy (J→cal)', fields: ['Joules'], compute: (v) => `${(v[0]*0.239006).toFixed(2)} cal` },
        { name: 'Fuel Economy (L/100km→mpg)', fields: ['L/100km'], compute: (v) => `${(235.214583/v[0]).toFixed(1)} mpg` },
        { name: 'Text Size in Bytes', fields: ['Text'], compute: (v) => `${new Blob([v[0]]).size} bytes` },
        { name: 'Weight Converter (kg→lb)', fields: ['kg'], compute: (v) => `${(v[0]*2.20462).toFixed(2)} lb` },
        { name: 'Time Calculator (days→hours)', fields: ['Days'], compute: (v) => `${v[0]*24} hours` }
    ]
};

function initTools(lang) {
    const grid = document.getElementById('tools-grid');
    if (!grid) return;
    const tools = toolsData[lang] || toolsData.ru;
    grid.innerHTML = '';
    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `<h3>${tool.name}</h3>`;
        const inputs = [];
        tool.fields.forEach((label, idx) => {
            const input = document.createElement('input');
            input.placeholder = label;
            input.type = 'text';
            input.id = `in_${Date.now()}_${idx}`;
            card.appendChild(input);
            inputs.push(input);
        });
        const btn = document.createElement('button');
        btn.textContent = lang === 'ru' ? 'Вычислить' : 'Calculate';
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        btn.onclick = () => {
            const values = inputs.map(inp => parseFloat(inp.value) || 0);
            const res = tool.compute(values);
            resultDiv.innerHTML = typeof res === 'string' ? res : res;
        };
        card.appendChild(btn);
        card.appendChild(resultDiv);
        grid.appendChild(card);
    });
}