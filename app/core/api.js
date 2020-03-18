import axios from 'axios';
import Store from '../Store';
import config from '../../config';

export default (obj, cb = () => {}, silent, type = 'api') => {
    obj.data = obj.data || {};
    obj.data.token = type === 'api' && (obj.token || Store.user.token);
    // console.log('Req: ', obj.action, obj.data);
    axios.get(config.domain || '' + '/' + type + '?' + 'action=' + obj.action + '&data=' + encodeURIComponent(JSON.stringify(obj.data)))
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
                    title: 'Error ' + obj.action,
                    message: data.msg
                });
            }
        })
        .catch(function (err) {
            console.warn(obj.data.action, err);
        });
};
