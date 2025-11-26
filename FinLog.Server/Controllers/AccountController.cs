using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccounts([FromQuery] int uid)
        {
            var accounts = await _context.Accounts
                .Where(a => a.uid == uid)
                .ToListAsync();

            return Ok(accounts);
        }

        [HttpPost]
        public async Task<IActionResult> AddAccount([FromBody] Account account)
        {
            if (account == null || string.IsNullOrWhiteSpace(account.account_name))
                return BadRequest("Account data is invalid.");

            var userExists = await _context.Users.AnyAsync(u => u.uid == account.uid);
            if (!userExists)
                return BadRequest($"User with id {account.uid} not found.");

            account.created_at = DateTime.UtcNow;
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(account);
        }

        [HttpPut("{id}/balance")]
        public async Task<IActionResult> UpdateBalance(int id, [FromBody] decimal amount)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                return NotFound($"Account with id {id} not found.");

            account.balance += amount;
            await _context.SaveChangesAsync();

            return Ok(account);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
                return NotFound($"Account with id {id} not found.");

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account deleted successfully.", account });
        }
    }
}