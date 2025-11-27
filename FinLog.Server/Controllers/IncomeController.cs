using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace FinLog.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IncomeController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // Helper: Log transaction
        // ============================
        private async Task LogTransaction(
            int uid,
            int account_id,
            int ref_id,
            decimal amount,
            string ttype,
            int cid,
            string? description = null,
            DateTime? createdAt = null
        )
        {
            var transaction = new Transactions
            {
                uid = uid,
                account_id = account_id,
                ref_id = ref_id,
                cid = cid,                      // <-- NEW FIELD ADDED
                tamount = amount,
                ttype = ttype,
                description = description,
                created_at = createdAt ?? DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        // ============================
        // GET: api/income/user/{uid}
        // ============================
        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetUserIncomes(int uid)
        {
            var incomes = await _context.Incomes
                .Include(i => i.Account)
                .Include(i => i.Category)
                .Where(i => i.uid == uid)
                .OrderByDescending(i => i.date)
                .Select(i => new IncomeDto
                {
                    iid = i.iid,
                    date = i.date,
                    amount = i.amount,
                    Budget = i.Budget,
                    account_id = i.account_id,
                    account_name = i.Account != null ? i.Account.account_name : null,
                    cid = i.cid,
                    cname = i.Category != null ? i.Category.cname : null
                })
                .ToListAsync();

            return Ok(incomes);
        }

        // ============================
        // POST: api/income
        // ============================
        [HttpPost]
        public async Task<IActionResult> AddIncome([FromBody] Income income)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                if (income.date.Kind == DateTimeKind.Unspecified)
                    income.date = DateTime.SpecifyKind(income.date, DateTimeKind.Utc);

                _context.Incomes.Add(income);
                await _context.SaveChangesAsync();

                var account = await _context.Accounts.FindAsync(income.account_id);
                if (account != null)
                {
                    account.balance += income.amount;
                    await _context.SaveChangesAsync();
                }

                // Log transaction with CID included
                await LogTransaction(
                    income.uid,
                    income.account_id,
                    income.iid,
                    income.amount,
                    "income",
                    income.cid,                                     // NEW
                    description: $"Income added under category ID {income.cid}",
                    createdAt: income.date
                );

                var dto = new IncomeDto
                {
                    iid = income.iid,
                    date = income.date,
                    amount = income.amount,
                    Budget = income.Budget,
                    account_id = income.account_id,
                    account_name = account?.account_name,
                    cid = income.cid,
                    cname = (await _context.Categories.FindAsync(income.cid))?.cname
                };

                return Ok(dto);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    message = "Error saving income",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ============================
        // PUT: api/income/{iid}
        // ============================
        [HttpPut("{iid}")]
        public async Task<IActionResult> UpdateIncome(int iid, [FromBody] Income updatedIncome)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existingIncome = await _context.Incomes.FindAsync(iid);
                if (existingIncome == null)
                    return NotFound(new { message = "Income not found" });

                // Adjust balance if required
                if (existingIncome.amount != updatedIncome.amount ||
                    existingIncome.account_id != updatedIncome.account_id)
                {
                    var oldAcc = await _context.Accounts.FindAsync(existingIncome.account_id);
                    if (oldAcc != null)
                        oldAcc.balance -= existingIncome.amount;

                    var newAcc = await _context.Accounts.FindAsync(updatedIncome.account_id);
                    if (newAcc != null)
                        newAcc.balance += updatedIncome.amount;
                }

                // Update values
                existingIncome.date = updatedIncome.date;
                existingIncome.amount = updatedIncome.amount;
                existingIncome.Budget = updatedIncome.Budget;
                existingIncome.account_id = updatedIncome.account_id;
                existingIncome.cid = updatedIncome.cid;
                existingIncome.uid = updatedIncome.uid;

                _context.Incomes.Update(existingIncome);
                await _context.SaveChangesAsync();

                // Log update
                await LogTransaction(
                    updatedIncome.uid,
                    updatedIncome.account_id,
                    existingIncome.iid,
                    updatedIncome.amount,
                    "income",
                    updatedIncome.cid,                    // NEW
                    description: $"Income updated under category ID {updatedIncome.cid}",
                    createdAt: updatedIncome.date
                );

                var dto = new IncomeDto
                {
                    iid = existingIncome.iid,
                    date = existingIncome.date,
                    amount = existingIncome.amount,
                    Budget=existingIncome.Budget,
                    account_id = existingIncome.account_id,
                    account_name = (await _context.Accounts.FindAsync(existingIncome.account_id))?.account_name,
                    cid = existingIncome.cid,
                    cname = (await _context.Categories.FindAsync(existingIncome.cid))?.cname
                };

                return Ok(dto);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    message = "Error updating income",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ============================
        // DELETE: api/income/{iid}
        // ============================
        [HttpDelete("{iid}")]
        public async Task<IActionResult> DeleteIncome(int iid)
        {
            try
            {
                var income = await _context.Incomes.FindAsync(iid);
                if (income == null)
                    return NotFound(new { message = "Income not found" });

                var account = await _context.Accounts.FindAsync(income.account_id);
                if (account != null)
                {
                    account.balance -= income.amount;
                }

                _context.Incomes.Remove(income);
                await _context.SaveChangesAsync();

                // Log negative transaction with CID
                await LogTransaction(
                    income.uid,
                    income.account_id,
                    income.iid,
                    -income.amount,
                    "income",
                    income.cid,                           // NEW
                    description: $"Deleted income under category ID {income.cid}",
                    createdAt: income.date
                );

                return Ok(new { message = "Income deleted successfully", iid });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    message = "Error deleting income",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ============================
        // GET Accounts
        // ============================
        [HttpGet("accounts/user/{uid}")]
        public async Task<IActionResult> GetAccounts(int uid)
        {
            var accounts = await _context.Accounts
                .Where(a => a.uid == uid)
                .ToListAsync();

            return Ok(accounts);
        }

        // ============================
        // GET Categories
        // ============================
        [HttpGet("categories/user/{uid}")]
        public async Task<IActionResult> GetCategories(int uid)
        {
            var categories = await _context.Categories
                .Where(c => c.uid == uid)
                .ToListAsync();

            return Ok(categories);
        }
    }
}
