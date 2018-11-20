import { Router } from '@reach/router';
import React from 'react';

import { Address, Customer, SepaMandate } from '../../model';
import {
  changeAddress,
  changePin,
  changeTel,
  getCustomer,
  getSepaInfo,
  requestPasswordResetEmail,
} from '../../model/customer';
import makeLazy from '../../util/make-lazy';

import './customer.scss';
import Overview from './overview';

interface CustomerState {
  customer: Customer | null;
  sepaMandate: SepaMandate | null;
}

const ChangeAddress = makeLazy(() => import('./change-address'));
const ChangeBankDetails = makeLazy(() => import('./change-bank-details'));
const ChangePassword = makeLazy(() => import('./change-pw'));
const ChangePin = makeLazy(() => import('./change-pin'));
const ChangeTel = makeLazy(() => import('./change-tel'));
const SepaMandateView = makeLazy(() => import('./sepa-mandate'));

class CustomerView extends React.Component<{}, CustomerState> {
  state = {
    customer: null,
    sepaMandate: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    if (!this.state.customer || !this.state.sepaMandate) {
      return null;
    }

    return (
      <Router className="customer-info box-list">
        <Overview
          path="/"
          customer={this.state.customer!}
          sepaMandate={this.state.sepaMandate!}
        />
        <ChangeAddress
          path="change-address"
          onCancel={this.handleCancel}
          onChangeAddress={this.handleChangeAddress}
        />
        <ChangeBankDetails
          path="change-bank-details"
          onCancel={this.handleCancel}
          onChangeBankDetails={null!}
        />
        <ChangePassword
          path="change-password"
          onCancel={this.handleCancel}
          onRequestPasswordEmail={this.handleRequestPwEmail}
        />
        <ChangePin
          path="change-pin"
          onCancel={this.handleCancel}
          onChangePin={this.handleChangePin}
        />
        <ChangeTel
          path="change-tel"
          onCancel={this.handleCancel}
          onChangeTel={this.handleChangeTel}
        />
        {this.state.sepaMandate && (
          <SepaMandateView
            path="sepa-mandate"
            onCancel={this.handleCancel}
            mandate={this.state.sepaMandate!}
          />
        )}
      </Router>
    );
  }

  private async fetchData() {
    const [customer, sepaMandate] = await Promise.all([
      getCustomer(),
      getSepaInfo(),
    ]);
    this.setState({ customer, sepaMandate });
  }

  private goToOverview() {
    history.back();
  }

  private handleCancel = (ev: React.MouseEvent) => {
    ev.preventDefault();
    this.goToOverview();
  }

  private handleChangeAddress = async (addr: Address) => {
    await changeAddress(addr);
    await this.fetchData();
    this.goToOverview();
  }

  private handleChangePin = async (pin: string, pw: string) => {
    await changePin(pin, pw);
    this.goToOverview();
  }

  private handleChangeTel = async (tel: string) => {
    await changeTel(tel.trim());
    this.goToOverview();
  }

  private handleRequestPwEmail = async () => {
    const cust: Customer | null = this.state.customer;
    await requestPasswordResetEmail(cust!.login);
    this.goToOverview();
  }
}

export default CustomerView;
