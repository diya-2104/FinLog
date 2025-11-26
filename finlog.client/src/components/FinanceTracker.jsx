import React, { useState, useEffect } from 'react';

const FinanceTracker = ({ userId }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('accounts');

  // Account form state
  const [newAccount, setNewAccount] = useState({
    account_name: '',
    account_type: 'Asset',
    balance: 0
  });

  // Income form state
  const [newIncome, setNewIncome] = useState({
    amount: 0,
    account_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Expense form state
  const [newExpense, setNewExpense] = useState({
    eamount: 0,
    account_id: '',
    cid: '',
    description: '',
    edate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
    fetchTransactions();
  }, [userId]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`/api/account?uid=${userId}`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/expense/categories/user/${userId}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions/user/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAccount, uid: userId })
      });
      if (response.ok) {
        fetchAccounts();
        setNewAccount({ account_name: '', account_type: 'Asset', balance: 0 });
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newIncome, uid: userId })
      });
      if (response.ok) {
        fetchAccounts();
        fetchTransactions();
        setNewIncome({ amount: 0, account_id: '', description: '', date: new Date().toISOString().split('T')[0] });
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newExpense, uid: userId })
      });
      if (response.ok) {
        fetchAccounts();
        fetchTransactions();
        setNewExpense({ eamount: 0, account_id: '', cid: '', description: '', edate: new Date().toISOString().split('T')[0] });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="finance-tracker">
      <div className="tabs">
        <button onClick={() => setActiveTab('accounts')} className={activeTab === 'accounts' ? 'active' : ''}>
          Accounts
        </button>
        <button onClick={() => setActiveTab('income')} className={activeTab === 'income' ? 'active' : ''}>
          Add Income
        </button>
        <button onClick={() => setActiveTab('expense')} className={activeTab === 'expense' ? 'active' : ''}>
          Add Expense
        </button>
        <button onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? 'active' : ''}>
          Transactions
        </button>
      </div>

      {activeTab === 'accounts' && (
        <div className="accounts-section">
          <h3>Your Accounts</h3>
          <form onSubmit={handleAddAccount} className="add-account-form">
            <input
              type="text"
              placeholder="Account Name"
              value={newAccount.account_name}
              onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
              required
            />
            <select
              value={newAccount.account_type}
              onChange={(e) => setNewAccount({...newAccount, account_type: e.target.value})}
            >
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
            </select>
            <input
              type="number"
              placeholder="Initial Balance (₹)"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({...newAccount, balance: parseFloat(e.target.value)})}
              step="0.01"
              required
            />
            <button type="submit">Add Account</button>
          </form>
          
          <div className="accounts-list">
            {accounts.map(account => (
              <div key={account.account_id} className="account-card">
                <h4>{account.account_name}</h4>
                <p>Type: {account.account_type}</p>
                <p>Balance: ₹{account.balance.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'income' && (
        <div className="income-section">
          <h3>Add Income</h3>
          <form onSubmit={handleAddIncome} className="add-income-form">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: parseFloat(e.target.value)})}
              step="0.01"
              required
            />
            <select
              value={newIncome.account_id}
              onChange={(e) => setNewIncome({...newIncome, account_id: e.target.value})}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.account_id} value={account.account_id}>
                  {account.account_name} (₹{account.balance.toFixed(2)})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newIncome.description}
              onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
            />
            <input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
              required
            />
            <button type="submit">Add Income</button>
          </form>
        </div>
      )}

      {activeTab === 'expense' && (
        <div className="expense-section">
          <h3>Add Expense</h3>
          <form onSubmit={handleAddExpense} className="add-expense-form">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newExpense.eamount}
              onChange={(e) => setNewExpense({...newExpense, eamount: parseFloat(e.target.value)})}
              step="0.01"
              required
            />
            <select
              value={newExpense.account_id}
              onChange={(e) => setNewExpense({...newExpense, account_id: e.target.value})}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.account_id} value={account.account_id}>
                  {account.account_name} (₹{account.balance.toFixed(2)})
                </option>
              ))}
            </select>
            <select
              value={newExpense.cid}
              onChange={(e) => setNewExpense({...newExpense, cid: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.cid} value={category.cid}>
                  {category.cname}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
            <input
              type="date"
              value={newExpense.edate}
              onChange={(e) => setNewExpense({...newExpense, edate: e.target.value})}
              required
            />
            <button type="submit">Add Expense</button>
          </form>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <h3>Transaction History</h3>
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.tid} className={`transaction-card ${transaction.ttype}`}>
                <div className="transaction-header">
                  <span className="type">{transaction.ttype.toUpperCase()}</span>
                  <span className="amount">₹{transaction.tamount.toFixed(2)}</span>
                </div>
                <div className="transaction-details">
                  <p>Account: {transaction.account_name}</p>
                  <p>{transaction.ttype === 'income' ? 'Source' : 'Category'}: {transaction.ref_name}</p>
                  {transaction.description && <p>Description: {transaction.description}</p>}
                  <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceTracker;