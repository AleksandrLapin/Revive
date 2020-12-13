let AgeSlider, MoneySlider;

window.addEventListener("DOMContentLoaded", () => {
    AgeSlider = new Slider({
        className: "range-first",
        element: "range-input.range-first",
        step: 5,
        createBy: 1,
        minValue: 25,
        maxValue: 80,
        stepsID: "range-list",
        linkedField: "field.age.range-first",
        circs: {
            age: "field.age.range-first",
            lvl: "range-select.lvl.range-first",
            pay: null,
        },
        perks: {
            payout: "result-card.payout.range-first",
            lifeQuality: null,
            lifeLong: null,
        }
    }),
    MoneySlider = new Slider({
        className: "range-second",
        element: "range-input.range-second",
        step: 1,
        create: [0, 10, 50, 100, 500, 1000, 5000, 10000, 20000, 50000, 100000, Infinity],
        minValue: 0,
        maxValue: 110,
        stepsID: "range-money",
        linkedField: "range-select.money.range-second",
        circs: {
            age: "field.age.range-first",
            lvl: "range-select.lvl.range-first",
            pay: "range-select.money.range-second",
        },
        perks: {
            payout: "result-card.payout",
            lifeQuality: "result-card.life-quality",
            lifeLong: "result-card.life-long",
        }
    });

    InitCalc();
    InitDescription("range-select.lvl", "select-description", [
        "1 Уровень - Первый шаг на пути в здоровой и длинной жизни. Первичный опросник и опорные рекомендации по нему. Подключение - 0$, Ежемесячно - 49$ ",
        "2 Уровень - Персональные рекомендации на основе первичного опросника и базовых анализов. Подключение - 149$, Ежемесячно - 49$",
        "3 Уровень - Персональные рекомендации на основе расширенного опросника, прохождения интервью у врачей и сдачи расширенного списка анализов. Регулярный мониторинг изменений. Подключение - 499$, Ежемесячно - 249$",
        "4 Уровень - Персональные рекомендации на основе расширенного опросника, прохождения интервью у врачей и сдачи расширенного списка анализов. Регулярный мониторинг изменений и более глубокая адаптированная программа изменений. Подключение - 499$, Ежемесячно - 549$",
        "5 Уровень - Самый высокий уровнь погружения в проект. Максимальная персонализация на каждом уровне. Включает весь необходимый объем изменений: физические активности, питание, внешняя среда, экология и психологические аспекты достижения целей по здоровью. Подключение - 499$, Ежемесячно - 849$"
    ]);
    Calculate(
        "field.age.range-first",
        "range-select.lvl.range-first",
        "range-select.money.range-second"
    );
})



class Slider {
    constructor(args) {
        this.className = args.className;
        this.el = document.querySelector(`.${args.element}`);
        this.createBy = args.createBy;
        this.create = args.create;
        this.minValue = args.minValue;
        this.maxValue = args.maxValue;
        this.step = +args.step || 1;
        this.stepsID = args.stepsID;
        this.active = null;
        this.linkedField = document.querySelector(`.${args.linkedField}`);
        this.index = null;
        this.perks = {
            payout: document.querySelector(`.${args.perks.payout}`),
            lifeQuality: document.querySelector(`.${args.perks.lifeQuality}`),
            lifeLong: document.querySelector(`.${args.perks.lifeLong}`)
        };
        this.circs = {
            age: document.querySelector(`.${args.circs.age}`),
            lvl: document.querySelector(`.${args.circs.lvl}`),
            pay: document.querySelector(`.${args.circs.pay}`),
        };
        this.CreateAnchor();
        this.AddSteps();
        
        this.el.addEventListener("input", () => {
            this.UpdatePos();
        });
        
        if (this.linkedField) {
            this.linkedField.addEventListener("input", () => {
                this.UpdateRange();
            });
        }
        this.UpdatePos();
    }
    
    CreateAnchor() {
        this.anchor = document.createElement("div");
        this.anchor.className = "range-anchor";
        this.el.parentElement.appendChild(this.anchor);
    }
    
    AddSteps() {
        let
            _wrap = document.createElement("div"),
            _steps = document.createElement("datalist"),
            _stepsLabels = document.createElement("div");
        _wrap.className = "range";
        _steps.className = `${this.stepsID} range-data`;
        _steps.id = this.stepsID;
        _stepsLabels.className = "range-labels";
        
        this.el.parentElement.insertBefore(_wrap, this.el);
        _wrap.appendChild(this.el);
        _wrap.appendChild(this.anchor);
        _wrap.appendChild(_steps);
        _wrap.appendChild(_stepsLabels);
        this.el.setAttribute("list", this.stepsID);
        
        if (this.createBy) {
            for (let i = this.minValue; i <= this.maxValue; i += this.createBy) {
                let _step = document.createElement("option");
                if (i % this.step === 0) {
                    _step.className = `${this.stepsID}__item range-data__item ${this.className}`;
                    _step.dataset.value = i;
                    _stepsLabels.innerHTML += `<span>${i}</span>`;
                }
                _step.setAttribute("value", i);
                _steps.appendChild(_step);
            }
        } else if (this.create) {
            this.create.forEach(item => {
                let _step = document.createElement("option");
                _step.className = `${this.stepsID}__item range-data__item ${this.className}`;
                _step.dataset.value = item;
                _stepsLabels.innerHTML += item === Infinity ?
                    `<span class="infinity"></span>` :
                    `<span>${item}</span>`;
                _step.setAttribute("value", item);
                _steps.appendChild(_step);
            })
        }
    }
    
