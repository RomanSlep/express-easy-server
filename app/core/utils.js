export default {
    round(n) {
        return Number(n.toFixed(0));
    },
    sound(name, v = 0.2) {
        const s = new Audio('assets/sounds/' + name + '.mp3');
        s.play();
        s.volume = v;
    }
};