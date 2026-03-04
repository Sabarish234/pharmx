import React, { useEffect, useState } from "react";
import RawMaterial from "../../build/RawMaterial.json";

function ManufacturerRawMaterial({ accounts, web3, supplyChain }) {

  const [rawMaterials, setRawMaterials] = useState([]);
  const account = accounts[3];

  useEffect(() => {
    loadRawMaterials();
  }, []);

  const loadRawMaterials = async () => {

    const addresses = await supplyChain.methods
      .supplierGetRawMaterialAddresses()
      .call();

    let materials = [];

    for (let i = 0; i < addresses.length; i++) {

      const rawMaterial = new web3.eth.Contract(
        RawMaterial.abi,
        addresses[i]
      );

      const details = await rawMaterial.methods
        .getSuppliedRawMaterials()
        .call();

      const status = await rawMaterial.methods
        .getRawMaterialStatus()
        .call();

        const requested = await supplyChain.methods.requestedByManufacturer(addresses[i]).call();

      materials.push({
        address: addresses[i],
        productId: details[0],
        description: web3.utils.hexToUtf8(details[1]),
        quantity: details[2],
        supplier: details[3],
        transporter: details[4],
        manufacturer: details[5],
        status: status,
        requested: requested
      });
    }

    setRawMaterials(materials);
  };

  // ==========================
  // Request + Sign
  // ==========================

    const requestRawMaterial = async (packageAddress) => {
    try {
        // Sign the package address (converted to hex)
        const signature = await web3.eth.sign(packageAddress, account);

        // Call the new function
        await supplyChain.methods
        .buyRawMaterial(packageAddress, signature)
        .send({ from: account });

        alert("Requested & Signed ✅");
    } catch (err) {
        console.error(err);
        alert("Error requesting raw material. See console.");
    }
    };

  // ==========================
  // Status Text
  // ==========================

  const getStatusText = (status) => {
    if (status === "0") return "At Supplier";
    if (status === "1") return "Picked by Transporter";
    if (status === "2") return "Delivered to Manufacturer";
  };

  return (
    <div>
      <h2>Manufacturer - Raw Materials</h2>

      {rawMaterials.map((item, index) => (
        <div key={index} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>

          <p><b>Package:</b> {item.address}</p>
          <p><b>Description:</b> {item.description}</p>
          <p><b>Quantity:</b> {item.quantity}</p>
          <p><b>Supplier:</b> {item.supplier}</p>
          <p><b>Status:</b> {getStatusText(item.status)}</p>

          {item.status === "0" && (
           <button
            disabled={item.status !== "0" || item.requested} // disable if already requested
            onClick={() => requestRawMaterial(item.address)}
            >
            Request & Sign
            </button>
          )}

        </div>
      ))}
    </div>
  );
}

export default ManufacturerRawMaterial;