import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function ViewRawMaterials(props) {

  const account = props.accounts[1];   // supplier account
  const web3 = props.web3;
  const supplyChain = props.supplyChain;

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const rawMaterialAddresses = await supplyChain.methods
          .supplierGetRawMaterialAddresses()
          .call({ from: account });

        setAddresses(rawMaterialAddresses);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchAddresses();
  }, []);

  if (loading) {
    return <p>Getting addresses...</p>;
  }

  return (
    <div>
      <h4>Raw Material addresses created by Supplier</h4>

      {addresses.length === 0 ? (
        <p>No raw materials created yet.</p>
      ) : (
        addresses.map((addr) => (
          <div key={addr}>
            <ul>
              <li>
                <Link
                  to={`/supplier/view-raw-material/${addr}`}
                >
                  {addr}
                </Link>
              </li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}