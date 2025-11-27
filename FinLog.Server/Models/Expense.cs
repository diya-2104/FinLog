using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
    [Table("Expense")]
    public class Expense
    {
        [Key] public int eid { get; set; }
        [Required] public DateTime edate { get; set; }
        [Required, Column(TypeName = "decimal(18,2)")] public decimal eamount { get; set; }
        [Required] public int cid { get; set; }
        [ForeignKey("cid")] public Category? Category { get; set; }
        [Required] public int account_id { get; set; }
        [ForeignKey("account_id")] public Account? Account { get; set; }
        [Required] public int uid { get; set; }
        [ForeignKey("uid")] public User? User { get; set; }
    }
}