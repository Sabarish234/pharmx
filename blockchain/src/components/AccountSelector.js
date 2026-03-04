import React from "react";
import { withRouter } from "react-router-dom";

class AccountSelector extends React.Component {

  roleMapping = {
    0: "owner",
    1: "supplier",
    2: "transporter",
    3: "manufacturer",
    4: "wholesaler",
    5: "distributor"
  };

  handleLogin = (account, index) => {
    this.props.selectAccount(account);

    const role = this.roleMapping[index];
    this.props.history.push(`/${role}`);
  };

  render() {
    const { accounts } = this.props;

    return (
      <div style={{ padding: "40px" }}>
        <h2>Select User</h2>

        {accounts.map((acc, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>Address:</strong> {acc}</p>
            <p><strong>Role:</strong> {this.roleMapping[index]}</p>
            <button onClick={() => this.handleLogin(acc, index)}>
              Login as {this.roleMapping[index]}
            </button>
            <hr />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(AccountSelector);