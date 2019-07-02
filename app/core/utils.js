const $u = {
    round(n) {
        return Number(n.toFixed(8));
    },
    sound(name, v = 0.2) {
        const s = new Audio('assets/sounds/' + name + '.mp3');
        s.play();
        s.volume = v;
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