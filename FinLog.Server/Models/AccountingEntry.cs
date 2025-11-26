using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("AccountingEntry")]
    public class AccountingEntry
    {
        [Key] public int entry_id { get; set; }
        [Required] public int uid { get; set; }
        [ForeignKey("uid")] public User User { get; set; }
        
        [Required] public string transaction_reference { get; set; } // Links related entries
        [Required] public int account_id { get; set; }
        [ForeignKey("account_id")] public Account Account { get; set; }
        
        [Required] public decimal debit_amount { get; set; } = 0;
        [Required] public decimal credit_amount { get; set; } = 0;
        [Required] public string description { get; set; }
        [Required] public DateTime entry_date { get; set; } = DateTime.UtcNow;
        
        public string source_type { get; set; } // "Income", "Expense", "Transfer"
        public int? source_id { get; set; } // Original income/expense ID
    }
}