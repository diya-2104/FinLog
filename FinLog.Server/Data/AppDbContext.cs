using FinLog.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FinLog.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Transactions> Transactions { get; set; }
        //public DbSet<AccountingEntry> AccountingEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("User");

            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.uid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.uid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Income>()
                .HasOne(i => i.Account)
                .WithMany(a => a.Incomes)
                .HasForeignKey(i => i.account_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Income>()
                .HasOne(i => i.User)
                .WithMany(u => u.Incomes)
                .HasForeignKey(i => i.uid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.Category)
                .WithMany(c => c.Expenses)
                .HasForeignKey(e => e.cid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.uid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transactions>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.uid)
                .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<Transactions>()
            //    .HasOne(t => t.Category)
            //    .WithMany(c => c.Transactions)
            //    .HasForeignKey(t => t.cid)
            //    .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<Transactions>()
            //    .HasOne(t => t.Account)
            //    .WithMany(a => a.Transactions)
            //    .HasForeignKey(t => t.account_id)
            //    .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<AccountingEntry>()
            //    .HasOne(ae => ae.Account)
            //.WithMany(a => a.AccountingEntries)
            //    .HasForeignKey(ae => ae.account_id)
            //    .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<AccountingEntry>()
            //    .HasOne(ae => ae.User)
            //    .WithMany()
            //    .HasForeignKey(ae => ae.uid)
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
