//using FinLog.Server.Data;
//using FinLog.Server.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace FinLog.Server.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class TransactionsController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public TransactionsController(AppDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/transactions/user/19
//        [HttpGet("user/{uid}")]
//        public async Task<IActionResult> GetUserTransactions(int uid)
//        {
//            var transactions = await _context.Transactions
//                .Include(t => t.Category)
//                .Where(t => t.uid == uid)
//                .Select(t => new TransactionDto
//                {
//                    tid = t.tid,
//                    uid = t.uid,
//                    cid = t.cid,
//                    cname = t.Category != null ? t.Category.cname : null,
//                    ttype = t.ttype,
//                    description = t.description,
//                    tamount = t.tamount,
//                    created_at = t.created_at
//                })
//                .ToListAsync();

//            return Ok(transactions);
//        }

//        // POST: api/transactions
//        [HttpPost]
//        public async Task<IActionResult> CreateTransaction([FromBody] TransactionDto dto)
//        {
//            if (dto == null) return BadRequest();

//            // Optional: validate category exists
//            var category = await _context.Categories.FindAsync(dto.cid);
//            if (category == null)
//                return BadRequest("Invalid category id.");

//            var transaction = new Transactions
//            {
//                uid = dto.uid,
//                cid = dto.cid,
//                ttype = dto.ttype,
//                description = dto.description,
//                tamount = dto.tamount,
//                created_at = dto.created_at
//            };

//            _context.Transactions.Add(transaction);
//            await _context.SaveChangesAsync();

//            // Return saved object with tid
//            dto.tid = transaction.tid;
//            dto.cname = category.cname;

//            return Ok(dto);
//        }
//    }
//}
using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // ============================
        // GET: api/transactions/user/17
        // ============================
        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetUserTransactions(int uid)
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Where(t => t.uid == uid)
                .OrderByDescending(t => t.created_at)
                .Select(t => new TransactionDto
                {
                    tid = t.tid,
                    uid = t.uid,
                    cid = t.cid,
                    cname = t.Category != null ? t.Category.cname : null,
                    account_id = t.account_id,
                    account_name = t.Account != null ? t.Account.account_name : null,
                    ttype = t.ttype,
                    description = t.description,
                    tamount = t.tamount,
                    created_at = t.created_at
                })
                .ToListAsync();

            return Ok(transactions);
        }

        // ============================
        // GET: api/transactions/user/17/search?q=salary
        // ============================
        [HttpGet("user/{uid}/search")]
        public async Task<IActionResult> SearchTransactions(int uid, [FromQuery] string? q)
        {
            var query = _context.Transactions
                                .Include(t => t.Category)
                                  .Include(t => t.Account)
                                .Where(t => t.uid == uid);

            if (!string.IsNullOrWhiteSpace(q))
            {
                q = q.ToLower();
                query = query.Where(t =>
                    (t.Category != null && t.Category.cname.ToLower().Contains(q)) ||
                    (t.Account != null && t.Account.account_name.ToLower().Contains(q)) || // search by account name
                    t.ttype.ToLower().Contains(q) ||
                    (t.description != null && t.description.ToLower().Contains(q)) ||
                    t.tamount.ToString().Contains(q) ||
                    t.created_at.ToString("yyyy-MM-dd").Contains(q)
                );
            }

            var transactions = await query
                .OrderByDescending(t => t.created_at)
                .Select(t => new TransactionDto
                {
                    tid = t.tid,
                    uid = t.uid,
                    cid = t.cid,
                    cname = t.Category != null ? t.Category.cname : null,
                    account_id = t.account_id,
                    account_name = t.Account != null ? t.Account.account_name : null,
                    ttype = t.ttype,
                    description = t.description,
                    tamount = t.tamount,
                    created_at = t.created_at
                })
                .ToListAsync();

            return Ok(transactions);
        }


        // ============================
        // GET: api/transactions/{tid}
        // ============================
        [HttpGet("{tid}")]
        public async Task<IActionResult> GetTransactionById(int tid)
        {
            var t = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.tid == tid);

            if (t == null)
                return NotFound(new { message = "Transaction not found" });

            var dto = new TransactionDto
            {
                tid = t.tid,
                uid = t.uid,
                cid = t.cid,
                cname = t.Category != null ? t.Category.cname : null,
                account_id = t.account_id,
                account_name = t.Account != null ? t.Account.account_name : null,
                ttype = t.ttype,
                description = t.description,
                tamount = t.tamount,
                created_at = t.created_at
            };


            return Ok(dto);
        }
    }
}
