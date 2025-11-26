# FinLog - Personal Finance Tracker

## Overview
FinLog is a comprehensive personal finance tracking application that allows users to manage their accounts, track income and expenses, and monitor transaction history.

## Key Features

### 1. Account Management
- **Add Accounts**: Create multiple accounts (Asset, Liability, Equity) with initial balances in Rupees
- **Track Balances**: Real-time balance updates when income/expenses are added
- **Account Types**: Support for different account types for better financial organization

### 2. Income Tracking
- **Add Income**: Record income with description and link to specific accounts
- **Account Selection**: Choose which account receives the income
- **Automatic Balance Update**: Account balance increases automatically
- **Transaction Logging**: All income entries are logged in transaction history

### 3. Expense Management
- **Add Expenses**: Record expenses with categories and descriptions
- **Account Deduction**: Select which account the expense is deducted from
- **Balance Validation**: Prevents expenses if insufficient account balance
- **Category Organization**: Organize expenses by categories for better tracking
- **Automatic Balance Update**: Account balance decreases automatically
- **Transaction Logging**: All expense entries are logged in transaction history

### 4. Transaction History
- **Complete Log**: View all income and expense transactions
- **Account Information**: See which account was affected by each transaction
- **Category/Source Details**: View expense categories or income sources
- **Date Tracking**: Chronological transaction history
- **Search & Filter**: Find specific transactions easily

## Workflow

### Step 1: Setup Accounts
1. Navigate to the "Accounts" tab
2. Add your various accounts (e.g., "Savings Account", "Cash", "Credit Card")
3. Set initial balances for each account
4. Choose appropriate account types

### Step 2: Record Income
1. Go to the "Add Income" tab
2. Enter the income amount in Rupees
3. Select the account where income should be added
4. Add a description (e.g., "Salary", "Freelance Payment")
5. Set the date
6. Submit - the account balance will increase automatically

### Step 3: Record Expenses
1. Go to the "Add Expense" tab
2. Enter the expense amount in Rupees
3. Select the account from which to deduct the expense
4. Choose an expense category
5. Add a description (e.g., "Groceries", "Fuel")
6. Set the date
7. Submit - the account balance will decrease automatically

### Step 4: Monitor Transactions
1. Visit the "Transactions" tab
2. View complete transaction history
3. See account balances and transaction details
4. Track your financial activity over time

## API Endpoints

### Accounts
- `GET /api/account?uid={userId}` - Get user accounts
- `POST /api/account` - Add new account
- `PUT /api/account/{id}/balance` - Update account balance
- `DELETE /api/account/{id}` - Delete account

### Income
- `GET /api/income/user/{userId}` - Get user income records
- `POST /api/income` - Add new income
- `PUT /api/income/{id}` - Update income record
- `DELETE /api/income/{id}` - Delete income record
- `GET /api/income/accounts/user/{userId}` - Get accounts for income

### Expenses
- `GET /api/expense/user/{userId}` - Get user expense records
- `POST /api/expense` - Add new expense
- `PUT /api/expense/{id}` - Update expense record
- `DELETE /api/expense/{id}` - Delete expense record
- `GET /api/expense/categories/user/{userId}` - Get expense categories
- `GET /api/expense/accounts/user/{userId}` - Get accounts for expenses

### Transactions
- `GET /api/transactions/user/{userId}` - Get user transaction history
- `GET /api/transactions/user/{userId}/search?q={query}` - Search transactions
- `GET /api/transactions/{transactionId}` - Get specific transaction

## Database Schema

### Key Tables
- **User**: User information and authentication
- **Account**: User accounts with balances and types
- **Income**: Income records linked to accounts
- **Expense**: Expense records linked to accounts and categories
- **Category**: Expense categories for organization
- **Transactions**: Complete transaction log for audit trail

### Key Relationships
- Users have multiple Accounts
- Income records are linked to specific Accounts
- Expense records are linked to both Accounts and Categories
- All financial activities are logged in Transactions table

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js and npm
- PostgreSQL database

### Setup
1. Clone the repository
2. Set up the database connection in `appsettings.json`
3. Run migrations: `dotnet ef database update`
4. Start the backend: `dotnet run` (in FinLog.Server directory)
5. Start the frontend: `npm start` (in finlog.client directory)
6. Navigate to `/finance-tracker` route to use the application

### Usage
1. Register/Login to the application
2. Start by adding your accounts with initial balances
3. Record your income and expenses
4. Monitor your financial activity through the transaction history

## Features in Detail

### Account Balance Management
- Real-time balance updates
- Prevents overdrafts (insufficient balance validation)
- Support for multiple currencies (currently Rupees)

### Transaction Logging
- Every income and expense is automatically logged
- Maintains audit trail for financial activities
- Links transactions to specific accounts for detailed tracking

### Category Management
- Organize expenses by categories
- Better financial analysis and reporting
- Customizable categories per user

This finance tracker provides a complete solution for personal financial management with proper account-based tracking, ensuring accurate balance management and comprehensive transaction history.