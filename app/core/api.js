import axios from 'axios';
import Store from '../Store';

export default (obj, cb = () => {}, silent) => {
    obj.data = obj.data || {};
    obj.data.token = obj.token || Store.user.token;
    // console.log('Req: ', obj.action, obj.data);
    axios.get('/api?action=' + obj.action + '&data=' + JSON.stringify(obj.data))
        .then(function (res) {
            const data = res.data;
            // console.log('Resp:', obj.action + ' -> ', data.result);
            if (data.success) {
                cb(data.result);
                return;
            }
            console.warn(obj.action + ' error: ', data);
            if (!silent) {
                Store.$notify({
                    type: 'error',
                    group: 'foo',
                    title: 'Error ' + obj.action,
                    text: data.msg
                });
            }
        })
        .catch(function (err) {
            console.warn(obj.data.action, err);
        });
};
