using FinLog.Server.Data;
using FinLog.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinLog.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly string[] pastelColors = new string[]
     {
            "#FFD1DC", // pink
            "#AEC6CF", // blue
            "#77DD77", // green
            "#FFF5BA", // yellow
            "#CBAACB"  // purple
     };


        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/category
        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] int uid)
        {
            var categories = await _context.Categories
                                           .Where(c => c.uid == uid)
                                           .ToListAsync();

            if (categories == null || !categories.Any())
                return NotFound("No categories found for this user.");

            return Ok(categories);
        }

        // POST: api/category
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.cname))
                return BadRequest("Category data is invalid.");

            // Optional: check if user exists
            var userExists = await _context.User.AnyAsync(u => u.uid == category.uid);
            if (!userExists)
                return BadRequest($"User with id {category.uid} not found.");

            if (string.IsNullOrWhiteSpace(category.color))
            {
                var random = new Random();
                category.color = pastelColors[random.Next(pastelColors.Length)];
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound($"Category with id {id} not found.");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully.", category });
        }

    }
}
