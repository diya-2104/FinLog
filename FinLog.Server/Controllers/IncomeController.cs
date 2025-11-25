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
        private async Task LogTransaction(int uid, int cid, decimal amount, string ttype, string? description = null, DateTime? createdAt = null)
        {
            var transaction = new Transactions
            {
                uid = uid,
                cid = cid,
                tamount = amount,
                ttype =  "income",
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
                .Include(i => i.Category)
                .Where(i => i.uid == uid)
                .OrderByDescending(i => i.date)
                .Select(i => new IncomeDto
                {
                    iid = i.iid,
                    date = i.date,
                    amount = i.amount,
                    Budget = i.Budget,
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

                // Log transaction automatically
                await LogTransaction(income.uid, income.cid, income.amount, "income", income.Budget.ToString(), income.date);

                var dto = new IncomeDto
                {
                    iid = income.iid,
                    date = income.date,
                    amount = income.amount,
                    Budget = income.Budget,
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

                // Update fields
                existingIncome.date = updatedIncome.date;
                existingIncome.amount = updatedIncome.amount;
                existingIncome.Budget = updatedIncome.Budget;
                existingIncome.cid = updatedIncome.cid;
                existingIncome.uid = updatedIncome.uid;

                _context.Incomes.Update(existingIncome);
                await _context.SaveChangesAsync();

                // Optional: log updated transaction
                await LogTransaction(existingIncome.uid, existingIncome.cid, existingIncome.amount, "income", existingIncome.Budget.ToString(), existingIncome.date);

                var dto = new IncomeDto
                {
                    iid = existingIncome.iid,
                    date = existingIncome.date,
                    amount = existingIncome.amount,
                    Budget = existingIncome.Budget,
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

                _context.Incomes.Remove(income);
                await _context.SaveChangesAsync();

                // Optional: log negative transaction
                await LogTransaction(income.uid, income.cid, -income.amount, "income", "Deleted income", income.date);

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
        // GET: api/income/categories/user/17
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

