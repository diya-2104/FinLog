using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Transactions")]
    public class Transactions
    {
        [Key] public int tid { get; set; }
        [Required] public int uid { get; set; }
        [ForeignKey("uid")] public User ?User { get; set; }
        [Required] public string? ttype { get; set; } // income/expense
        public int ref_id { get; set; } // link to Income.iid or Expense.eid
        [Required] public int account_id { get; set; }
        [ForeignKey("account_id")] public Account ?Account { get; set; }
        public string ?description { get; set; }
        [Required, Column(TypeName = "decimal(18,2)")] public decimal tamount { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
    }
}
