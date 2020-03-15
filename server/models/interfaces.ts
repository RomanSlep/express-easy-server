
// import 
interface IM_User{
    _id?:boolean|string,
    token?: string,
    login?: string,
    addresses?: object,
    timestamp?: number,
    loginLowCase?: string,
    password?: string,
    deposits?: object,
    refererId?: object,
    isLogged?:boolean,
    save:Function,
    update:Function
};

interface IM_refsBonus{
    _id?:boolean|string,
    bonuses?:any,
    save:Function,
    update:Function
};

interface IResponse{
    error?:string,
    success?:boolean,
    result?: any
};

interface IObject{
    [key: string]: any;
}