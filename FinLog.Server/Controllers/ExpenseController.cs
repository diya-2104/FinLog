//using FinLog.Server.Data;
//using FinLog.Server.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace FinLog.Server.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ExpenseController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public ExpenseController(AppDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/expense/user/17
//        [HttpGet("user/{uid}")]
//        public async Task<IActionResult> GetUserExpenses(int uid)
//        {
//            var expenses = await _context.Expenses
//                .Include(e => e.Category)
//                .Where(e => e.uid == uid)
//                .OrderByDescending(e => e.edate)
//                .Select(e => new ExpenseDto
//                {
//                    eid = e.eid,
//                    edate = e.edate,
//                    eamount = e.eamount,
//                    cid = e.cid,
//                    cname = e.Category != null ? e.Category.cname : null,
//                    uid = e.uid
//                })
//                .ToListAsync();

//            return Ok(expenses);
//        }

//        // GET: api/expense/categories/user/17
//        [HttpGet("categories/user/{uid}")]
//        public async Task<IActionResult> GetCategories(int uid)
//        {
//            var categories = await _context.Categories
//                .Where(c => c.uid == uid)
//                .ToListAsync();
//            return Ok(categories);
//        }

//        // POST: api/expense
//        [HttpPost]
//        public async Task<IActionResult> AddExpense([FromBody] ExpenseDto dto)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            try
//            {
//                var userExists = await _context.User.AnyAsync(u => u.uid == dto.uid);
//                if (!userExists) return BadRequest("User does not exist.");

//                var categoryExists = await _context.Categories.AnyAsync(c => c.cid == dto.cid);
//                if (!categoryExists) return BadRequest("Category does not exist.");

//                var expense = new Expense
//                {
//                    uid = dto.uid,
//                    cid = dto.cid,
//                    eamount = dto.eamount,
//                    edate = dto.edate.Kind == DateTimeKind.Unspecified
//                        ? DateTime.SpecifyKind(dto.edate, DateTimeKind.Utc)
//                        : dto.edate
//                };

//                _context.Expenses.Add(expense);
//                await _context.SaveChangesAsync();

//                var resultDto = new ExpenseDto
//                {
//                    eid = expense.eid,
//                    uid = expense.uid,
//                    cid = expense.cid,
//                    eamount = expense.eamount,
//                    edate = expense.edate,
//                    cname = (await _context.Categories.FindAsync(expense.cid))?.cname
//                };

//                return Ok(resultDto);
//            }
//            catch (DbUpdateException ex)
//            {
//                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
//                return StatusCode(500, new
//                {
//                    message = "Error saving expense",
//                    details = ex.InnerException?.Message ?? ex.Message
//                });
//            }

//        }
//        // PUT: api/expense/{id}
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseDto dto)
//        {
//            if (id != dto.eid) return BadRequest("Expense ID mismatch.");
//            if (!ModelState.IsValid) return BadRequest(ModelState);

//            var expense = await _context.Expenses.FindAsync(id);
//            if (expense == null) return NotFound("Expense not found.");

//            expense.cid = dto.cid;
//            expense.eamount = dto.eamount;
//            expense.edate = dto.edate.Kind == DateTimeKind.Unspecified
//                ? DateTime.SpecifyKind(dto.edate, DateTimeKind.Utc)
//                : dto.edate;

//            try
//            {
//                await _context.SaveChangesAsync();
//                var updated = new ExpenseDto
//                {
//                    eid = expense.eid,
//                    uid = expense.uid,
//                    cid = expense.cid,
//                    eamount = expense.eamount,
//                    edate = expense.edate,
//                    cname = (await _context.Categories.FindAsync(expense.cid))?.cname
//                };
//                return Ok(updated);
//            }
//            catch (DbUpdateException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Error updating expense",
//                    details = ex.InnerException?.Message ?? ex.Message
//                });
//            }
//        }

//        // DELETE: api/expense/{id}
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteExpense(int id)
//        {
//            var expense = await _context.Expenses.FindAsync(id);
//            if (expense == null)
//                return NotFound("Expense not found.");

//            _context.Expenses.Remove(expense);
//            await _context.SaveChangesAsync();
//            return Ok(new { message = "Expense deleted successfully." });
//        }

//        // GET: api/expense/monthly-bills/17
//        [HttpGet("monthly-bills/{uid}")]
//        public async Task<IActionResult> GetMonthlyBills(int uid)
//        {
//            var now = DateTime.UtcNow;
//            int month = now.Month;
//            int year = now.Year;

