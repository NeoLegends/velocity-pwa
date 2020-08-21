import { Router } from "@reach/router";
import classNames from "clsx";
import React, { useEffect, useState } from "react";

import { Address, Customer, SepaMandate } from "../../model";
import {
  changeAddress,
  changePin,
  changeTel,
  getCustomer,
  getSepaInfo,
  requestPasswordResetEmail,
} from "../../model/customer";
import makeLazy from "../util/make-lazy";

import "./customer.scss";
import Overview from "./overview";

interface CustomerViewProps {
  className?: string;
}

const ChangeAddress = makeLazy(() => import("./change-address"));
const ChangeBankDetails = makeLazy(() => import("./change-bank-details"));
const ChangePassword = makeLazy(() => import("./change-pw"));
const ChangePin = makeLazy(() => import("./change-pin"));
const ChangeTel = makeLazy(() => import("./change-tel"));
const SepaMandateView = makeLazy(() => import("./sepa-mandate"));

const CustomerView: React.FC<CustomerViewProps> = ({ className }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [sepaMandate, setSepaMandate] = useState<SepaMandate | null>(null);

  const fetchData = () =>
    Promise.all([getCustomer(), getSepaInfo()]).then(
      ([customer, sepaMandate]) => {
        setCustomer(customer);
        setSepaMandate(sepaMandate);
      },
    );

  useEffect(() => {
    fetchData();
  }, []);

  if (!customer || !sepaMandate) {
    return null;
  }

  const goToOverview = () => window.history.back();

  const handleCancel = (ev: React.MouseEvent) => {
    ev.preventDefault();
    goToOverview();
  };

  const handleChangeAddress = async (addr: Address) => {
    await changeAddress(addr);
    await fetchData();
    goToOverview();
  };

  const handleChangePin = async (pin: string, pw: string) => {
    await changePin(pin, pw);
    await fetchData();
    goToOverview();
  };

  const handleChangeTel = async (tel: string) => {
    await changeTel(tel.trim());
    await fetchData();
    goToOverview();
  };

  const handleRequestPwEmail = async () => {
    await requestPasswordResetEmail(customer.login);
    goToOverview();
  };

  return (
    <Router className={classNames("customer-info box-list", className)}>
      <Overview path="/" customer={customer} sepaMandate={sepaMandate} />
      <ChangeAddress
        currentAddress={customer.address}
        path="change-address"
        onCancel={handleCancel}
        onChangeAddress={handleChangeAddress}
      />
      <ChangeBankDetails
        path="change-bank-details"
        onCancel={handleCancel}
        onChangeBankDetails={null!}
      />
      <ChangePassword
        path="change-password"
        onCancel={handleCancel}
        onRequestPasswordEmail={handleRequestPwEmail}
      />
      <ChangePin
        path="change-pin"
        onCancel={handleCancel}
        onChangePin={handleChangePin}
      />
      <ChangeTel
        currentTel={customer.phonenumber}
        path="change-tel"
        onCancel={handleCancel}
        onChangeTel={handleChangeTel}
      />
      {sepaMandate && (
        <SepaMandateView
          path="sepa-mandate"
          onCancel={handleCancel}
          mandate={sepaMandate!}
        />
      )}
    </Router>
  );
};

export default CustomerView;
