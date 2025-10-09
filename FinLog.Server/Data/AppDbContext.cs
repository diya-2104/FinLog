using FinLog.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> User { get; set; }
    }
}
