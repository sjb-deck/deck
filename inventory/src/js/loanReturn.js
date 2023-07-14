import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import NavBar from '../../../components/NavBar/NavBar';
import Theme from '../../../components/Themes';
import '../scss/inventoryBase.scss';
import useFetch from "../../../hooks/use-fetch";
import {INV_API_USER_URL} from "../../../globals";
import {SnackBarAlerts} from "../../../components/SnackBarAlerts";

const LoanReturn = () => {
    const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);

    return (
        <Theme>
            <NavBar user={user} />
        </Theme>
    )
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<LoanReturn />);
