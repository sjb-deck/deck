import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    Typography,
    Paper,
} from '@mui/material';
import {checkLoanReturnForm, submitLoanReturn} from "../../utils/loanReturnForm";

const ReturnForm = ({ items, id, onClose, open }) => {
    const [quantities, setQuantities] = useState(items.map(() => ({ quantityOpened: 0, quantityUnopened: 0 })));

    const handleQuantityChange = (index, field, value) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = [...prevQuantities];
            updatedQuantities[index][field] = value;
            return updatedQuantities;
        });
    };

    const handleFormSubmit = () => {
        console.log("submitting");
        if (checkLoanReturnForm(items, quantities)) {
            submitLoanReturn(items, quantities, id);
        } else {
            console.log("error");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Return Form
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                {items.map((item, index) => (
                    <Grid item={true} xs={12} key={index}>
                    <Paper key={index} sx={{ padding: "15px" }}>
                        <DialogContentText>
                            <Typography variant="body1" component="span">
                                {item.name}
                            </Typography>
                        </DialogContentText>
                        <Typography variant="caption" component="span" sx={{ color: '#666' }}>
                            {' (Expiry: ' + (item.expiry ? item.expiry : 'N/A') + ', Unit: ' + item.unit + ')'}
                        </Typography>
                        <Grid container spacing={2} sx={{ marginTop: "2px" }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Returning Opened"
                                    type="number"
                                    value={quantities[index].quantityOpened}
                                    onChange={(event) => handleQuantityChange(index, 'quantityOpened', event.target.value)}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Returning Unopened"
                                    type="number"
                                    value={quantities[index].quantityUnopened}
                                    onChange={(event) => handleQuantityChange(index, 'quantityUnopened', event.target.value)}
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    </Grid>
                ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} size="small" color="primary" sx={{ marginBottom: "10px" }}>
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} size="small" variant="contained" color="primary" sx={{ marginRight: "20px", marginBottom: "10px" }}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReturnForm;