    UpdatePos() {
        let
            _index = this.create ? this.el.value / 10 : false,
            _classSelect = _index ? this.create[_index] : this.el.value,
            _active = document.querySelector(
                `.${this.className}[data-value="${_classSelect}"]`
            ),
            _percent,
            _fromLeft;

        if (_index) this.index = _index - 1;

        if (this.active) this.active = this.active.classList.remove("active");
        if (_active) {
            this.active = _active;
            this.active.classList.add("active");
        }

        _percent = this._getRangePercent();
        _fromLeft = _percent * 100;

        this.anchor.style.left = `calc(${_fromLeft}% - ${_percent}em)`;
        if (this.linkedField) {
            if (!this.create) this.linkedField.value = this.el.value;
        } else {
            this.UpdateRange()
        }
    }
    
    UpdateRange() {
        if (!this.create) {
            this.el.value = this.linkedField.value;
        } else {
            let _selected = parseInt(this.linkedField.value);
            switch (_selected) {
                case 0: _selected = 0; break;
                case 10: _selected = 10; break;
                case 50: _selected = 20; break;
                case 100: _selected = 30; break;
                case 500: _selected = 40; break;
                case 1000: _selected = 50; break;
                case 5000: _selected = 60; break;
                case 10000: _selected = 70; break;
                case 20000: _selected = 80; break;
                case 50000: _selected = 90; break;
                case 100000: _selected = 100; break;
                default: _selected = 110; break;
            }
            this.el.value = _selected;
        }
        this.UpdatePos();
    }
    
    _getRangePercent() {
        let
            _relValue = parseInt(this.el.value) - this.minValue,
            _steps = (this.maxValue - this.minValue);
        return _relValue / _steps;
    }
}

let InitCalc = () => {
    let _ageField = document.querySelector(".field.range-first"),
        _ageRange = document.querySelector(".range-input.range-first"),
        _lvl = document.querySelector(".range-select.lvl.range-first"),
        _priceSelect = document.querySelector(".range-select.money.range-second"),
        _priceRange = document.querySelector(".range-input.range-second");
    
    _priceRange.addEventListener("input", () => {
        let _value = document.querySelector(
            ".range-money__item.range-data__item.range-second.active"
        );
        _value = _value.getAttribute("value");
        _priceSelect.value = _value;
    });
    
    _priceSelect.addEventListener("change", () => {
        let _value = parseInt(_priceSelect.value);
        switch (_value) {
            case 5000: console.log(true); break;
        }
    });

    [_ageField, _ageRange, _lvl, _priceSelect, _priceRange].forEach(item => {
        item.addEventListener("change", () => {
            Calculate(
                "field.age.range-first",
                "range-select.lvl.range-first",
                "range-select.money.range-second"
            );
        });
    });
}

let InitDescription = (select, whereToChange, text) => {
    let _select = document.querySelector(`.${select}`);
    let _whereToChange = document.querySelector(`.${whereToChange}`);
    let _index;

    _index = parseInt(_select.value) - 1;
    _whereToChange.innerHTML = text[_index];
    
    _select.addEventListener("change", () => {
        _index = parseInt(_select.value) - 1;
        _whereToChange.innerHTML = text[_index];
    })
}

let Calculate = (_ageField, _lvlField, _moneyField) => {
    let
        _age = document.querySelector(`.${_ageField}`),
        _lvl = document.querySelector(`.${_lvlField}`),
        _money = document.querySelector(`.${_moneyField}`);
    
    _age = parseInt(_age.value);
    _lvl = parseInt(_lvl.value);
    _money = (_money.value != Infinity) ? parseInt(_money.value) : 100000;
    
    (function lifeQuality() {
        let _lifeQuality = document.querySelector(".life-quality > .result-card__result");
        let result = 1 + 
            ((90 - _age) / (90 - AgeSlider.minValue)) *
            _lvl / 5;
        _lifeQuality.innerHTML = result.toFixed(2);
    }());
    
    (function lifeLong() {
        let _lifeLong = document.querySelector(".life-long > .result-card__result");
        let result = 17 *
            ((90 - _age) / (90 - AgeSlider.minValue)) *
            _lvl / 5;
        _lifeLong.innerHTML = result.toFixed(2);
    }());
    
    (function payout() {
        let _payout = document.querySelector(".payout > .result-card__result");
        let result = 100 * (
                1 +
                ((90 - _age) / (90 - AgeSlider.minValue)) *
                _lvl / 5
            ) * _money * (17 *
                ((90 - _age) / (90 - AgeSlider.minValue)) *
                _lvl / 5) /
            (
                (80 + 17 * ((90 - _age) / (90 - AgeSlider.minValue)) * _lvl / 5 - _age) *
                12 * 849
            );
        _payout.innerHTML = result.toFixed(2);
    }());
}