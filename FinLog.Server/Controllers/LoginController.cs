using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public LoginController(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.email == request.email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.password, request.password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // ✅ Optionally: create session
            HttpContext.Session.SetString("UserId", user.uid.ToString());

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.uid,
                    user.fname,
                    user.lname,
                    user.email
                }
            });
        }
    }
}
