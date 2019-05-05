module.exports = {
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
        const steps = 24 - countBombs;
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
        let next, p = 0,
            collected = 0;
        while (stepLastNum > p - 2) {
            collected = result;
            result += countBombs * m * p++;
            next = result;
        }

        params.nextPrize = next;
        params.collected = collected;
    },
    filterGame(game) {
        return game;
    }
};