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
                var allUsers = await _db.Users.ToListAsync();
                Console.WriteLine($"All users count: {allUsers.Count}");
                
                var totalUsers = allUsers.Count;
                var verifiedUsers = allUsers.Count(u => u.IsEmailVerified);
                
                Console.WriteLine($"Total Users: {totalUsers}, Verified: {verifiedUsers}");
                
                var stats = new
                {
                    TotalUsers = totalUsers,
                    VerifiedUsers = verifiedUsers,
                    UnverifiedUsers = totalUsers - verifiedUsers,
                    ActiveUsers = (int)(totalUsers * 0.6)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
