import axios from 'axios';
import {postWithCSRF} from "./submitForm";
import {INV_API_EXPIRY_POST_URL, INV_API_LOAN_RETURN_URL} from "../globals";

const isValidNonNegativeInteger = (value) => {
    return /^\d+$/.test(value);
};

const checkLoanReturnForm = (items, quantities) => {
    // Step 1: Check if all quantities are valid non-negative integers
    for (let i = 0; i < quantities.length; i++) {
        const quantityOpened = parseInt(quantities[i].quantityOpened, 10);
        const quantityUnopened = parseInt(quantities[i].quantityUnopened, 10);

        if (
            !isValidNonNegativeInteger(quantities[i].quantityOpened) ||
            !isValidNonNegativeInteger(quantities[i].quantityUnopened) ||
            quantityOpened < 0 ||
            quantityUnopened < 0
        ) {
            return false;
        }

        // Update the quantities array with parsed integer values
        quantities[i].quantityOpened = quantityOpened;
        quantities[i].quantityUnopened = quantityUnopened;
    }

    // Step 2: Check if all quantities are not larger than their corresponding quantities in order_items
    for (let i = 0; i < items.length; i++) {
        const orderItem = items[i];
        const quantityOpened = quantities[i].quantityOpened;
        const quantityUnopened = quantities[i].quantityUnopened;

        if (quantityOpened > orderItem.quantity_opened || quantityUnopened > orderItem.quantity_unopened) {
            return false;
        }
    }

    // All checks passed
    return true;
};

const submitLoanReturn = (items, quantities, id) => {
    const payload = {
        order_id: id,
        items: [],
    }
    for (let i = 0; i < items.length; i++) {
        payload.items.push(
            {
                item_name: items[i].name,
                item_expiry: items[i].expiry,
                return_opened: quantities[i].quantityOpened,
                return_unopened: quantities[i].quantityUnopened,
            }
        );
    }
    postWithCSRF(INV_API_LOAN_RETURN_URL, payload)
        .then((response) => {
            console.log(response);
        })
            .catch((error) => {
                console.log(error);
            }
        );
}

export { checkLoanReturnForm, submitLoanReturn };