import {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  FormControl,
  InputLabel,
} from '@material-ui/core';
import ReactJson from 'react-json-view';
import {useForm, Controller} from 'react-hook-form';
import {filter, pathOr, isEmpty} from 'ramda';

export default function AdminChangeUserWithdrawalLimitDialog ({open, userData, handleClose, apiError, successData, classes}) {

  let {register, formState, setValue, handleSubmit, clearErrors} = useForm();

  const activeError = !!pathOr(false, ['errors', 'withdrawalLimitAmount'], formState);

  const submitChangeWithdrawalLimit = (formData) => {
    handleClose('confirm', {...formData, userId: userData.userId, identifier: userData.email});
  };

  useEffect(() => {
    if (!isEmpty(userData)) {
      setValue('withdrawalLimitAmount', userData.withdrawalLimit);
      clearErrors();
    }
  }, [userData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <div className={classes.dialogRootStyles}>
        {successData ? (
          <>
            <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 20}}>
              <Typography variant="h5" component="h5">Success</Typography>
            </div>

            <ReactJson style={{marginTop: 20}} src={successData} />

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button className={classes.dialogConfirmButton} onClick={() => handleClose('cancel')}>
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 20}}>
              <Typography variant="h5" component="h5">Change daily withdrawal limit</Typography>
            </div>

            <div>
              <InputLabel style={{marginTop: 20, marginBottom: 10}}>Edit user's daily withdrawal limit</InputLabel>
              <FormControl className={classes.inputContainer}>
                <OutlinedInput
                  id="withdrawal-limit-amount-input"
                  variant="outlined"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  name="withdrawalLimitAmount"
                  {...register('withdrawalLimitAmount', {
                    validate: v => /^[0-9]+$/.test(v.trim()) || 'Please enter a valid amount.'
                  })}
                  error={activeError}
                  defaultValue={userData.withdrawalLimit || ''}
                  style={{width: 400, marginBottom: 30}}
                />
              </FormControl>
              <div style={{color: 'red', marginBottom: 30, height: 10}}>
                {pathOr(apiError, ['errors', 'withdrawalLimitAmount', 'message'], formState)}
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button className={classes.dialogCancelButton} onClick={() => handleClose('cancel')}>
                Cancel
              </Button>
              <div style={{width: 10}}></div>
              <Button className={classes.dialogConfirmButton} disabled={false} onClick={handleSubmit(submitChangeWithdrawalLimit)}>
                Confirm
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
