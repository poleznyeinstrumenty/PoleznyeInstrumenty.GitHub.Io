// script.js – Full functionality for all tools + theme switcher
(function() {
  // Определяем язык по пути
  const isEnglish = window.location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'ru';

  // Тема
  const html = document.documentElement;
  const body = document.body;
  const themeBtns = document.querySelectorAll('.theme-btn');

  function setTheme(mode) {
    if (mode === 'auto') {
      body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      body.classList.toggle('dark', mode === 'dark');
    }
    localStorage.setItem('theme', mode);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === mode);
    });
    // Показываем нужный логотип
    document.querySelectorAll('.logo-light, .logo-dark').forEach(el => {
      el.style.display = 'none';
    });
    if (body.classList.contains('dark')) {
      document.querySelector('.logo-dark').style.display = 'block';
    } else {
      document.querySelector('.logo-light').style.display = 'block';
    }
  }

  // Инициализация темы
  const savedTheme = localStorage.getItem('theme') || 'auto';
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  // Слушаем изменение системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'auto') setTheme('auto');
  });

  // ========== ИНСТРУМЕНТЫ ==========
  // Функция для получения значения инпута или текста результата
  const tools = {};

  // 1. Калькулятор
  tools.calculator = {
    input: document.getElementById('calc-display'),
    result: document.getElementById('calc-result'),
    init() {
      if (!this.input) return;
      this.input.addEventListener('keyup', () => {
        try {
          const val = this.input.value.replace(/[^-()\d/*+. ]/g, '');
          this.input.value = val;
          const res = Function('"use strict"; return (' + (val || '0') + ')')();
          this.result.textContent = '= ' + res;
        } catch(e) {
          this.result.textContent = lang==='ru'?'Ошибка':'Error';
        }
      });
    }
  };

  // 2. Конвертер температуры
  tools.tempConv = {
    input: document.getElementById('temp-input'),
    unitFrom: document.getElementById('temp-from'),
    unitTo: document.getElementById('temp-to'),
    result: document.getElementById('temp-result'),
    init() {
      if (!this.input) return;
      const update = () => {
        let val = parseFloat(this.input.value);
        if (isNaN(val)) { this.result.textContent = '—'; return; }
        const from = this.unitFrom.value;
        const to = this.unitTo.value;
        // В кельвины
        let kelvin = val;
        if (from === 'celsius') kelvin = val + 273.15;
        else if (from === 'fahrenheit') kelvin = (val - 32) * 5/9 + 273.15;
        // из кельвинов
        let out = kelvin;
        if (to === 'celsius') out = kelvin - 273.15;
        else if (to === 'fahrenheit') out = (kelvin - 273.15) * 9/5 + 32;
        this.result.textContent = out.toFixed(2) + ' °' + (to==='celsius'?'C':to==='fahrenheit'?'F':'K');
      };
      this.input.addEventListener('input', update);
      this.unitFrom.addEventListener('change', update);
      this.unitTo.addEventListener('change', update);
    }
  };

  // 3. Конвертер длины
  tools.lengthConv = {
    input: document.getElementById('length-input'),
    from: document.getElementById('length-from'),
    to: document.getElementById('length-to'),
    result: document.getElementById('length-result'),
    init() {
      if (!this.input) return;
      const factors = { m:1, km:0.001, cm:100, mm:1000, ft:3.28084, in:39.3701 };
      const update = () => {
        let val = parseFloat(this.input.value);
        if (isNaN(val)) { this.result.textContent = '—'; return; }
        const meters = val / factors[this.from.value];
        const out = meters * factors[this.to.value];
        this.result.textContent = out.toFixed(4) + ' ' + this.to.value;
      };
      this.input.addEventListener('input', update);
      this.from.addEventListener('change', update);
      this.to.addEventListener('change', update);
    }
  };

  // 4. Генератор паролей
  tools.passwordGen = {
    btn: document.getElementById('gen-pass-btn'),
    result: document.getElementById('pass-result'),
    init() {
      if (!this.btn) return;
      this.btn.addEventListener('click', () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let pass = '';
        for (let i=0; i<16; i++) pass += chars[Math.floor(Math.random()*chars.length)];
        this.result.textContent = pass;
      });
    }
  };

  // 5. Секундомер
  tools.stopwatch = {
    display: document.getElementById('stopwatch-display'),
    startBtn: document.getElementById('stopwatch-start'),
    resetBtn: document.getElementById('stopwatch-reset'),
    interval: null,
    seconds: 0,
    init() {
      if (!this.display) return;
      const updateDisplay = () => {
        const h = String(Math.floor(this.seconds/3600)).padStart(2,'0');
        const m = String(Math.floor((this.seconds%3600)/60)).padStart(2,'0');
        const s = String(this.seconds%60).padStart(2,'0');
        this.display.textContent = h+':'+m+':'+s;
      };
      this.startBtn.addEventListener('click', () => {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
          this.startBtn.textContent = lang==='ru'?'Старт':'Start';
        } else {
          this.interval = setInterval(() => { this.seconds++; updateDisplay(); }, 1000);
          this.startBtn.textContent = lang==='ru'?'Пауза':'Pause';
        }
      });
      this.resetBtn.addEventListener('click', () => {
        if (this.interval) { clearInterval(this.interval); this.interval = null; this.startBtn.textContent = lang==='ru'?'Старт':'Start'; }
        this.seconds = 0;
        updateDisplay();
      });
    }
  };

  // 6. Текстовый анализатор
  tools.textAnalyzer = {
    input: document.getElementById('text-analyzer-input'),
    chars: document.getElementById('char-count'),
    words: document.getElementById('word-count'),
    sentences: document.getElementById('sentence-count'),
    init() {
      if (!this.input) return;
      this.input.addEventListener('input', () => {
        const text = this.input.value;
        this.chars.textContent = text.length;
        this.words.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
        this.sentences.textContent = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || []).length : 0;
      });
    }
  };

  // 7. Конвертер регистров
  tools.caseConv = {
    input: document.getElementById('case-input'),
    upperBtn: document.getElementById('upper-btn'),
    lowerBtn: document.getElementById('lower-btn'),
    capitalizeBtn: document.getElementById('capitalize-btn'),
    output: document.getElementById('case-output'),
    init() {
      if (!this.input) return;
      this.upperBtn.addEventListener('click', () => this.output.value = this.input.value.toUpperCase());
      this.lowerBtn.addEventListener('click', () => this.output.value = this.input.value.toLowerCase());
      this.capitalizeBtn.addEventListener('click', () => {
        this.output.value = this.input.value.replace(/\b\w/g, c => c.toUpperCase());
      });
    }
  };

  // Инициализация всех инструментов
  Object.values(tools).forEach(tool => tool.init?.());

  // Анимация появления при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tool-card').forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
})();