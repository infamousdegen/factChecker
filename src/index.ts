import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt,nat, Variant,Service,serviceUpdate,Principal,CallResult } from 'azle';



type registerMetadata = Record<{
    id:nat,
    Address:Principal,
    deactivated:boolean
}>


type payload = Record<{
    id:nat,
    url:string,
    description:string,
    isFact:Opt<string>,
    isResolved:boolean,
    trueCounter:nat,
    falseCounter:nat,
    undeterminedCounter:nat
    created_at:nat

}>


class DepositModule extends Service{
    @serviceUpdate
    transferToMarket:(from:Principal,to:Principal,ckbtcAmount:nat) =>CallResult<boolean>
}

let ID:nat = 0n

const storageValue = new StableBTreeMap<nat, payload>(0, 44, 1024);
const registerUsers = new StableBTreeMap<Principal, registerMetadata>(1, 44, 1024);


const depositModuleCanister = new DepositModule(
    Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")
)



$update;
export async function createRequest(_url:string,_description:string) :Promise<Result<boolean,string>> {

    const result = await depositModuleCanister.transferToMarket(ic.id(),ic.caller(),BigInt(0.0001)).call()

    match(result,{
        Ok: (ok) => {
            if(ok.valueOf() !==true){
                ic.trap("Error occured with created new market ")
            }
            Result.Ok<boolean,string>(true)
        },
        Err:() => Result.Err<boolean,string>("Error occured here")
    })

    let updatedMessage: payload = {id:ID,url:_url,description:_description,isFact:Opt.None,isResolved:false,trueCounter:0n,falseCounter:0n,undeterminedCounter:0n,created_at:ic.time()}

    storageValue.insert(ID,updatedMessage)

    ID = ID + 1n
    return Result.Ok<boolean,string>(true)
}


//@note:Should be only called by governance contract
$update;
export async function updateData(_marketId:nat) :Promise<Result<boolean,string>>{


    return(match(storageValue.get(_marketId),{
        Some:(arg) => {
            const trueCounter_value = arg.trueCounter
            const falseCounter_value = arg.falseCounter
            const undeterminedCounter_value = arg.undeterminedCounter
            const returnValue = findGreatestBigInt(trueCounter_value,falseCounter_value,undeterminedCounter_value)
            let resolvedValue
            if(returnValue === trueCounter_value){
                resolvedValue = 'TRUE'

            }
            else if(returnValue === falseCounter_value){
                resolvedValue = 'FALSE'
            }
            else{
                resolvedValue = 'UNDETERMINED'
            }

            let updatedMessage:payload = {...arg,isFact:Opt.Some(resolvedValue),isResolved:true}
            storageValue.insert(_marketId,updatedMessage)

            return Result.Ok<boolean,string>(true)
        },
        None: () => Result.Err<boolean,string>("No id found ")
    }))

}

$query;
export function queryFactoOrNot(_marketId:nat) :Result<string,string> {
    return(match(storageValue.get(_marketId),{
        Some:(arg) =>{
            match(arg.isFact,{
                Some:(value) => {
                    return Result.Ok<string,string>(value)
                },
                None:() => Result.Err<string,string>("Error occured")
            })

            return Result.Err<string,string>("Occure error")
            
        },
        None:() => Result.Err<string,string>("No id found ")
    }))
}

$update;
export function registerYourself():Result<boolean,string>{
    let updatedMessage = {id:ID,deactivated:false,Address:ic.caller()}
    registerUsers.insert(ic.caller(),updatedMessage)
    return Result.Ok<boolean,string>(true)
}

$update;
export function deRegister():Result<boolean,string>{
    return(match(registerUsers.get(ic.caller()),{
        Some: (arg) => {
            let updatedMessage:registerMetadata = {...arg,deactivated:false}
            registerUsers.insert(ic.caller(),updatedMessage)
            return Result.Ok<boolean,string>(true)
        },
        None:() => {
            return Result.Err<boolean,string>("Error occured")
        }
    }))
}


$update;
export function isRegistered(user: Principal) :Result<boolean,string> {
    
    return(match(registerUsers.get(user),{
        Some: (arg) => {

            return Result.Ok<boolean,string>(!(arg.deactivated))
        },
        None:() => {
            return Result.Err<boolean,string>("Error occured")
        }
    }))
}


$update;
export function vote(_marketId:nat,factType:string):Result<boolean,string> {
    const isRegister = isRegistered(ic.caller());

    const value = match(isRegister,{
        Ok:(arg) => {
            return arg
        },
        Err: () => "False"
    })

    const currentMessage = match(storageValue.get(_marketId),{
        Some:(arg) => {
            return arg
        },
        None:() => ic.trap("Market id is invalid")
        
    })

    if(value === true){
        if(factType === 'TRUE'){
            let currentvalue = currentMessage.trueCounter + 1n
            let updatedMessage:payload = {...currentMessage,trueCounter:currentvalue}
            storageValue.insert(_marketId,updatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else if(factType === 'FALSE'){
            let currentvalue = currentMessage.falseCounter + 1n
            let updatedMessage:payload = {...currentMessage,falseCounter:currentvalue}
            storageValue.insert(_marketId,updatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else if(factType === 'UNDETERMINED'){
            let currentvalue = currentMessage.undeterminedCounter + 1n
            let updatedMessage:payload = {...currentMessage,undeterminedCounter:currentvalue}
            storageValue.insert(_marketId,updatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else{
            ic.trap("Enter a valid input")
        }

    }
    else{
        ic.trap("You are not a registers user")
        
    }

}


function findGreatestBigInt(a: BigInt, b: BigInt, c: BigInt): BigInt {
    if (a > b) {
      if (a > c) {
        return a;
      } else {
        return c;
      }
    } else {
      if (b > c) {
        return b;
      } else {
        return c;
      }
    }
  }
  



