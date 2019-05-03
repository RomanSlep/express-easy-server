import axios from 'axios';

export default (obj, cb = () => {}) => {
    axios.get('/api?action=' + obj.action + '&data=' + JSON.stringify(obj.data))
        .then(function (res) {
            const data = res.data;
            console.log(obj.action + ' -> ', data);
            if (data.success) {
                cb(res.data);
                return;
            }
            console.warn(obj.action + 'error');
        })
        .catch(function (err) {
            console.warn(obj.data.action, err);
        });
};