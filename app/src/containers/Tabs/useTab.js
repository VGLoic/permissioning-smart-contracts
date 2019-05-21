// Libs
import { useState, useEffect } from 'react';
// Utils
import { arrayInclude, areArrayEqual, areMapEqual } from '../../util/array';

export default (originalList, identifierToParams) => {

  const [list, setList] = useState(originalList);
  const [modals, setModals] = useState({ add: false, remove: false, lock: false });
  const [transactions, setTransactions] = useState(new Map());
  const [toasts, setToasts] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  useEffect(() => () => {
    timeouts.forEach(timeoutId => clearTimeout(timeoutId))
  }, [timeouts]);

  useEffect(() => {
    const updatedTransactions = new Map([...transactions]);
    // Delete old pending removals
    transactions.forEach((status, identifier) => {
        if (
          status === "pendingRemoval" &&
          !arrayInclude(originalList, {identifier})
        ) {
            updatedTransactions.delete(identifier);
        }
    });
    // Derive list and delete old pending additions
    const derivedList = originalList
      .map(({ identifier, ...rest }) => {
        if (updatedTransactions.has(identifier)) {
          const status = updatedTransactions.get(identifier);
          if (status === "pendingAddition") {
              updatedTransactions.delete(identifier);
          }
          return { ...rest, identifier, status };
        }
        return { ...rest, identifier }
      })
    // Gather the pending and failed additions from updatedTransactions
    const pending = [];
    updatedTransactions.forEach((status, identifier) => {
        if (status === "pendingAddition" || status === "failAddition") {
            pending.push({ identifier, status, ...identifierToParams(identifier) });
        }
    });

    const updatedList = [...pending, ...derivedList];

    if (!areArrayEqual(updatedList, list, ['identifier', 'status'])) {
      setList(updatedList);
    }
    if (!areMapEqual(updatedTransactions, transactions)) {
      setTransactions(updatedTransactions);
    }
  }, [transactions, originalList, list, identifierToParams]);

  const toggleModal = modal => value => {
    setModals({ ...modals, [modal]: value ? value : !modals[modal] })
  }

  const addTransaction = (identifier, status) => {
    const updatedTransactions = new Map([ ...transactions ]);
    updatedTransactions.set(identifier, status);
    setTransactions(updatedTransactions);
  }

  const updateTransaction = (identifier, status) => addTransaction(identifier, status);

  const deleteTransaction = identifier => {
    const updatedTransactions = new Map([ ...transactions ]);
    updatedTransactions.delete(identifier);
    setTransactions(updatedTransactions);
  }

  const openToast = (identifier, status, message, secondaryMessage) => {
    const timeoutId = setTimeout(closeToast(identifier), 15000);
    setToasts([ ...toasts, { identifier, status, message, secondaryMessage } ]);
    setTimeouts([ ...timeouts, timeoutId ]);
  }

  const updateToast = (targetedIdentifier, status, message, secondaryMessage) => {
    const updatedToasts = [...toasts];
    const index = updatedToasts.findIndex(
      ({ identifier }) => identifier === targetedIdentifier
    );
    updatedToasts[index] = {
      identifier: targetedIdentifier,
      status,
      message,
      secondaryMessage
    };
    setToasts(updatedToasts);
  }

  const closeToast = targetedIdentifier => () => {
    const updatedToasts = [...toasts];
    const index = updatedToasts.findIndex(
      ({ identifier }) => identifier === targetedIdentifier
    );
    updatedToasts.splice(index, 1);
    setToasts(updatedToasts);
  }

  return {
    list,
    modals,
    toggleModal,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toasts,
    openToast,
    updateToast,
    closeToast,
  }
}
