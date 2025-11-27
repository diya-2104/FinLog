using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Account")]
    public class Account
    {
        [Key] 
        public int account_id { get; set; }
        [Required] 
        public int uid { get; set; }
        [ForeignKey("uid")] 
        public User? User { get; set; }
        [Required] 
        public string? account_name { get; set; }
        [Required]
        public string account_type { get; set; } // "Asset", "Liability", "Equity", "Income", "Expense"
        public decimal balance { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;

        public ICollection<Income>? Incomes { get; set; }


    }
}
