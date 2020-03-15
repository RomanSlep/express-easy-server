import {Response, Request} from 'express';
import Store from '../helpers/Store';

export default (req:Request, res:Response) => {
    const action:string = req.query.action;
    const GET:IObject = JSON.parse(req.query.data);
    switch (action) {
    case ('getPublic'):
        send(Store, res);
        break;
    };
};

function send(result:any, res:Response):void {
    res.json({
        success: true,
        result
    });
}