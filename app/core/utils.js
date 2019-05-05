const $u = {
    round(n) {
        return Number(n.toFixed(8));
    },
    sound(name, v = 0.2) {
        const s = new Audio('assets/sounds/' + name + '.mp3');
        s.play();
        s.volume = v;
    },
    prizes(params) { // абсолютный размер множителя
        const {
            countBombs,
            bet,
            stepLastNum
        } = params;
        const steps = 25 - countBombs;
        const countStepsBE = Math.round(steps * 0.66); // шагов безубытка
        let countMult = 0;
        let i = 0;
        while (countStepsBE >= i) {
            countMult += i * countBombs;
            i++;
        }
        const m = bet / countMult; // один множитель
        let result = 0;
        // считаем текущий и следующий призы
        let current, next, p = 0;
        while (stepLastNum > p - 2) {
            current = result;
            result += countBombs * m * p;
            next = result;
            p++;
        }
        return {
            m,
            current,
            next
        };
    }
};


// try {
//     module.exports = $u;
// } catch (e) {
// if (!window) {
//     module.exports = $u;
// } else {
export default $u;
// }