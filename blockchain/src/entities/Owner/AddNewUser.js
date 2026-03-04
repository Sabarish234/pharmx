import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Loader from '../../components/Loader';
import Grid from '@material-ui/core/Grid';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '40ch',
    },
  },
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function AddNewUser(props) {
    console.log("Its working");
    console.log(props.accounts);
    const classes = useStyles();
    const account = props.accounts[0];
    const web3 = props.web3;
    const supplyChain = props.supplyChain;
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");
    const [loading, isLoading] = useState(false);




    useEffect(() => {
    if (supplyChain) {
        supplyChain.events.UserRegister({ fromBlock: 0 })
        .on('data', event => {
            console.log("User Registered:", event);
        });
    }
    }, [supplyChain]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        isLoading(true);

        try {

                const owner = await supplyChain.methods.getOwner().call();
                console.log("Owner:", owner);
                console.log("Current account:", account);
            const nameBytes = web3.utils.padRight(web3.utils.fromAscii(name), 64);

            await supplyChain.methods
                .registerUser(nameBytes, location, Number(role), address)
                .send({ from: account, gas: 5000000 });

            alert("User Registered Successfully ✅");
        } catch (error) {
            console.error('Error: ', error);
            alert("Transaction Failed ❌");
        }

        isLoading(false);
    }

    if(loading) {
        return <Loader></Loader>;
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <PersonAddIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Add New User
                </Typography>

                <form className={classes.root} noValidate>

                    <TextField
                        label="Name"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Location"
                        variant="outlined"
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <TextField
                        select
                        label="Role"
                        variant="outlined"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value={1}>Supplier</MenuItem>
                        <MenuItem value={2}>Transporter</MenuItem>
                        <MenuItem value={3}>Manufacturer</MenuItem>
                        <MenuItem value={4}>Wholesaler</MenuItem>
                        <MenuItem value={5}>Distributor</MenuItem>
                        <MenuItem value={6}>Customer</MenuItem>
                    </TextField>

                    <TextField
                        label="User Wallet Address"
                        variant="outlined"
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>

                </form>
            </div>
        </Container>
    );
}

export default AddNewUser