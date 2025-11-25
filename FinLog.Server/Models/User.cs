using System.ComponentModel.DataAnnotations;

namespace FinLog.Server.Models
{
    public class User
    {
        [Key]
        public int uid { get; set; }
        [Required]
        public string fname { get; set; }
        [Required]
        public string lname { get; set; }
        [Required, EmailAddress]
        public string email { get; set; }
        [Required]
        public string password { get; set; }

        public ICollection<Category> Categories { get; set; }
        public ICollection<Income> Incomes { get; set; }
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<Transactions> Transactions { get; set; }

    }   
}