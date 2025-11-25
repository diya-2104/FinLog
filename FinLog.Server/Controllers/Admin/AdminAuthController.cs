using Microsoft.AspNetCore.Mvc;
using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Controllers.Admin
{
    [Route("api/admin/auth")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContext;

        public AdminAuthController(IConfiguration config, IHttpContextAccessor httpContext)
        {
            _config = config;
            _httpContext = httpContext;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest request)
        {
            var adminEmail = _config["AdminCredentials:Email"];
            var adminPassword = _config["AdminCredentials:Password"];

            if (request.Email == adminEmail && request.Password == adminPassword)
            {
                _httpContext.HttpContext.Session.SetString("IsAdmin", "true");
                return Ok(new { success = true });
            }

            return Unauthorized("Invalid credentials");
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _httpContext.HttpContext.Session.Remove("IsAdmin");
            return Ok();
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            var isAdmin = _httpContext.HttpContext.Session.GetString("IsAdmin") == "true";
            return Ok(new { isAdmin });
        }
    }
}