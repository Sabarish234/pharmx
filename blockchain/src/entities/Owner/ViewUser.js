import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';

export default function ViewAllUsers(props) {

  const web3 = props.web3;
  const supplyChain = props.supplyChain;
  const account = props.accounts[0];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleMap = {
    1: "Supplier",
    2: "Transporter",
    3: "Manufacturer",
    4: "Wholesaler",
    5: "Distributor",
    6: "Customer"
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const addresses = await supplyChain.methods
          .getAllUsers()
          .call({ from: account });

        let userArray = [];

        for (let addr of addresses) {
          const user = await supplyChain.methods
            .getUserInfo(addr)
            .call({ from: account });

          userArray.push({
            address: addr,
            name: web3.utils.hexToUtf8(user.name).replace(/\u0000/g, ""),
            role: roleMap[user.role],
            location: user.userLoc
          });
        }

        setUsers(userArray);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    if (supplyChain) {
      fetchUsers();
    }

  }, [supplyChain]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Registered Users</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Role</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>{user.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}