//            var monthlyTotal = await _context.Expenses
//                .Where(e => e.uid == uid &&
//                            e.edate.Month == month &&
//                            e.edate.Year == year)
//                .SumAsync(e => (decimal?)e.eamount) ?? 0;

//            return Ok(new
//            {
//                month,
//                year,
//                total = monthlyTotal
//            });
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
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpenseController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // Helper: Log transaction
        // ============================
        private async Task LogTransaction(int uid, int cid, decimal amount, string ttype, string? description = null, DateTime? createdAt = null)
        {
            var transaction = new Transactions
            {
                uid = uid,
                cid = cid,
                tamount = amount,
                ttype = "expense",
                description = description,
                created_at = createdAt ?? DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        // ============================
        // GET: api/expense/user/17
        // ============================
        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetUserExpenses(int uid)
        {
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.uid == uid)
                .OrderByDescending(e => e.edate)
                .Select(e => new ExpenseDto
                {
                    eid = e.eid,
                    edate = e.edate,
                    eamount = e.eamount,
                    cid = e.cid,
                    cname = e.Category != null ? e.Category.cname : null,
                    uid = e.uid
                })
                .ToListAsync();

            return Ok(expenses);
        }

        // ============================
        // GET: api/expense/categories/user/17
        // ============================
        [HttpGet("categories/user/{uid}")]
        public async Task<IActionResult> GetCategories(int uid)
        {
            var categories = await _context.Categories
                .Where(c => c.uid == uid)
                .ToListAsync();
            return Ok(categories);
        }

        // ============================
        // POST: api/expense
        // ============================
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] ExpenseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userExists = await _context.User.AnyAsync(u => u.uid == dto.uid);
                if (!userExists) return BadRequest("User does not exist.");

                var categoryExists = await _context.Categories.AnyAsync(c => c.cid == dto.cid);
                if (!categoryExists) return BadRequest("Category does not exist.");

                var expense = new Expense
                {
                    uid = dto.uid,
                    cid = dto.cid,
                    eamount = dto.eamount,
                    edate = dto.edate.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(dto.edate, DateTimeKind.Utc)
                        : dto.edate
                };

                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();

                // Log transaction automatically
                await LogTransaction(expense.uid, expense.cid, expense.eamount, "expense", "New expense", expense.edate);

                var resultDto = new ExpenseDto
                {
                    eid = expense.eid,
                    uid = expense.uid,
                    cid = expense.cid,
                    eamount = expense.eamount,
                    edate = expense.edate,
                    cname = (await _context.Categories.FindAsync(expense.cid))?.cname
                };

                return Ok(resultDto);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    message = "Error saving expense",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ============================
        // PUT: api/expense/{id}
        // ============================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseDto dto)
        {
            if (id != dto.eid) return BadRequest("Expense ID mismatch.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound("Expense not found.");

            expense.cid = dto.cid;
            expense.eamount = dto.eamount;
            expense.edate = dto.edate.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(dto.edate, DateTimeKind.Utc)
                : dto.edate;

            try
            {
                await _context.SaveChangesAsync();

                // Log updated transaction
                await LogTransaction(expense.uid, expense.cid, expense.eamount, "expense", "Updated expense", expense.edate);

                var updated = new ExpenseDto
                {
                    eid = expense.eid,
                    uid = expense.uid,
                    cid = expense.cid,
                    eamount = expense.eamount,
                    edate = expense.edate,
                    cname = (await _context.Categories.FindAsync(expense.cid))?.cname
                };
                return Ok(updated);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new
                {
                    message = "Error updating expense",
                    details = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ============================
        // DELETE: api/expense/{id}
        // ============================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
                return NotFound("Expense not found.");

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            // Log negative transaction for deleted expense
            await LogTransaction(expense.uid, expense.cid, -expense.eamount, "expense", "Deleted expense", expense.edate);

            return Ok(new { message = "Expense deleted successfully." });
        }

        // ============================
        // GET: api/expense/monthly-bills/17
        // ============================
        [HttpGet("monthly-bills/{uid}")]
        public async Task<IActionResult> GetMonthlyBills(int uid)
        {
            var now = DateTime.UtcNow;
            int month = now.Month;
            int year = now.Year;

            var monthlyTotal = await _context.Expenses
                .Where(e => e.uid == uid &&
                            e.edate.Month == month &&
                            e.edate.Year == year)
                .SumAsync(e => (decimal?)e.eamount) ?? 0;

            return Ok(new
            {
                month,
                year,
                total = monthlyTotal
            });
        }
    }
}
