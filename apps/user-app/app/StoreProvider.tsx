'use client';

import React, { useRef } from "react";
import {AppStore, makeStore} from '@repo/store/store'
import { Provider } from "@repo/store/redux";

const StoreProvider= ({children}:{children :React.ReactNode}) =>{
    const storeInitialize = useRef<AppStore>(undefined)
    if(!storeInitialize.current){
        storeInitialize.current = makeStore()
    }

    return <Provider store={storeInitialize.current}>{children}</Provider>
}

export default StoreProvider