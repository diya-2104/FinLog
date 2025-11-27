using FinLog.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/stats")]
    public class AdminStatController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContext;
        private readonly AppDbContext _db;

        public AdminStatController(IHttpContextAccessor httpContext, AppDbContext db)
        {
            _httpContext = httpContext;
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            Console.WriteLine("Stats endpoint called!");

            try
            {
                // Debug: check connection string
                Console.WriteLine($"DB Connection: {_db.Database.GetConnectionString()}");

                // Fetch all users from singular DbSet
                var allUsers = await _db.User.ToListAsync();
                Console.WriteLine($"All users count: {allUsers.Count}");

                if (allUsers.Count == 0)
                {
                    Console.WriteLine("Warning: No users found in DB!");
                }

                // Compute stats
                var totalUsers = allUsers.Count;
                var verifiedUsers = allUsers.Count(u => u.IsEmailVerified);
                var unverifiedUsers = totalUsers - verifiedUsers;
                var activeUsers = (int)(totalUsers * 0.6); // example active users

                // Return JSON
                var stats = new
                {
                    TotalUsers = totalUsers,
                    VerifiedUsers = verifiedUsers,
                    UnverifiedUsers = unverifiedUsers,
                    ActiveUsers = activeUsers
                };

                Console.WriteLine($"Stats computed: Total={totalUsers}, Verified={verifiedUsers}, Unverified={unverifiedUsers}, Active={activeUsers}");

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Optional test endpoint
        [HttpGet("test")]
        public IActionResult TestDb()
        {
            try
            {
                var count = _db.User.Count();
                Console.WriteLine($"Test DB: Total Users = {count}");
                return Ok(new { TotalUsers = count });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Test DB error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
