//using FinLog.Server.Data;
//using FinLog.Server.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;


//namespace FinLog.Server.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class IncomeController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public IncomeController(AppDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/income/user/17
//        [HttpGet("user/{uid}")]
//        public async Task<IActionResult> GetUserIncomes(int uid)
//        {
//            var incomes = await _context.Incomes
//                .Include(i => i.Category)
//                .Where(i => i.uid == uid)
//                .OrderByDescending(i => i.date)
//                .Select(i => new IncomeDto
//                {
//                    iid = i.iid,
//                    date = i.date,
//                    amount = i.amount,
//                    Budget = i.Budget,
//                    cid = i.cid,
//                    cname = i.Category != null ? i.Category.cname : null
//                })
//                .ToListAsync();

//            return Ok(incomes);
//        }

//        // POST: api/income
//        [HttpPost]
//        public async Task<IActionResult> AddIncome([FromBody] Income income)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            try
//            {
//                // Ensure the date is UTC
//                if (income.date.Kind == DateTimeKind.Unspecified)
//                    income.date = DateTime.SpecifyKind(income.date, DateTimeKind.Utc);

//                // Remove these lines:
//                // income.Category = null;
//                // income.User = null;

//                _context.Incomes.Add(income);
//                await _context.SaveChangesAsync();

//                // Return DTO
//                var dto = new IncomeDto
//                {
//                    iid = income.iid,
//                    date = income.date,
//                    amount = income.amount,
//                    Budget = income.Budget,
//                    cid = income.cid,
//                    cname = null  // optional: you can populate category name if needed
//                };

//                return Ok(dto);
//            }
//            catch (DbUpdateException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Error saving income",
//                    details = ex.InnerException?.Message ?? ex.Message
//                });
//            }
//        }


//        // GET: api/income/categories/user/17
//        [HttpGet("categories/user/{uid}")]
//        public async Task<IActionResult> GetCategories(int uid)
//        {
//            var categories = await _context.Categories
//                .Where(c => c.uid == uid)
//                .ToListAsync();

//            return Ok(categories);
//        }
//        // DELETE: api/income/{iid}
//        [HttpDelete("{iid}")]
//        public async Task<IActionResult> DeleteIncome(int iid)
//        {
//            try
//            {
//                var income = await _context.Incomes.FindAsync(iid);
//                if (income == null)
//                    return NotFound(new { message = "Income not found" });

//                _context.Incomes.Remove(income);
//                await _context.SaveChangesAsync();

//                return Ok(new { message = "Income deleted successfully", iid });
//            }
//            catch (DbUpdateException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Error deleting income",
//                    details = ex.InnerException?.Message ?? ex.Message
//                });
//            }
//        }

//        // PUT: api/income/{iid}
//        [HttpPut("{iid}")]
//        public async Task<IActionResult> UpdateIncome(int iid, [FromBody] Income updatedIncome)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            try
//            {
//                var existingIncome = await _context.Incomes.FindAsync(iid);
//                if (existingIncome == null)
//                    return NotFound(new { message = "Income not found" });

//                // Update fields
//                existingIncome.date = updatedIncome.date;
//                existingIncome.amount = updatedIncome.amount;
//                existingIncome.Budget = updatedIncome.Budget;
//                existingIncome.cid = updatedIncome.cid;
//                existingIncome.uid = updatedIncome.uid;

//                _context.Incomes.Update(existingIncome);
//                await _context.SaveChangesAsync();

//                // Return updated DTO
//                var dto = new IncomeDto
//                {
//                    iid = existingIncome.iid,
//                    date = existingIncome.date,
//                    amount = existingIncome.amount,
//                    Budget = existingIncome.Budget,
//                    cid = existingIncome.cid,
//                    cname = (await _context.Categories.FindAsync(existingIncome.cid))?.cname
//                };

//                return Ok(dto);
//            }
//            catch (DbUpdateException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Error updating income",
//                    details = ex.InnerException?.Message ?? ex.Message
//                });
//            }
//        }

//    }
//}
using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        private async Task LogTransaction(int uid, int account_id, int ref_id, decimal amount, string ttype, string? description = null, DateTime? createdAt = null)
        {
            var transaction = new Transactions
            {
                uid = uid,
                account_id = account_id,
                ref_id = ref_id,
                tamount = amount,
                ttype = ttype,
                description = description,
                created_at = createdAt ?? DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        // ============================
        // GET: api/income/user/17
        // ============================
        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetUserIncomes(int uid)
        {
            var incomes = await _context.Incomes
                .Include(i => i.Account)
                .Where(i => i.uid == uid)
                .OrderByDescending(i => i.date)
                .Select(i => new IncomeDto
                {
                    iid = i.iid,
                    date = i.date,
                    amount = i.amount,
                    description = i.description,
                    account_id = i.account_id,
                    account_name = i.Account != null ? i.Account.account_name : null
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

                // Add income
                _context.Incomes.Add(income);
                await _context.SaveChangesAsync();

                // Update account balance
                var account = await _context.Accounts.FindAsync(income.account_id);
                if (account != null)
                {
                    account.balance += income.amount;
                    await _context.SaveChangesAsync();
                }

                // Log transaction
                await LogTransaction(income.uid, income.account_id, income.iid, income.amount, "income", income.description, income.date);

                var dto = new IncomeDto
                {
                    iid = income.iid,
                    date = income.date,
                    amount = income.amount,
                    description = income.description,
                    account_id = income.account_id,
                    account_name = account?.account_name
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

                // Update fields
                existingIncome.date = updatedIncome.date;
                existingIncome.amount = updatedIncome.amount;
                existingIncome.description = updatedIncome.description;
                existingIncome.account_id = updatedIncome.account_id;
                existingIncome.uid = updatedIncome.uid;

                _context.Incomes.Update(existingIncome);
                await _context.SaveChangesAsync();

                var dto = new IncomeDto
                {
                    iid = existingIncome.iid,
                    date = existingIncome.date,
                    amount = existingIncome.amount,
                    description = existingIncome.description,
                    account_id = existingIncome.account_id,
                    account_name = (await _context.Accounts.FindAsync(existingIncome.account_id))?.account_name
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

                // Update account balance
                var account = await _context.Accounts.FindAsync(income.account_id);
                if (account != null)
                {
                    account.balance -= income.amount;
                }

                _context.Incomes.Remove(income);
                await _context.SaveChangesAsync();

                // Log negative transaction
                await LogTransaction(income.uid, income.account_id, income.iid, -income.amount, "income", "Deleted income", income.date);

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
        // GET: api/income/accounts/user/17
        // ============================
        [HttpGet("accounts/user/{uid}")]
        public async Task<IActionResult> GetAccounts(int uid)
        {
            var accounts = await _context.Accounts
                .Where(a => a.uid == uid)
                .ToListAsync();

            return Ok(accounts);
        }
    }
}

