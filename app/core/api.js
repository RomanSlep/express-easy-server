import axios from 'axios';
import Store from '../Store';

export default (obj, cb = () => {}) => {
    axios.get('/api?action=' + obj.action + '&data=' + JSON.stringify(obj.data))
        .then(function (res) {
            const data = res.data;

            console.log(obj.action + ' -> ', data.result);
            if (data.success) {
                cb(data.result);
                return;
            }
            console.warn(obj.action + ' error: ', data);
            Store.$notify({
                type: 'error',
                group: 'foo',
                title: 'Error ' + obj.action,
                text: data.msg
            });
        })
        .catch(function (err) {
            console.warn(obj.data.action, err);
        });
};