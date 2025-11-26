using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Services
{
    public interface IAccountingService
    {
        Task<bool> RecordIncomeAsync(Income income, int cashAccountId);
        Task<bool> RecordExpenseAsync(Expense expense, int cashAccountId);
        Task<decimal> GetAccountBalanceAsync(int accountId);
        Task<bool> ValidateAccountingEquationAsync(int userId);
    }

    //public class AccountingService : IAccountingService
    //{
    //    private readonly AppDbContext _context;

    //    public AccountingService(AppDbContext context)
    //    {
    //        _context = context;
    //    }

    //    public async Task<bool> RecordIncomeAsync(Income income, int cashAccountId)
    //    {
    //        var transactionRef = Guid.NewGuid().ToString();

    //        // Debit: Cash Account (Asset increases)
    //        var debitEntry = new AccountingEntry
    //        {
    //            uid = income.uid,
    //            transaction_reference = transactionRef,
    //            account_id = cashAccountId,
    //            debit_amount = income.amount,
    //            credit_amount = 0,
    //            description = $"Income: {income.description ?? "Income received"}",
    //            source_type = "Income",
    //            source_id = income.iid
    //        };

    //        // Credit: Income Account (Income increases)
    //        var creditEntry = new AccountingEntry
    //        {
    //            uid = income.uid,
    //            transaction_reference = transactionRef,
    //            account_id = income.account_id,
    //            debit_amount = 0,
    //            credit_amount = income.amount,
    //            description = $"Income: {income.description ?? "Income received"}",
    //            source_type = "Income",
    //            source_id = income.iid
    //        };

    //        _context.AccountingEntries.AddRange(debitEntry, creditEntry);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }

    //    public async Task<bool> RecordExpenseAsync(Expense expense, int cashAccountId)
    //    {
    //        var transactionRef = Guid.NewGuid().ToString();

    //        // Debit: Expense Account (Expense increases)
    //        var debitEntry = new AccountingEntry
    //        {
    //            uid = expense.uid,
    //            transaction_reference = transactionRef,
    //            account_id = expense.cid, // Assuming category maps to expense account
    //            debit_amount = expense.eamount,
    //            credit_amount = 0,
    //            description = $"Expense: {expense.description ?? "Expense paid"}",
    //            source_type = "Expense",
    //            source_id = expense.eid
    //        };

    //        // Credit: Cash Account (Asset decreases)
    //        var creditEntry = new AccountingEntry
    //        {
    //            uid = expense.uid,
    //            transaction_reference = transactionRef,
    //            account_id = cashAccountId,
    //            debit_amount = 0,
    //            credit_amount = expense.eamount,
    //            description = $"Expense: {expense.description ?? "Expense paid"}",
    //            source_type = "Expense",
    //            source_id = expense.eid
    //        };

    //        _context.AccountingEntries.AddRange(debitEntry, creditEntry);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }

    //    public async Task<decimal> GetAccountBalanceAsync(int accountId)
    //    {
    //        var account = await _context.Accounts.FindAsync(accountId);
    //        if (account == null) return 0;

    //        var entries = await _context.AccountingEntries
    //            .Where(e => e.account_id == accountId)
    //            .ToListAsync();

    //        var totalDebits = entries.Sum(e => e.debit_amount);
    //        var totalCredits = entries.Sum(e => e.credit_amount);

    //        // Normal balance calculation based on account type
    //        return account.account_type switch
    //        {
    //            "Asset" or "Expense" => totalDebits - totalCredits,
    //            "Liability" or "Equity" or "Income" => totalCredits - totalDebits,
    //            _ => 0
    //        };
    //    }

    //    public async Task<bool> ValidateAccountingEquationAsync(int userId)
    //    {
    //        var entries = await _context.AccountingEntries
    //            .Include(e => e.Account)
    //            .Where(e => e.uid == userId)
    //            .ToListAsync();

    //        var totalDebits = entries.Sum(e => e.debit_amount);
    //        var totalCredits = entries.Sum(e => e.credit_amount);

    //        // Debits must equal Credits
    //        return Math.Abs(totalDebits - totalCredits) < 0.01m;
    //    }
    //}
}