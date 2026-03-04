import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import Transactions from '../../build/Transactions.json';
//import RawMaterial from '../../build/RawMaterial.json';
import {NavLink, withRouter, BrowserRouter as Router, Route} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddRawMaterial(props) {
  const account = props.accounts[1];
  const web3 = props.web3;

    const transporterOptions = [
  "0xa45a8Fd138b418e3994d973fd7a70148Df4e10F8",
  "0x2222222222222222222222222222222222222222"
  ];

  const manufacturerOptions = [
    "0xf87E6094Bb76E2EA6B3aFe9F524A000b21184617",
    "0x4444444444444444444444444444444444444444"
  ];

  const [transporterAddress, setTransporterAddress] = useState(transporterOptions[0]);
  const [manufacturerAddress, setManufacturerAddress] = useState(manufacturerOptions[0]);
  const supplyChain = props.supplyChain;
  const [loading, isLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  
  const classes = useStyles();

  const handleInputChange = (e) => {
    if (e.target.id === 'description') {
       setDescription(e.target.value);     
    } else if(e.target.id === 'quantity') {
        setQuantity(e.target.value);
    } else if(e.target.id === 'transport-address') {
      setTransporterAddress(e.target.value);
    }
  }

  const handleSubmit = async (e) => {
    console.log('Submit clicked');
    e.preventDefault();
    isLoading(true);
    var d = web3.utils.padRight(web3.utils.fromAscii(description), 64);
    try {
        console.log('Supply chain: ', supplyChain);
        console.log('Account: ', account);
        await supplyChain.methods
          .supplierCreatesRawPackage(
            web3.utils.asciiToHex(description),
            Number(quantity),
            transporterAddress,
            manufacturerAddress
          )
          .send({ from: account, gas: 5000000 });

        alert("Raw Material Created Successfully");
        isLoading(false);

      } catch (error) {
        console.error(error);
        isLoading(false);
      }
  }


  return (
    <Grid container style={{ backgroundColor: "white", display: "center", alignItems: "center", maxWidth: 400, justify: "center"}}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          
          <Typography component="h1" variant="h5"> Add Raw Material</Typography>
          <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="description" label="Material Description" name="description"/>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    type="number"
                    variant="outlined"
                    onChange={handleInputChange}
                    required
                    fullWidth
                    id="quantity"
                    label="Material Quantity"
                  />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    select
                    variant="outlined"
                    required
                    fullWidth
                    label="Transporter Address"
                    value={transporterAddress}
                    onChange={(e) => setTransporterAddress(e.target.value)}
                  >
                    {transporterOptions.map((addr, index) => (
                      <MenuItem key={index} value={addr}>
                        {addr}
                      </MenuItem>
                    ))}
                  </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                  select
                  variant="outlined"
                  required
                  fullWidth
                  label="Manufacturer Address"
                  value={manufacturerAddress}
                  onChange={(e) => setManufacturerAddress(e.target.value)}
                >
                  {manufacturerOptions.map((addr, index) => (
                    <MenuItem key={index} value={addr}>
                      {addr}
                    </MenuItem>
                  ))}
                </TextField>
            </Grid>
            </Grid>
            <Button
              type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={ handleSubmit } >
              Submit
            </Button>
          
          </form>
        </div>
      </Container>
    </Grid>
  );
}
