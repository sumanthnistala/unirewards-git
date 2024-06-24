const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("IncentiveModule", (m) => {
  const c = m.contract("Lock");

  return { c };
});
