// Libs
import { useState, useEffect } from "react";
// Utils
import { arrayInclude, areArrayEqual, areMapEqual } from "../../util/array";

export default (originalList, identifierToParams) => {
    const [list, setList] = useState(originalList);
    const [modals, setModals] = useState({
        add: false,
        remove: false,
        lock: false
    });
    const [transactions, setTransactions] = useState(new Map());
    const [toasts, setToasts] = useState([]);
    const [timeouts, setTimeouts] = useState([]);

    useEffect(
        () => () => {
            timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        },
        [timeouts]
    );

    useEffect(() => {
        const updatedTransactions = new Map([...transactions]);
        // Delete old pending removals
        transactions.forEach((status, identifier) => {
            if (
                status === "pendingRemoval" &&
                !arrayInclude(originalList, { identifier })
            ) {
                updatedTransactions.delete(identifier);
            }
        });
        // Derive list and delete old pending additions
        const derivedList = originalList.map(({ identifier, ...rest }) => {
            if (updatedTransactions.has(identifier)) {
                const status = updatedTransactions.get(identifier);
                if (status === "pendingAddition") {
                    updatedTransactions.delete(identifier);
                }
                return { ...rest, identifier, status };
            }
            return { ...rest, identifier };
        });
        // Gather the pending and failed additions from updatedTransactions
        const pending = [];
        updatedTransactions.forEach((status, identifier) => {
            if (status === "pendingAddition" || status === "failAddition") {
                pending.push({
                    identifier,
                    status,
                    ...identifierToParams(identifier)
                });
            }
        });

        const updatedList = [...pending, ...derivedList];

        if (!areArrayEqual(updatedList, list, ["identifier", "status"])) {
            setList(updatedList);
        }
        if (!areMapEqual(updatedTransactions, transactions)) {
            setTransactions(updatedTransactions);
        }
    }, [transactions, originalList, list, identifierToParams]);

    const toggleModal = modal => value => {
        setModals(modals => ({
            ...modals,
            [modal]: value ? value : !modals[modal]
        }));
    };

    const addTransaction = (identifier, status) => {
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.set(identifier, status);
            return updatedTransactions;
        });
    };

    const updateTransaction = (identifier, status) =>
        addTransaction(identifier, status);

    const deleteTransaction = identifier => {
        const updatedTransactions = new Map([...transactions]);
        updatedTransactions.delete(identifier);
        setTransactions(transactions => {
            const updatedTransactions = new Map([...transactions]);
            updatedTransactions.delete(identifier);
            return updatedTransactions;
        });
    };

    const openToast = (
        identifier,
        status,
        message,
        secondaryMessage,
        timeout = 5000
    ) => {
        const timeoutId = setTimeout(closeToast(identifier), timeout);
        setToasts(toasts => [
            ...toasts,
            { identifier, status, message, secondaryMessage }
        ]);
        setTimeouts(timeouts => [...timeouts, timeoutId]);
    };

    const updateToast = (
        targetedIdentifier,
        status,
        message,
        secondaryMessage,
        timeout = 5000
    ) => {
        const timeoutId = setTimeout(closeToast(targetedIdentifier), timeout);
        setToasts(toasts => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ identifier }) => identifier === targetedIdentifier
            );
            if (index !== -1) {
                updatedToasts.splice(index, 1);
            }
            return [
                ...updatedToasts,
                {
                    identifier: targetedIdentifier,
                    status,
                    message,
                    secondaryMessage
                }
            ];
        });
        setTimeouts(timeouts => [...timeouts, timeoutId]);
    };

    const closeToast = targetedIdentifier => () => {
        setToasts(toasts => {
            const updatedToasts = [...toasts];
            const index = updatedToasts.findIndex(
                ({ identifier }) => identifier === targetedIdentifier
            );
            updatedToasts.splice(index, 1);
            return updatedToasts;
        });
    };

    console.log("Toast state: ", toasts);

    return {
        list,
        modals,
        toggleModal,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toasts,
        openToast,
        updateToast,
        closeToast
    };
};
