using FinLog.Server.Data;
using FinLog.Server.Models;
using FinLog.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IEmailService _emailService;

        public RegisterController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.User.AnyAsync(u => u.email == request.email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var verificationToken = Guid.NewGuid().ToString();
            
            var user = new User
            {
                fname = request.fname,
                lname = request.lname,
                email = request.email,
                EmailVerificationToken = verificationToken
            };

            user.password = _passwordHasher.HashPassword(user, request.password);

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendVerificationEmailAsync(user.email, user.fname, verificationToken);
                return Ok(new { message = "Registration successful. Please check your email to verify your account." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
                Console.WriteLine($"\n=== EMAIL VERIFICATION ===\nUser: {user.email}\nVerification Link: https://localhost:7123/api/register/verify?token={verificationToken}\n========================\n");
                return Ok(new { message = "Registration successful. Check console for verification token (email failed)." });
            }
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
            
            if (user == null)
                return BadRequest(new { message = "Invalid verification token" });

            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Email verified successfully" });
        }
    }
}
