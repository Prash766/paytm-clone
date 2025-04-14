'use client';

import React, { useEffect, useRef } from "react";
import {AppStore, makeStore} from '@repo/store/store'
import { Provider } from "@repo/store/redux";
import { setUserTransaction } from "@repo/store/user-transaction";
import { TransactionProp } from "../components/TransactionHistory";
import getTransactionHistory from "../actions/transactionHistory";

const StoreProvider= ({children}:{children :React.ReactNode}) =>{
    const storeInitialize = useRef<AppStore>(undefined)
    const transactionsRef = useRef<{success:boolean , transactionHistory : TransactionProp[]} | null>(null)
    if(!storeInitialize.current){
        storeInitialize.current = makeStore()
    }
    useEffect(()=>{
        async function getTransactions(){
            transactionsRef.current= await getTransactionHistory() 
            console.log("trasnaction history ref",transactionsRef.current.transactionHistory)
            storeInitialize.current?.dispatch(setUserTransaction(transactionsRef.current.transactionHistory))
        }
        getTransactions()
    }, [])

    return <Provider store={storeInitialize.current}>{children}</Provider>
}

export default StoreProvider