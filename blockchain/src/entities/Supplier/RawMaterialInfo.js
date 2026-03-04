import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Loader from '../../components/Loader';
import RawMaterial from '../../build/RawMaterial.json';
import { Link } from "react-router-dom";
import CustomStepper from '../../main_dashboard/components/Stepper/Stepper';
import { useParams } from 'react-router-dom';

export default function RawMaterialInfo(props) {

  const account = props.accounts[1];
  const {addr} = useParams();
  const rawMaterialAddress = addr;
  const web3 = props.web3;

  const [manufacturer, setManufacturer] = useState("");
  const [details, setDetails] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  async function getRawMaterialData() {

    const rawMaterial = new web3.eth.Contract(
      RawMaterial.abi,
      rawMaterialAddress
    );

    const data = await rawMaterial.methods
      .getSuppliedRawMaterials()
      .call({ from: account });

    const description = web3.utils.hexToUtf8(data[1]);
    const status = Number(data[6]);

    setManufacturer(data[5]);
    setActiveStep(status);

    setDetails({
      description,
      quantity: data[2],
      supplier: data[3],
      transporter: data[4],
      manufacturer: data[5]
    });

    setLoading(false);
  }

  function getSupplyChainSteps() {
    return [
      'At Supplier',
      'Collected by Transporter',
      'Delivered to Manufacturer'
    ];
  }

  function getSupplyChainStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Raw Material is at supplier stage.';
      case 1:
        return 'Raw Material collected by Transporter.';
      case 2:
        return 'Raw Material delivered to Manufacturer.';
      default:
        return 'Unknown step';
    }
  }

  useEffect(() => {
    getRawMaterialData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Raw Material Details</h1>

      <p><strong>Contract Address:</strong> {rawMaterialAddress}</p>
      <p><strong>Description:</strong> {details.description}</p>
      <p><strong>Quantity:</strong> {details.quantity}</p>
      <p><strong>Supplier:</strong> {details.supplier}</p>
      <p><strong>Transporter:</strong> {details.transporter}</p>
      <p><strong>Manufacturer:</strong> {details.manufacturer}</p>

      <CustomStepper
        getSteps={getSupplyChainSteps}
        activeStep={activeStep}
        getStepContent={getSupplyChainStepContent}
      />

      <br />

      <Button variant="contained" color="primary">
        <Link
          to={`/supplier/view-request/${rawMaterialAddress}`}
          style={{ color: "white", textDecoration: "none" }}
        >
          View Requests
        </Link>
      </Button>
    </div>
  );
}