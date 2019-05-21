// Libs
import React from 'react';
import { drizzleReactHooks } from "drizzle-react";
// Context
import { useData } from '../../context/data';
// Utils
import useTab from './useTab';
import { identifierToParams, paramsToIdentifier, enodeToParams, isValidEnode } from '../../util/enodetools';
// Components
import EnodeTab from '../../components/EnodeTab/EnodeTab';

const EnodeTabContainer = () => {
  const { admins, isAdmin, userAddress } = useData();

  const {
    list,
    modals,
    toggleModal,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toasts,
    openToast,
    closeToast,
  } = useTab(admins, identifier => ({ address: identifier }));

  const { drizzle } = drizzleReactHooks.useDrizzle();

  const {
    addEnode,
    removeEnode,
    enterReadOnly,
    exitReadOnly
  } = drizzle.contracts.Rules.methods;

  const handleAdd = async value => {
    const { enodeHigh, enodeLow, ip, port } = enodeToParams(value);
    const identifier = paramsToIdentifier({
        enodeHigh,
        enodeLow,
        ip,
        port
    });
    const gasLimit = await addEnode(
      enodeHigh,
      enodeLow,
      ip,
      port
    ).estimateGas({from: userAddress});
    addEnode(
      enodeHigh,
      enodeLow,
      ip,
      port
    )
      .send({ from: userAddress, gasLimit: gasLimit * 4 })
      .on('transactionHash', () => {
        toggleModal('add')();
        addTransaction(identifier, 'pendingAddition');
      })
      .on('receipt', () => {
        openToast(identifier, 'success', `New whitelisted node processed: ${enodeHigh}${enodeLow}`);
      })
      .on('error', () => {
        toggleModal('add')();
        updateTransaction(identifier, 'failAddition');
        openToast(
          identifier,
          'fail',
          "Could not add node to whitelist",
          `${enodeHigh}${enodeLow} was unable to be added. Please try again`
        );
      })
  }

  const handleRemove = async value => {
    const { enodeHigh, enodeLow, ip, port } = identifierToParams(
        value
    );
    const gasLimit = await removeEnode(
      enodeHigh,
      enodeLow,
      ip,
      port
    ).estimateGas({from: userAddress});
    removeEnode(
      enodeHigh,
      enodeLow,
      ip,
      port
    )
      .send({ from: userAddress, gasLimit: gasLimit * 4 })
      .on('transactionHash', () => {
        toggleModal('remove')();
        addTransaction(value, 'pendingRemoval');
      })
      .on('receipt', () => {
        openToast(value, 'success', `Removal of whitelisted node processed: ${enodeHigh}${enodeLow}`);
      })
      .on('error', () => {
        toggleModal('remove')();
        updateTransaction(value, 'failRemoval');
        openToast(
          value,
          'fail',
          "Could not remove node to whitelist",
          `${enodeHigh}${enodeLow} was unable to be removed. Please try again.`
        );
      })
  }

  return (
    <EnodeTab
      list={list}
      toasts={toasts}
      closeToast={closeToast}
      userAddress={userAddress}
      modals={modals}
      toggleModal={toggleModal}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      isAdmin={isAdmin}
      deleteTransaction={deleteTransaction}
      isValid={isValidEnode}
    />
  )
}

export default EnodeTabContainer;
