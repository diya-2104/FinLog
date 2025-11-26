using FinLog.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinLog.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {

        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("daily-spending/{uid}")]
        public async Task<IActionResult> GetDailySpending(int uid)
        {
            var data = await _context.Transactions
                .Where(t => t.uid == uid && t.ttype == "expense")
                .GroupBy(t => t.created_at.DayOfWeek)
                .Select(g => new {
                    day = g.Key.ToString(),
                    total = g.Sum(x => x.tamount)
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("category-summary/{uid}")]
        public async Task<IActionResult> GetCategorySummary(int uid)
        {
            var data = await _context.Transactions
                .Where(t => t.uid == uid && t.ttype == "expense")
                .GroupBy(t => t.cid)
                .Select(g => new {
                    category = _context.Categories.First(c => c.cid == g.Key).cname,
                    total = g.Sum(x => x.tamount)
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("income-expense/{uid}")]
        public async Task<IActionResult> GetIncomeVsExpense(int uid)
        {
            var data = await _context.Transactions
                .Where(t => t.uid == uid)
                .GroupBy(t => t.created_at.Month)
                .Select(g => new {
                    month = g.Key,
                    income = g.Where(x => x.ttype == "income").Sum(x => x.tamount),
                    expense = g.Where(x => x.ttype == "expense").Sum(x => x.tamount)
                })
                .OrderBy(x => x.month)
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("monthly-trend/{uid}")]
        public async Task<IActionResult> GetMonthlyTrend(int uid)
        {
            var data = await _context.Transactions
                .Where(t => t.uid == uid && t.ttype == "expense")
                .GroupBy(t => t.created_at.Month)
                .Select(g => new {
                    month = g.Key,
                    total = g.Sum(x => x.tamount)
                })
                .OrderBy(x => x.month)
                .ToListAsync();

            return Ok(data);
        }
    }
}
